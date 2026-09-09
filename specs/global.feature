Feature: Global site behavior
  As a visitor to the Hamingcs website
  I want consistent navigation, performance, and trust signals on every page
  So that I can find information and trust the company as credible

  Background:
    Given the Hamingcs website is deployed at "https://hamingcs.com"

  Scenario: Site is served over HTTPS on the custom domain
    When I navigate to "https://hamingcs.com"
    Then the response status is 200
    And the connection is secure (valid TLS certificate)
    And the page does not redirect to an insecure "http://" URL

  Scenario: The site is a single page with correct metadata
    When I navigate to "https://hamingcs.com/"
    Then the response status is 200
    And the page title is "Hamingcs — AI, Data & IT Strategy Consulting"
    And a meta description tag is present and matches the site's positioning copy
    And Open Graph tags (og:title, og:description, og:image, og:url) are present
    And a Twitter card meta tag is present

  Scenario Outline: Navigation links scroll to the correct in-page section
    Given I am on "https://hamingcs.com/"
    When I click the "<nav_label>" navigation link
    Then the URL fragment becomes "<anchor>"
    And the browser scrolls to the section associated with "<anchor>"

    Examples:
      | nav_label | anchor    |
      | Home      | #top      |
      | Services  | #services |
      | About     | #about    |
      | Contact   | #contact  |

  Scenario: "Start a conversation" / "See what we do" CTAs jump to the right section
    Given I am on "https://hamingcs.com/"
    When I click a "Start a conversation" call-to-action anywhere on the page
    Then the URL fragment becomes "#contact"
    When I click "See what we do" in the hero
    Then the URL fragment becomes "#services"

  Scenario: Mobile navigation collapses into a menu
    Given I view the site at a mobile viewport (375px wide)
    Then the navigation collapses into a hamburger/menu icon
    When I tap the menu icon
    Then the navigation links become visible
    And each link is tappable and navigates correctly

  Scenario: Footer displays correct company and contact information
    Given I am on "https://hamingcs.com/"
    Then the footer displays the contact email "info@hamingcs.com"
    And the footer displays the location "United Arab Emirates"
    And the footer displays the operating mode "Global / remote-first"
    And the footer includes the same Home/Services/About/Contact anchor links as the header
    And no individual personal name is displayed anywhere on the page
    And a copyright line reading "© 2026 Hamingcs. All rights reserved." (or current year) is present

  Scenario Outline: Site is responsive across common breakpoints
    Given I view the site at a "<breakpoint>" viewport
    Then no horizontal scrollbar appears
    And no text or element is clipped or overlapping
    And all navigation and CTAs remain usable

    Examples:
      | breakpoint          |
      | mobile (375x812)    |
      | tablet (768x1024)   |
      | desktop (1440x900)  |

  Scenario: Page load performance is acceptable
    When I navigate to "https://hamingcs.com/"
    Then the page's Largest Contentful Paint is under 2.5 seconds on a simulated fast 4G connection
    And there are no render-blocking errors in the browser console
    (note: this is a long single-page site with many sections — pay particular
    attention to image weight and total page size)

  Scenario: Basic accessibility checks pass
    Given I am on "https://hamingcs.com/"
    Then every image (including the logo) has a non-empty "alt" attribute
    And heading tags follow a logical order (one "h1" per page, no skipped levels
      across the many section headings: WHY THREE DISCIPLINES, OUR BACKGROUND,
      HOW WE APPROACH STRATEGY, HOW WE WORK, SERVICES, HOW WE ENGAGE, FAQ, CONTACT)
    And text/background color contrast meets WCAG AA (4.5:1 for normal text)
    And all interactive elements (nav links, CTAs, FAQ accordion, mailto link)
      are reachable and operable via keyboard (Tab / Enter)

  Scenario: No broken links on the site
    Given I am on "https://hamingcs.com/"
    When I check every internal anchor link and the mailto link
    Then every internal anchor resolves to an existing section on the page
    And the "mailto:info@hamingcs.com" link is correctly formatted

  Scenario: Custom 404 page for unknown routes
    When I navigate to "https://hamingcs.com/this-page-does-not-exist"
    Then a 404 (or equivalent "page not found") page is shown
    And the 404 page includes a way back to the home page

  Scenario: No use of individual names anywhere on the public site
    Given the two founding CVs were intentionally combined under the Hamingcs brand
    When I search the rendered text of every page
    Then no individual founder/employee personal name appears
