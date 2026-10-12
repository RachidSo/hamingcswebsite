Feature: How the work is done
  As a prospective client
  I want to see who is accountable and what AI agents do on the work
  So that I know a named person reviews everything I receive

  Background:
    Given the Hamingcs website is deployed at "https://hamingcs.com"

  Scenario: The section sits between "Services" and "How I engage"
    When I view the page
    Then a section with the anchor "#how-we-work" comes after the Services section and before the section headed "Four ways in, one point of contact."
    And it carries the chip "HOW THE WORK IS DONE"
    And its heading is "One accountable person. A team of AI agents behind them."
    And no navigation entry is added, because "How I engage", "QA Agents Cloud" and the FAQ have none either

  Scenario: The introduction is first person and says the work is supported by agents
    Then the introduction is two paragraphs. The first reads "Hamingcs has no subcontractors. I'm the person you meet, and I'm accountable for what you receive." The second reads "Where a task is repeatable, I give it to an AI agent (AI coding agents do the engineering work, under my review), and I review the result before it reaches you."
    And the two paragraphs use the same flex layout as the About introduction: side by side while each can stay at 34ch or wider, stacked below that
    And the introduction has no narrow maximum width, so on desktop it fills the container like the heading above it
    And the section never says the work is "run by" agents
    And the section states no numbers and no customer claims

  Scenario: The hub-and-spoke diagram is inline SVG with no external image
    Then the diagram is an inline SVG inside an element with role "img" and a descriptive aria-label
    And no image file and no script library is loaded for it
    And the centre circle, in the dark brand colour, reads "Me, accountable" with the sub-line "reviews and signs off everything"
    And seven nodes in the accent colour surround it, each with a line icon and one word: "Architecture", "Development", "DevOps", "Testing", "Product", "Marketing", "Support"
    And a line joins each node to the centre, with a small "review" marker on it
    And nothing in the diagram is animated, and no robot or stock imagery is used
    And no label overlaps another label at 2560, 1867, 1440, 1024 or 390 pixels wide

  Scenario: Under 700 pixels the diagram becomes a vertical list
    When the viewport is narrower than 700 pixels
    Then the radial layout is hidden
    And the centre block "Me, accountable" comes first, followed by the seven nodes in the same order, each with its icon, its one-word label and a "review" tag
    And from 700 pixels up the radial layout is shown and the list is hidden

  Scenario: Seven role cards are visible, not accordions
    Then below the diagram there are exactly 7 cards in this order: "Software architecture", "Software development", "DevOps", "Testing", "Product management", "Marketing", "Maintenance and support"
    And every card shows a title and two lines, "Agent does:" and "I decide:"
    And the cards are two columns from 900 pixels and one column below, in the style of the "Why it's different" list
    And the "Testing" card adds "QA Agents Cloud is this team, offered as a product." with a link to "#qa-cloud"
    And the "Maintenance and support" card reads "Agent does: Watches for faults and prepares fixes and answers. Tested on my own products." and "I decide: What goes out. Support is provided by me, by name."
    And it makes no claim of customer use and no other claim about support or maintenance

  Scenario: Four short rules follow the cards
    Then four rules are listed:
      | Every deliverable is reviewed and signed off by me, by name. |
      | Agents work on separate branches. Nothing is merged or deployed until I have reviewed it. |
      | Each customer's data is kept separate from every other customer's. |
      | Need a role we don't have yet? I build it as another agent, and it is agreed in writing. |

  Scenario: A closing link leads to the longer explanation
    Then small text reads "The longer explanation, with what is automated and what stays human:" followed by a link titled "I built a QA team out of AI agents, and gave it a rule it can't skip"
    And the link goes to "https://hamingcsinsights.substack.com/p/i-built-a-qa-team-out-of-ai-agents"
    And it opens in a new tab with rel="noopener"

  Scenario: Text is left-aligned and never hyphenated
    Then no text in the section is justified or hyphenated
    And the page has no horizontal scroll at 2560, 1867, 1440, 1024 or 390 pixels wide

  Scenario: The two videos still play on click only
    When the page loads
    Then no request goes to YouTube
    When I press Play on either video
    Then only a youtube-nocookie.com embed is requested
