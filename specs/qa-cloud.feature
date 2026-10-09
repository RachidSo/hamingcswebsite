Feature: QA Agents Cloud pilot section
  As a prospective client
  I want to see what the QA Agents Cloud pilot is and how it looks in use
  So that I can decide whether to request a pilot

  Background:
    Given I navigate to "https://hamingcs.com/"
    And I scroll to the "QA AGENTS CLOUD" section (id "qa-cloud"), placed after "HOW I ENGAGE" and before the FAQ

  Scenario: Heading and introduction are in the first person
    Then the heading is "AI agents test your software. You decide what gets filed."
    And the introduction is 2 to 3 sentences written in the first person ("I")
    And it says the screenshots come from runs on a sample application, not from a customer
    And the section text contains no "we" or "our" as a word

  Scenario: The section is laid out as a hero, a strip, a row of three cards and a "Run details" row
    Then a hero card shows the agent map large, with the headline "Agents that work as a team." and two short lines of text beside it
    And below it a slim full-width card shows the live progress image
    And below that a row of three cards is titled "Approvals", "Run rules" and "Cost", each with a one-line benefit above its image
    And below that a "Run details" row holds two cards, "Run results" and "Concurrency"
    And the pilot block follows
    And at 390 px every card is in a single column and the page has no horizontal scroll

  Scenario: Seven dark screenshots are shown, each with its caption inside its card, in this order
    Then the section shows 7 figures in this order, with these exact captions:
      | figure           | caption |
      | Agent map        | The agents of a run and how they work together. From a small run on a sample application. |
      | Live progress    | A run in progress: how many agents are working and how far along it is. From a run on a sample application. |
      | Approvals        | Under the Strict rule, every bug waits for your approval before it is filed. Under the default Standard rule, only low-severity, high-confidence bugs are filed automatically. |
      | Run rules        | Run rules: who approves bugs, and how many tests run at once. Windows desktop apps are always Strict and run one at a time. |
      | Estimated cost   | Estimated cost by agent for the same run: the first four of eight agents. Costs are estimates; your own Anthropic account is billed directly. |
      | Run results      | A finished run on a sample application: tests, findings, and what needs approval. My own run, not a customer result. |
      | Concurrency      | How many agents ran at the same time in one run. The tester limit is a setting I choose, not a guarantee. |
    And each caption is in the page's normal text size (not smaller than the body text) and sits inside its card, below the image
    And the light screenshots, the "workers only" concurrency image and the other agent-map captures are not used
    And no screenshot shows an email address, tenant name, token, key, URL or real target name (names and run IDs are blurred or cropped)

  Scenario: Screenshots sit in dark frames that match the app
    Then each screenshot is inside a frame with the app's dark background "#10161a" (the CSS variable "--app-dark"), a 1px subtle teal border, rounded corners and a soft teal glow
    And no element in the section has a white background
    And each image fills the frame width, keeps its aspect ratio, has explicit width and height attributes, loads lazily and has descriptive alt text
    And no image has an opacity animation or a fade-in from grey
    And the page has no horizontal scroll at 390 px

  Scenario: Every screenshot can be enlarged
    When I click or press Enter on any of the 7 screenshots
    Then a dialog opens showing the full-size image and its caption
    And focus moves into the dialog, "Esc" or the "Close" button closes it, and focus returns to the screenshot
    And without JavaScript the screenshot is a link that opens the full-size image in a new tab with rel "noopener"

  Scenario: The pilot block holds the request button
    Then a "Start with a pilot" block follows the cards
    And it says the first step is a paid, fixed-scope pilot, that scope and fee are agreed in writing, and that I make no promises about results
    And it says Windows desktop testing is proven on a sample application, not yet with a customer
    And it has a "Request a pilot" button linking to "mailto:info@hamingcs.com?subject=QA%20pilot%20request"
    And it shows no price, no hosted offer, no licence and no maintenance, support, marketing or product-management agents
