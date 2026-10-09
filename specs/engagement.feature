Feature: How I Engage section
  As a prospective client
  I want to understand the ways I can engage Hamingcs
  So that I can pick the model that fits my situation

  Background:
    Given I navigate to "https://hamingcs.com/"
    And I scroll to the "HOW I ENGAGE" section

  Scenario: Section intro is correct
    Then the section is headed "HOW I ENGAGE"
    And the subheading "Four ways in, one point of contact." is visible

  Scenario Outline: Each engagement model is presented with its own CTA
    Then an engagement model titled "<model>" tagged "<tag>" is visible
    And it includes the description "<description_contains>"
    And it lists its own bullet points
    And it has its own "Start a conversation" button linking to "#contact"

    Examples:
      | model               | tag       | description_contains                                                   |
      | Advisory            | Ongoing   | Retained strategy input for AI, data, and security decisions           |
      | Interim leadership  | Embedded  | hands-on strategy, AI, data, or systems lead inside your organization  |
      | Project delivery    | Scoped    | A defined engagement against a specific outcome                        |

  Scenario: Advisory model lists its scope
    Given the "Advisory" engagement model card is visible
    Then its bullets include: "Recurring strategy & architecture review",
      "Direct access for ad-hoc decisions", and "Roadmap and governance input"

  Scenario: Interim leadership model lists its scope
    Given the "Interim leadership" engagement model card is visible
    Then its bullets include: "Everything in Advisory", "Hiring, structure, and
      budget ownership", "Operating cadence and delivery accountability", and
      "Handover plan built in from day one"

  Scenario: Project delivery model lists its scope
    Given the "Project delivery" engagement model card is visible
    Then its bullets include: "Fixed scope and timeline", "Delivered by me, with AI
      agents supporting where it fits.", and "Clear handoff and documentation"

  Scenario: The QA Agents Cloud pilot card is the fourth, full-width card
    Then a fourth engagement card titled "QA Agents Cloud pilot" tagged "Paid pilot" is visible below the other three and spans the full width
    And it says "AI agents test your web app from your specifications, and bugs wait for a person to approve them before they are filed."
    And it has a "See the pilot" button linking to "#qa-cloud"
    And it shows no price
