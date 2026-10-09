Feature: About section
  As a prospective client
  I want to understand who Hamingcs is, how they think, and why I should trust them
  So that I feel confident engaging their services

  Background:
    Given I navigate to "https://hamingcs.com/#about"

  Scenario: "Why three disciplines" framing is present
    Then a section headed "WHY THREE DISCIPLINES" is visible
    And it explains that AI initiatives usually fail on the system underneath
      them, or on strategy/leadership that never became a running function
    And it states the reason Hamingcs combines strategy, AI/data, and systems
      under one practice

  Scenario: "My background" narrative is present and names no individuals
    Then a section headed "MY BACKGROUND" is visible
    And its lead sentence reads "Two decades of enterprise experience, earned on the way up — not assembled from a slide."
    And it describes hands-on origins in automotive diagnostic software (Java)
      and architecture work
    And it describes progression to director/CTO-level ownership of a 300-person
      AI and data function across the US, EU, Japan, China, and the Middle East
    And it references leading cloudification/digitalisation of the technology stack
    And no individual founder/employee personal name appears anywhere in this section

  Scenario: Four-step strategy approach is presented in order
    Then a section headed "HOW I APPROACH STRATEGY" is visible
    And it lists exactly 4 steps in this order:
      | step | title                        |
      | 01   | Define the issue             |
      | 02   | Wargame the options          |
      | 03   | Decide, resource, and lead   |
      | 04   | Execute and adapt            |
    And each step has a supporting description

  Scenario: Working principles are presented
    Then a section headed "HOW I WORK" is visible
    And it lists 3 working principles, including one about strategy only being
      useful if someone can operate it, one about security/scale being designed
      in from the start, and one about working globally / remote-first

  Scenario: The founder interview is presented in the FAQ layout
    Then a section headed "FOUNDER INTERVIEW" is visible inside About, after "MY BACKGROUND"
    And its heading is "In the Founder's own words" with the subtitle "Answers by the Founder"
    And it is attributed to "Founder" and shows no personal name
    And it reuses the FAQ layout: a category list on the left and question cards with a +/- toggle on the right
    And the category list has three categories in this order: "Why Hamingcs", "AI projects", "QA Agents Cloud"
    And "Why Hamingcs" holds "Why start Hamingcs?" and "What's different about how you approach this compared to a typical consulting engagement or AI vendor?"
    And "AI projects" holds "What's the real reason most enterprise AI projects stall?"
    And "QA Agents Cloud" holds "Why build something like QA Agents Cloud yourself, instead of only advising on it?" and "What's the one thing you refuse to hide from the people who own the result?"
    And each question is an h3 inside a summary, answered by a paragraph, and the answers are verbatim
    And the first question of the selected category is open by default and the others in it are closed
    And choosing another category shows only that category's questions
    And the first answer says "If my company had a product to sell"
    And the AI projects answer ends with "I tell two of these stories in full in Issue #1 of my Substack." where "Issue #1 of my Substack" links to "https://hamingcsinsights.substack.com/p/why-most-enterprise-ai-projects-stall" with rel="noopener"
    And the section text contains no "we" or "our" as a word
    And no individual's name appears anywhere in the section
    And after the last card the line "If this is how you want to work, ask for a pilot." is followed by a "See the pilot" link to "#qa-cloud" (the only "Request a pilot" button is in the QA Agents Cloud pilot block)
    And the section adds no maintenance, support, marketing or product-management offer

  Scenario: The founder interview works without JavaScript
    Given JavaScript is disabled
    Then the category list is hidden and all five questions are visible as h3 headings with their answers as paragraphs, grouped under their category labels
    And all five answers are open
