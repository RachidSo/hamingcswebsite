Feature: FAQ section
  As a prospective client
  I want answers to common questions before reaching out
  So that I can qualify myself before making contact

  Background:
    Given I navigate to "https://hamingcs.com/"
    And I scroll to the "FAQ" section

  Scenario: FAQ section intro is correct
    Then the section is headed "FAQ"
    And the subheading "Answers to the questions that come up most." is visible
    And a filter/grouping by "General", "Engagement", and "Security" is available

  Scenario Outline: Each expected question is present and expandable
    Then a question "<question>" is visible in the FAQ list
    When I click/expand it
    Then its answer is displayed and is non-empty

    Examples:
      | question                                                            |
      | What does Hamingcs actually do?                                     |
      | Who do you work with?                                               |
      | Do you work remotely?                                               |
      | How does an engagement start?                                       |
      | Can you cover strategy, AI, and systems architecture together?      |
      | Can you take P&L or leadership ownership, not just advise?          |
      | Do you work on retainer or fixed scope?                             |
      | Do you work under NDA?                                              |
      | Do you help with compliance frameworks?                             |
      | Is security part of the AI work too?                                |

  Scenario: FAQ answers are consistent with the rest of the site
    Then the "Do you work remotely?" answer confirms Hamingcs is global and
      remote-first with on-site work available where needed
    And the "Do you work under NDA?" answer confirms NDA/confidentiality is
      standard practice, agreed before engagement starts
