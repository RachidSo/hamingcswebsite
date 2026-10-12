Feature: Section visuals
  As a visitor
  I want a simple picture next to the text in Services, Engagement and Working principles
  So that the structure of each section is clear at a glance, without any new claims

  Background:
    Given the Hamingcs website is deployed at "https://hamingcs.com"

  Scenario: Services shows three overlapping circles, one per discipline
    When I view the "Three disciplines. One engagement." section
    Then between the intro line and the first discipline block there is a diagram of three overlapping circles, each with a line icon (the same three icons as the discipline blocks)
    And the labels are fragments of the three existing discipline headings: "Data vision" (from "Strategy, leadership & data vision"), "Run in production" (from "Architecture built to run in production") and "Team leadership" (from "Business strategy, P&L, and team leadership")
    And the overlap is marked and labelled "One engagement"
    And the three discipline text blocks are unchanged and in their original place

  Scenario: Engagement shows four doorways leading to one point
    When I view the "Four ways in, one point of contact." section
    Then above the four model cards there is a diagram with four doorways, one for each existing model name: "Advisory", "Interim leadership", "Project delivery" and "QA Agents Cloud pilot"
    And the four paths converge on a single point labelled "One point of contact"
    And the four model cards are unchanged

  Scenario: Working principles carry an icon each
    When I view the "A few working principles" list
    Then an icon sits above the heading of each of the three principles: a dial for "Strategy is only useful if someone can operate it", a shield with layers for "Security and scale are designed in, not added later" and a map pin for "I work where you are"
    And the principle text and layout are unchanged

  Scenario: The visuals are accessible and add no claims
    Then each diagram sits in an element with role "img" and an aria-label that names its labels and points to the text blocks as the full version
    And the three principle icons are decorative (aria-hidden) beside their own text
    And the only new text is the labels listed above
    And there are no numbers, logos, metrics, external images, libraries or animation beyond the existing fade-in reveal
    And all text in the visuals is left-aligned or centred in the drawing, never justified or hyphenated

  Scenario: The visuals reflow below 700 pixels
    When the viewport is narrower than 700 pixels
    Then the Services diagram becomes a vertical list of the three labels, each with its icon, ending in a block "One engagement"
    And the Engagement diagram becomes a vertical list of the four model names leading to a block "One point of contact"
    And nothing shrinks to unreadable size and there is no horizontal scroll at 2560, 1867, 1440, 1024, 780 or 390 pixels wide
    And no label overlaps another label or a circle it does not belong to

  Scenario: Nothing else changes
    Then all other page text is identical to before
    And the two videos still load nothing from YouTube until Play is pressed
