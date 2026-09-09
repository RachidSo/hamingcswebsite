Feature: Services section
  As a prospective client
  I want to see the concrete services Hamingcs offers, grouped by discipline
  So that I can judge fit before making contact

  Background:
    Given I navigate to "https://hamingcs.com/#services"

  Scenario: Services section intro is correct
    Then the section is headed "SERVICES"
    And the subheading "Three disciplines. One engagement." is visible
    And intro copy states clients can engage one discipline or all three

  Scenario Outline: AI & Data services are listed
    Then under the "AI & DATA" category, a service titled "<service>" is visible
    And it has a supporting description of at least one sentence

    Examples:
      | service                                   |
      | AI readiness & strategy                   |
      | Interim AI & data leadership               |
      | Data architecture & governance             |
      | Technical evaluation & AI-output review     |
      | Generative AI & LLM integration             |
      | AI governance & responsible AI              |

  Scenario Outline: Systems & Security services are listed
    Then under the "SYSTEMS & SECURITY" category, a service titled "<service>" is visible
    And it has a supporting description of at least one sentence

    Examples:
      | service                            |
      | Cloud & SaaS transformation         |
      | DevOps & CI/CD engineering          |
      | Security & threat architecture      |
      | QA automation & release strategy    |
      | Security & compliance audits        |
      | Cloud cost optimization             |

  Scenario Outline: Strategy & Leadership services are listed
    Then under the "STRATEGY & LEADERSHIP" category, a service titled "<service>" is visible
    And it has a supporting description of at least one sentence

    Examples:
      | service                                  |
      | Business & AI strategy definition         |
      | P&L & budget ownership                    |
      | Global team leadership & scaling          |
      | Market entry & expansion strategy         |
      | Innovation consulting                     |
      | Academic & R&D partnerships                |

  Scenario: Each service category totals exactly 6 items
    Then the "AI & DATA" category lists exactly 6 services
    And the "SYSTEMS & SECURITY" category lists exactly 6 services
    And the "STRATEGY & LEADERSHIP" category lists exactly 6 services
