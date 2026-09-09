# QA pipeline orchestration

Parallelism is not uniform across stages — see the reasoning in
docs/architecture.md's "Parallelism: uncapped where safe, capped where
not" design principle before changing any of the numbers below.
test-planner and test-generator (steps 3-4) have no cap: run every
module in scope at once. test-executor (steps 5, 7, 9) stays capped at
3 concurrent calls per batch, and desktop-target (pywinauto) modules
within a batch always run one at a time regardless of that cap — both
are safety constraints, not throttling for its own sake.

When asked to test a change, follow this sequence:

1. Invoke `regression-watcher` directly to scope the change and
   partition it by module — it has its own read-only git MCP access
   (see docs/architecture.md's known-limitations section) and computes
   the changed-file list itself now; the orchestrator no longer runs
   `git diff` on its behalf. By default it scopes today's uncommitted
   working-tree changes; tell it explicitly if you need it to scope a
   specific range instead (a PR branch against `main`, a specific
   commit). It returns:
   {
     "partitions": { "auth": [...changed files], "billing": [...changed files] },
     "impacted_modules": { "search": [["...changed file(s), then any intermediate module(s), search depends on"]] },
     "shared_resources": [["moduleA", "moduleB"], ...],
     "pure_refactor_modules": [...],
     "batches": [["auth", "billing", "search"]],
     "scope": "incremental" | "full",
     "regression_suite_modules": ["auth", "billing", "search"],
     "regression_batches": [["auth", "billing", "search"]]
   }

   `impacted_modules` lists modules with no file of their own in the
   diff, but that depend — directly or transitively, up to 3 hops, via
   a textual reference check, see regression-watcher.md — on something
   that did change. Each value is a *list of chains* (usually one, but
   a module reachable more than one independent way gets one chain per
   path). `batches` already has these merged in with `partitions`'
   modules, deduplicated and capped at 3 (this is the execution-stage
   grouping used in step 5 onward — steps 3-4 use the flatter
   `scope_modules` set from step 2 instead); treat every module the
   same way regardless of which of the two fields it came from.

2. Build `scope_modules`: every key in `partitions` plus every key in
   `impacted_modules`, minus anything in `pure_refactor_modules` (see
   "Cost control" below — those get skipped for planning/generation,
   not dropped from the run entirely). If `scope` is "full",
   `scope_modules` is just the single returned partition's module(s),
   same skip rule. This replaces batching for the planning/generation
   stages below — there's no shared-state or resource reason to
   throttle either of them (see docs/architecture.md), so they're not
   batch-gated at all.

3. Invoke `test-planner` for EVERY module in `scope_modules`, ALL IN
   PARALLEL — no cap. Wait for all of them to return before continuing.

   If a use case specification or requirements document exists for the
   module (check docs/, specs/, or wherever the repo keeps them),
   test-planner should read it and derive test cases from its flows
   rather than inferring purely from code. Each call also writes/
   overwrites docs/test-plans/{module}.md with the full table and
   coverage map — this is the durable record of every test case
   decided on, not just the ones that end up failing.

4. For each module's test plan, invoke `test-generator` for EVERY
   module, ALL IN PARALLEL — no cap, same reasoning as step 3. Each
   generator writes to its own file: tests/generated/{module}_test.py.
   `test-generator` doesn't have shell access, so once each call
   returns, run the linter/type-checker on the file it just wrote
   yourself (see "Fail-fast gate" below for what to do if it fails).

5. Now the execution stage, where the cap and shared-resource/
   desktop-serialization rules DO apply (see docs/architecture.md for
   why this stage is different from steps 3-4). Use the `batches` array
   returned by regression-watcher directly (it already respects the
   3-cap and keeps any `shared_resources` pair out of the same batch —
   do not re-derive batching yourself). Process one batch fully before
   starting the next — never exceed 3 concurrent `test-executor` calls
   within a batch.

   Invoke `test-executor` for each module in the current batch, each
   targeting only its own generated file. `test-executor`'s native
   subagent type doesn't have shell access in this Claude Code version,
   and its whole job is running a process — unlike `regression-watcher`
   (direct git MCP access) or `test-generator` (orchestrator runs the
   linter on its behalf), there's no read-only MCP tool or orchestrator-
   side substitute for actually executing a test. So invoke it
   via the `general-purpose` agent type instead, giving it the full
   contents of `.claude/agents/test-executor.md` as its operating
   instructions verbatim, plus the specific file (or regression suite)
   to run for this call. This applies to every `test-executor`
   invocation in this pipeline — here, step 7's regression phase, and
   step 9's flaky retries alike — not just this one.

   Before running a batch, check each module's generated test file for
   pywinauto vs. Playwright imports (same detection rule as
   test-executor.md's "Detecting target type"). If more than one module
   in the batch is desktop-target (pywinauto), run those specific ones
   one at a time rather than concurrently, even though the batch's
   general cap allows up to 3 — concurrent desktop UI automation on one
   desktop session isn't safe (they fight over focus/input), so this is
   a hard rule, not a tunable one. Browser-target (Playwright) modules
   in the same batch stay concurrent with each other and with whichever
   desktop module is currently running.

   Each writes results to results/{module}.json — never a shared file.
   For each module, once its results are in, invoke `test-generator`
   again in its promotion mode, passing it that module's
   results/{module}.json: it merges any passed tests into
   tests/regression/{module}_test.py, the module's persistent regression
   suite, and once it returns, run the linter/type-checker on that file
   yourself too, same as step 4. This runs regardless of the gate
   outcome in step 10 below — promotion is about whether the test
   passed, not about triage of other failures.

6. Move to the next batch of modules (if any) and repeat step 5 only —
   planning and generation (steps 3-4) already ran once for every
   module in `scope_modules`, not per batch.

7. Once ALL diff batches finish, run the regression phase: for each
   batch in `regression_batches`, invoke `test-executor` — via
   `general-purpose` per step 5's note, same 3-cap and desktop-
   serialization rule — once per module, each given that module's
   whole tests/regression/{module}_test.py to run in full (the standing
   exception to "one test file at a time"). Each writes to
   results/{module}_regression.json. This runs for every module with
   an accumulated suite, not just modules touched by today's diff —
   the point of a regression suite is to catch breakage the current
   diff didn't obviously touch.

8. Merge every results/{module}.json from steps 5-6 and every
   results/{module}_regression.json from step 7, and invoke
   `triage-analyzer` on the full merged set (triage stays sequential —
   it needs the full picture to spot cross-module patterns). Each
   result's `source` field ("generated" or "regression") is part of
   what triage-analyzer weighs. This may flag some failures as
   suspected-flaky-needs-rerun rather than giving them a final
   classification.

   "Merge" means the specific files YOUR OWN steps 5-7 just wrote this
   run — track them explicitly as you go (you already know exactly
   which module each `test-executor` call targeted and what file it
   wrote). Never substitute this with `Glob results/*.json` and assume
   everything present belongs to this run: nothing clears `results/`
   between runs, so it accumulates files from every run ever done,
   including different diffs, different commits, and one-off manual
   checks. Merging in a stale leftover file feeds triage-analyzer wrong
   data with no signal that anything's off — see docs/architecture.md's
   "Resilience and recovery" section.

9. For each failure triage-analyzer flagged as suspected-flaky,
   re-invoke test-executor (via `general-purpose`, same as steps 5 and
   7, including the desktop-serialization rule if more than one retry
   happens to be a pywinauto module) for just that test, up to 2x, writing to
   results/{module}_retry_{n}.json each time (never overwriting the
   original results file). Then invoke triage-analyzer again, giving
   it only those retry file(s) — not the full merged set — to produce
   a final classification for those tests.

10. First filter by classification: only failures triage-analyzer
    classified as "Real bug" proceed to the gate below. A failure
    classified "Environment issue" is never filed, regardless of
    severity/confidence — it says nothing about the target repo's
    correctness (a test-technique limitation like asserting on
    OS-level behavior browser automation can't observe, a bug in the
    generated test script itself, a missing local dependency), so
    filing it on the target repo's issue tracker would misrepresent it
    as a product defect. Report every "Environment issue" failure to
    the human directly in the run's final summary, with
    triage-analyzer's own notes on why — this is signal about the
    pipeline's own quality, not something to gate/file/hold the way a
    real bug is. A failure triage-analyzer still can't resolve past
    "Flaky" even after step 9's retries gets the same treatment: report
    it, don't file it.

    (This is exactly what happened on this project's own first real
    run: `#4` and `#5` were auto-filed as if they were site bugs — a
    mailto-observability test-technique limitation and a bug in
    generated test code — purely because the old gate only checked
    severity/confidence, never classification. This fix is a direct
    response to that.)

    Apply the severity/confidence gate per failure, not per batch, to
    everything that IS classified "Real bug": severity is one of
    critical/high/medium/low (triage-analyzer's scale). A failure
    auto-clears the gate ONLY when severity is
    exactly "low" AND confidence is exactly "high" — invoke bug-reporter
    for it directly. Every other combination (critical, high, or medium
    severity — at any confidence — or low/medium confidence at any
    severity) holds for human approval before filing. Bugs that clear
    the gate should still be filed even if other failures in the same
    batch are held for human input — don't block the whole batch on the
    slowest gate.

    bug-reporter has no shell access (see docs/architecture.md's
    known-limitations section), so issue filing is GitHub Issues,
    orchestrator-mediated via the GitHub MCP server (`.mcp.json`, see
    docs/data-model.md's "Issue tracker: GitHub Issues" setup section):
    before the first bug-reporter call in this step, fetch the current
    open-issues snapshot ONCE — `mcp__github__list_issues` (owner
    RachidSo, repo hamingcswebsite, state OPEN) — and reuse it for
    every filing decision in this step (don't refetch per failure). Pass
    that snapshot plus the failure (or shared-root-cause group) to
    bug-reporter; it returns a list of `{action, ...}` decisions (see
    bug-reporter.md's "Output shape"). Execute each one via the GitHub
    MCP tools:
    - `create`: `mcp__github__issue_write` (method create, owner
      RachidSo, repo hamingcswebsite, title, body, labels). Pass
      `module:{module}` directly in `labels` alongside `qa-pipeline` and
      the rest — no pre-check or separate create-label call needed:
      confirmed live that `issue_write` auto-creates any label that
      doesn't exist yet (default color, no extra call), unlike the old
      `gh label create ... swallow already-exists` step this replaces.
    - `comment`: `mcp__github__add_issue_comment` (owner, repo,
      issue_number, body).
    No body-file step needed for either — these are structured
    parameters, not a shell string, so the quoting risk that motivated
    the body-file pattern elsewhere in this project doesn't apply here.

11. Once all modules' failures (if any) have been filed or held per
    step 10, invoke bug-reporter ONE time in its closing mode for the
    whole run, passing it every results/{module}.json and
    results/{module}_regression.json produced this run (the same
    merged set from step 8 — same "your own steps' files, not a blind
    glob" rule applies here too) — not scoped to a single module. This
    has to be a single, whole-run call rather than one per module: an
    issue's `**Linked tests:**` line can name test IDs in a *different*
    module (see bug-reporter.md's shared root cause grouping), and
    closing an issue correctly requires seeing every linked module's
    results at once, not just one. This doesn't need the human gate —
    a passing test is unambiguous evidence.

    Fetch a FRESH open-issues snapshot for this step (step 10 may have
    created new ones this run, and this step needs the true current
    state regardless) via the same `mcp__github__list_issues` call as
    step 10. bug-reporter returns a list of `{action: "close", number,
    body}` decisions; execute each as TWO MCP calls per issue (confirmed
    live — `issue_write` has no comment parameter of its own, so closing
    and commenting aren't atomic the way `gh issue close --comment`
    was): `mcp__github__issue_write` (method update, issue_number,
    state closed, state_reason completed), then
    `mcp__github__add_issue_comment` (issue_number, body: the closing
    comment).

Never run test-executor concurrently across modules that share a
database, port, or fixture — check regression-watcher's
"shared_resources" flag before parallelizing execution (steps 5, 7, 9).
If a module pair shares a resource, force them into the same sequential
slot even within a batch. This applies to `regression_batches` too.
This rule, like the batch cap and desktop-serialization rule, is
specific to the execution stage — it has no bearing on steps 3-4, which
aren't batched and don't run any process that could contend for a
shared resource.

## Fail-fast gate

You (the orchestrator) run the linter/type-checker after every
test-generator call, per steps 4 and 5 above — test-generator no longer
runs it itself. If the file doesn't lint or compile, send the error back
to test-generator once for a fix. If it fails again, escalate to a human
rather than looping indefinitely.

## Resuming after an interruption

A subagent call can fail to report back (an API error, a rate limit, the
orchestrating session itself getting interrupted mid-run) even though
its work actually completed on the provider side before the failure
surfaced — confirmed directly: this happened during a real run, and the
file the "failed" call was supposed to write already existed, correct,
when checked afterward. Don't treat a failed/interrupted call as proof
nothing happened. Before retrying any step, verify actual state first:

- A subagent call that writes a file (test-planner, test-generator,
  test-executor): read the target file. If it already has the expected
  content, you're done — don't re-invoke.
- A GitHub Issues filing/closing decision: re-fetch the open-issues
  snapshot fresh (via `mcp__github__list_issues`, per steps 10-11)
  before deciding anything — this is already the
  rule regardless of interruption, and it's what makes retrying safe:
  duplicate detection runs against live GitHub state, not anything
  cached locally, so a retry-from-scratch after a crash self-corrects
  rather than risking a duplicate issue.
- results/{module}.json and results/{module}_regression.json are always
  overwritten by module name, never appended — re-running a
  test-executor call you're unsure about is always safe, worst case a
  harmless identical re-run.

The one thing that does NOT self-correct: results/ is never cleared
between runs (see step 8's note above and docs/architecture.md's
"Resilience and recovery" section) — a resumed or restarted run still
has to track exactly which files its own steps produced, same as a
normal run.

## Cost control

- Skip test-planner and test-generator entirely for pure refactors with
  no behavior-changing signals in the diff (regression-watcher should
  flag this in its output). The regression phase (step 7) still runs
  for these modules if they already have a suite — a refactor can still
  break previously-passing behavior even with no new tests to write.
  This skip never applies to an `impacted_modules` entry — nothing in
  its own code changed for regression-watcher to classify as a
  refactor, so there's nothing to skip on that basis; it's in scope
  because a dependency changed, and that needs a real test pass.
- Cap any single retry loop at 2 attempts before escalating to a human.
  This is the default; the fail-fast gate above uses a stricter 1-retry
  cap for lint/compile failures specifically — that's an intentional
  override, not an inconsistency.
