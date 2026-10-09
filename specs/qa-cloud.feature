Feature: QA Agents Cloud pilot section
  As a prospective client
  I want to see what the QA Agents Cloud pilot is and how it looks in use
  So that I can decide whether to request a paid pilot

  Background:
    Given I navigate to "https://hamingcs.com/"
    And I scroll to the "QA AGENTS CLOUD" section (id "qa-cloud"), placed after "HOW I ENGAGE" and before the FAQ

  Scenario: Heading and introduction are in the first person
    Then the heading is "AI agents test your software. You decide what gets filed."
    And the introduction is 2 to 3 sentences written in the first person ("I")
    And it says the screenshots come from runs on a sample application, not from a customer
    And the section text contains no "we" or "our" as a word

  Scenario: Five screenshots are shown, each with its caption, in this order
    Then the section shows 5 figures in this order, with these exact captions:
      | figure           | caption                                                                                                              |
      | Approvals        | Under the Strict rule, every bug waits for your approval before it is filed. Under the default Standard rule, only low-severity, high-confidence bugs are filed automatically. |
      | Run results      | A finished run on a sample application: tests, findings, and what needs approval. My own run, not a customer result. |
      | Concurrency      | How many agents ran at the same time in one run. The tester limit is a setting I choose, not a guarantee.            |
      | Run rules        | Run rules: who approves bugs, and how many tests run at once. Windows desktop apps are always Strict and run one at a time. |
      | Estimated cost   | Estimated cost by agent for the same run. Costs are estimates; your own Anthropic account is billed directly.        |
    And the live progress and agent map figures are added when those screenshots exist; there is no broken image reference in the meantime
    And the "workers only" concurrency image is not used

  Scenario: Screenshots sit in a window frame that matches the app
    Then each screenshot is inside a frame with the background "#f4f6f5" (the CSS variable "--app-bg"), a 1px border, rounded corners, a soft shadow and 8 to 20 px of padding
    And each image fills the frame width, keeps its aspect ratio, has explicit width and height attributes, loads lazily and has descriptive alt text
    And each frame is a link that opens the full-size image in a new tab with rel "noopener"
    And the page has no horizontal scroll at 390 px

  Scenario: The pilot block holds the request button
    Then a "Start with a paid pilot" block follows the figures
    And it says the pilot is paid and fixed-scope, that scope and fee are agreed in writing, and that I make no promises about results
    And it says Windows desktop testing is proven on a sample application, not yet with a customer
    And it has a "Request a paid pilot" button linking to "mailto:info@hamingcs.com?subject=QA%20pilot%20request"
    And it shows no price, no hosted offer, no licence and no maintenance, support, marketing or product-management agents
