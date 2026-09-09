Feature: How We Engage section
  As a prospective client
  I want to understand the ways I can engage Hamingcs
  So that I can pick the model that fits my situation

  Background:
    Given I navigate to "https://hamingcs.com/"
    And I scroll to the "HOW WE ENGAGE" section

  Scenario: Section intro is correct
    Then the section is headed "HOW WE ENGAGE"
    And the subheading "Three ways in, one point of contact." is visible

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
    Then its bullets include: "Fixed scope and timeline", "Security, cloud, or
      AI-specialist team", and "Clear handoff and documentation"
