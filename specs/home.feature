Feature: Home / hero section
  As a first-time visitor
  I want to quickly understand what Hamingcs does and how to take action
  So that I can decide whether to explore further or make contact

  Background:
    Given I navigate to "https://hamingcs.com/"

  Scenario: Hero communicates positioning and identity
    Then the eyebrow text "STRATEGY, AI & IT CONSULTING — GLOBAL, REMOTE-FIRST" is visible
    And the headline "Strategy that ships, on systems built to run it." is visible
    And the supporting paragraph mentions strategy, hands-on leadership, AI/data
      expertise, and systems/security/DevOps architecture
    And no individual personal name is displayed

  Scenario: Hero has two calls-to-action
    Then a "Start a conversation" button is visible and links to "#contact"
    And a "See what I do" button is visible and links to "#services"

  Scenario: Three-discipline summary cards are shown
    Then three summary cards are visible: "AI & DATA", "SYSTEMS & SECURITY",
      and "STRATEGY & LEADERSHIP"
    And each card has a short title and one sentence of supporting copy
    And the "STRATEGY & LEADERSHIP" card references director/CTO-level experience
      and a 300-person team across the US, EU, Japan, China, and the Middle East

  Scenario: Stat strip renders correctly
    Then a stat "20 years of experience" is shown with the label "From software developer to team leader, architect, manager, director and CTO"
    And a stat "Automotive, energy, tech" is shown with the label "Industries
      I have delivered in, across four continents"
    And a stat "Strategy to production" is shown with the label "From AI vision
      and data governance through to secure, running systems"
