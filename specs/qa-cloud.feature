Feature: QA Agents Cloud pilot section
  As a prospective client
  I want to see what the QA Agents Cloud pilot is and how it looks in use
  So that I can decide whether to request a pilot

  Background:
    Given I navigate to "https://hamingcs.com/"
    And I scroll to the "QA AGENTS CLOUD" section (id "qa-cloud"), placed after "HOW I ENGAGE" and before the FAQ

  Scenario: Heading and introduction are in the first person
    Then the heading is "AI agents test your software. You decide what gets filed."
    And the introduction reads: "QA Agents Cloud is the testing product I built and run myself. Give it the address of your web application. A small team of AI agents plans the tests, writes them and runs them, then writes up each bug it finds: the steps to reproduce, what it expected and what actually happened. A person decides which bugs get filed to GitHub Issues or Jira Cloud, or exported as a CSV file, and you choose how strict that is."
    And it is written in the first person ("I"), left-aligned (never justified), with hyphenation off and a line length of about 70ch
    And a second, smaller and muted paragraph says: "Everything below comes from a run on a sample application, not from a customer."
    And the section text contains no "we" or "our" as a word

  Scenario: The section runs in this order: intro, See it live, A small QA team, Standup room, Approvals, Run rules, Run details, Cost, Start with a pilot, then the "Why it's different" list
    Then a hero card has the headline "A small QA team, working in the open." and one paragraph on the left, and the Overview screenshot on the right in the same dark teal-bordered frame
    And the Overview screenshot shows the sidebar section names and the live agent count, with its caption "The Overview: what happened, and what needs you."
    And the image is lazy-loaded, has the alt text "The QA Agents Cloud Overview: what happened across your targets and what needs your approval, with live agent count.", opens in the lightbox, and on narrow screens stacks under the text
    And the hero card does not use the agent map image and repeats no text from the paragraph
    And the paragraph names the coordinator, planner, generator, executor, triage agent and reporter, says the coordinator sends a case that does not add up back to the right agent, and says the Standup room keeps the conversation
    And no claim is repeated and the paragraph never says agents message each other directly or talk like people
    And below it a "Standup room" card shows two full-width transcript screenshots, one per row, each with its caption and a line saying it is a recorded, read-only transcript of a finished run
    And below that a slim full-width card shows the live progress image
    And below that two full-width rows are titled "Approvals" and "Run rules", each with its caption; Approvals also has a one-line benefit, while Run rules, Run results, Concurrency and Cost keep their own text (no duplicated benefit line)
    And in each row the screenshot takes about 60% of the width and the text (title, benefit line, caption) sits on the other side
    And the screenshot sits on the left in the Approvals row and on the right in the Run rules row
    And below that a "Run details" heading is followed by two full-width rows, "Run results" (screenshot on the right) and "Concurrency" (screenshot on the left)
    And at 1280 px no screenshot in these rows is narrower than 480 px
    And the Concurrency image is the chart only (no description line and no toggle), cropped at 2x
    And below that a full-width "Cost" row follows (screenshot on the left), and then the pilot block
    And after the pilot block the "Why it's different" list closes the section
    And at 390 px every row is a single column with the screenshot first, then the title, benefit line and caption, and the page has no horizontal scroll

  Scenario: Nine dark screenshots are shown, each with its caption inside its card, in this order
    Then the section shows 9 figures in this order, with these exact captions:
      | figure           | caption |
      | Agent map        | The agents of a run and how they work together. From a small run on a sample application. |
      | Standup room (a) | The Standup room: the coordinator sends a test case back to the planner, and the fix goes on to the test generator. From a finished run on a sample application. |
      | Standup room (b) | Triage sorts the failures into real bugs and environment issues, with a confidence level, and the reporter sends back its filing decisions. From a finished run on a sample application. |
      | Live progress    | A run in progress: how many agents are working and how far along it is. From a run on a sample application. |
      | Approvals        | Under the Strict rule, every bug waits for your approval before it is filed. Under the default Standard rule, only low-severity, high-confidence bugs are filed automatically. |
      | Run rules        | Who approves bugs, and how many tester agents run at once (up to 3 by default). Windows desktop apps are always Strict and run one tester agent at a time. |
      | Estimated cost   | Estimated cost by agent for the same run: the first four of eight agents. Costs are estimates; your own Anthropic account is billed directly. |
      | Run results      | A finished run on a sample application: tests, findings, and what needs approval. My own run, not a customer result. |
      | Concurrency      | How many agents ran at the same time in one run. The tester limit is a setting I choose, not a guarantee. From a run on a sample application. |
    And each caption is in the page's normal text size (not smaller than the body text) and sits inside its card (beside the image in the alternating rows, below it in the hero and the strip)
    And the light screenshots, the "workers only" concurrency image and the other agent-map captures are not used
    And no screenshot shows an email address, tenant name, token, key, URL or real target name (names and run IDs are blurred or cropped)

  Scenario: Screenshots sit in dark frames that match the app
    Then each screenshot is inside a frame with the app's dark background "#10161a" (the CSS variable "--app-dark"), a 1px subtle teal border, rounded corners and a soft teal glow
    And no element in the section has a white background
    And each image fills the frame width, keeps its aspect ratio, has explicit width and height attributes, loads lazily and has descriptive alt text
    And no image has an opacity animation or a fade-in from grey
    And the page has no horizontal scroll at 390 px

  Scenario: Every screenshot can be enlarged
    When I click or press Enter on any of the 9 screenshots
    Then a dialog opens showing the full-size image and its caption
    And focus moves into the dialog, "Esc" or the "Close" button closes it, and focus returns to the screenshot
    And without JavaScript the screenshot is a link that opens the full-size image in a new tab with rel "noopener"

  Scenario: The pilot block holds the request button
    Then a "Start with a pilot" block follows the cards
    And it says the first step is a paid, fixed-scope pilot, that scope and fee are agreed in writing, and that I make no promises about results
    And it says Windows desktop testing is proven on a sample application, not yet with a customer
    And it has a "Request a pilot" button linking to "mailto:info@hamingcs.com?subject=QA%20pilot%20request"
    And it shows no price, no hosted offer, no licence and no maintenance, support, marketing or product-management agents

  Scenario: A "See it live" video sits at the top of the section
    Then a "See it live" card sits under the intro and above the "Agents that work as a team." card
    And it says "A run on a sample application, in under two minutes."
    And the video is a 16:9 poster inside the same dark frame as the screenshots, with a visible "Play" button
    When the page loads, then no request goes to youtube.com or youtube-nocookie.com and nothing plays
    When I click the Play button, or focus it and press Enter or Space
    Then the poster is replaced by an iframe from "https://www.youtube-nocookie.com/embed/<id>" with autoplay=1 and rel=0, and a title attribute
    And without JavaScript the poster is a link to the video
    And below it a line reads "Want to see it live with your own questions? Email me and I'll set up a short walkthrough."
    And an "Ask for a walkthrough" secondary button links to "mailto:info@hamingcs.com?subject=QA%20Agents%20Cloud%20walkthrough"
    And that line says nothing about a hosted trial, a response time or a price
    And the "Request a pilot" button and the pilot block are unchanged
    And on a 390 px screen the frame is full width with no horizontal scroll

  Scenario: The placeholder video ID can never ship
    Then index.html does not contain "PLACEHOLDER_YOUTUBE_ID"
    And "node scripts/check-no-placeholder.mjs" exits with code 0

  Scenario: "Why it's different" is a plain visible list of eight verified points after the pilot block
    Then the block (id "why-different") sits after "Start with a pilot" and is a real list (ul/li) of 8 visible points: no accordion, no details/summary, nothing collapsed and no script, in two columns (4 + 4) from 900 px wide and one column below that, card-free and muted like the rest of the section
    And the block has the heading "Why it's different" and exactly 8 points, each with its title as a bold lead-in (strong, not a heading) followed by its text, in this order: "You stay in control", "You can read the work", "You see the cost", "It fits how you work", "Honest about what's proven", "Your time goes where it counts", "Scale the team up or down" and "Need another role?"
    And every claim in them is one the app or the code shows (Standard and Strict, Windows desktop always Strict, the Standup room, an estimated cost per agent, CSV and Jira-import downloads, GitHub Issues and Jira Cloud, an email summary and a Slack webhook, a tester limit of 1 to 3 with a default of 3)
    And the tester limit is described as a setting the coordinator is told to stay within, and says the other agents are not limited by it; it is not called enforced, guaranteed or a hard cap
    And it says Windows desktop is proven on a sample application only, not yet with a customer, and does not claim Arabic or right-to-left support beyond having run it on sample applications
    And it names only QA-team roles (never maintenance, support, marketing or product-management agents), gives no hours-saved or percentage figure, no price, no hosted offer and no licence mention
    And the last point reads "Need a different role on the team, such as another kind of tester? I can build that as another agent. It is agreed in writing as part of the pilot scope."
    And it uses "I" and never "we" or "our"

  Scenario: Stylesheet and script URLs carry a version so the video handler is never stale
    Then index.html loads "styles.css?v=" and "site.js?v=" with a version value that is changed whenever either file changes
    And before Play is pressed the page makes no request to youtube.com or youtube-nocookie.com
    And pressing Play replaces the poster with a youtube-nocookie.com embed, and without script the poster link opens the YouTube watch URL
