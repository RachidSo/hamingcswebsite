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

  Scenario: "Our background" narrative is present and names no individuals
    Then a section headed "OUR BACKGROUND" is visible
    And it describes hands-on origins in automotive diagnostic software (Java)
      and architecture work
    And it describes progression to director/CTO-level ownership of a 300-person
      AI and data function across the US, EU, Japan, China, and the Middle East
    And it references leading cloudification/digitalisation of the technology stack
    And no individual founder/employee personal name appears anywhere in this section

  Scenario: Four-step strategy approach is presented in order
    Then a section headed "HOW WE APPROACH STRATEGY" is visible
    And it lists exactly 4 steps in this order:
      | step | title                        |
      | 01   | Define the issue             |
      | 02   | Wargame the options          |
      | 03   | Decide, resource, and lead   |
      | 04   | Execute and adapt            |
    And each step has a supporting description

  Scenario: Working principles are presented
    Then a section headed "HOW WE WORK" is visible
    And it lists 3 working principles, including one about strategy only being
      useful if someone can operate it, one about security/scale being designed
      in from the start, and one about working globally / remote-first
