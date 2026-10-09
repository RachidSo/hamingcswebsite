Feature: Contact section
  As a prospective client
  I want a clear way to get in touch with Hamingcs
  So that I can start a conversation about my needs

  Background:
    Given I navigate to "https://hamingcs.com/#contact"

  Scenario: Contact section intro is correct
    Then the section is headed "CONTACT"
    And the heading "Tell me what you're building." is visible
    And intro copy mentions strategy, AI/data, and systems & security review

  Scenario: Contact details are displayed correctly
    Then "EMAIL" shows "info@hamingcs.com"
    And "LOCATION" shows "Global"
    And "OPERATING MODE" shows "Global / remote-first"

  Scenario: "Email me" button opens the visitor's mail client
    Then an "Email me" button is visible
    And its link is exactly "mailto:info@hamingcs.com"
    When I click it
    Then the visitor's default mail client opens with "info@hamingcs.com" pre-filled as the recipient

  Scenario: The pilot request lives in the QA Agents Cloud section, not in Contact
    Then the Contact section has an "Email me" button and no "Request a paid pilot" button
    And the paid pilot request is in the QA Agents Cloud section (see qa-cloud.feature)

  Scenario: The Substack publication is linked
    Then a link "Substack: Hamingcs Insights" to "https://hamingcsinsights.substack.com/p/start-here" is visible in the Contact section
    And it has rel="noopener"

  Scenario: There is no contact form on this page
    Then no "Name" / "Email" / "Message" input form is present in the Contact section
    (this site intentionally uses direct email contact only — do not test for
    form validation, submission, or confirmation states)

