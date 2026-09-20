Feature: Contact section
  As a prospective client
  I want a clear way to get in touch with Hamingcs
  So that I can start a conversation about my needs

  Background:
    Given I navigate to "https://hamingcs.com/#contact"

  Scenario: Contact section intro is correct
    Then the section is headed "CONTACT"
    And the heading "Tell us what you're building." is visible
    And intro copy mentions strategy, AI/data, and systems & security review

  Scenario: Contact details are displayed correctly
    Then "EMAIL" shows "info@hamingcs.com"
    And "LOCATION" shows "United Arab Emirates"
    And "OPERATING MODE" shows "Global / remote-first"

  Scenario: "Email us" button opens the visitor's mail client
    Then an "Email us" button is visible
    And its link is exactly "mailto:info@hamingcs.com"
    When I click it
    Then the visitor's default mail client opens with "info@hamingcs.com" pre-filled as the recipient

  Scenario: There is no contact form on this page
    Then no "Name" / "Email" / "Message" input form is present in the Contact section
    (this site intentionally uses direct email contact only — do not test for
    form validation, submission, or confirmation states)
