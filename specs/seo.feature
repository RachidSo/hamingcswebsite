Feature: Search and sharing basics
  As the owner of hamingcs.com
  I want the page to be easy for search engines and link previews to read
  So that visitors find it and share cards show the company, without any claim the page does not make

  Background:
    Given the Hamingcs website is deployed at "https://hamingcs.com"

  Scenario: The head tells search engines and sharing sites what the page is
    Then the page has a title under about 60 characters, with "&" written once as "&amp;" in the source and shown as "&"
    And a meta description of 140 to 160 characters that mentions AI and data strategy, DevOps architecture and "remote-first"
    And a canonical link to "https://hamingcs.com/"
    And the html element has lang "en" and a theme-color meta tag
    And the 404 page carries a noindex robots meta tag and the home page does not

  Scenario: There is exactly one H1 and the headings do not skip levels
    Then the page has one H1, "Strategy that ships, on systems built to run it."
    And no heading level is skipped when reading the page from top to bottom

  Scenario: Sharing shows a company card, not a product screenshot
    Then og:image and twitter:image are "https://hamingcs.com/assets/og-image.png", a 1200 by 630 PNG with the Hamingcs logo and the line "Strategy that ships, on systems built to run it."
    And og:image:width is 1200, og:image:height is 630, and og:image:alt and twitter:image:alt read "Hamingcs: Strategy that ships, on systems built to run it."
    And the QA Agents Cloud share card file stays in the repository but is not the site-wide default

  Scenario: Icons for browsers and phones
    Then the head links favicon.ico, a 32 pixel PNG and a 180 pixel apple-touch-icon, all present in the repository root

  Scenario: Structured data is valid and says only what the page says
    Then the page has one JSON-LD block that parses as JSON
    And it contains an Organization (also a ProfessionalService) with name "Hamingcs", the site URL, the logo, the email "info@hamingcs.com" and the Substack link as its only sameAs entry
    And it contains a WebSite, three Service entries named exactly as the three discipline headings, and a FAQPage
    And each FAQPage question and answer equals the visible FAQ text word for word
    And it contains no aggregateRating, review, address, telephone, award or personal founder details

  Scenario: The three search phrases appear once or twice, in existing places
    Then "fractional CTO" appears in the "Interim AI & data leadership" Services card ("Hands-on leadership for building or scaling an AI or data function, including fractional CTO engagements: hiring, structure, budget and P&L ownership, and operating cadence.") and in the FAQ answer to "Can you take P&L or leadership ownership, not just advise?" ("Yes — interim leadership engagements, including fractional CTO engagements, can include full P&L and team ownership at any scale, …")
    And "AI strategy consulting" appears once, at the start of the "AI readiness & strategy" card text ("AI strategy consulting that starts with an honest assessment of where AI creates real value in your operations — and where it doesn't — followed by a roadmap your teams can actually execute.")
    And "AI-assisted QA testing" appears once, in the QA Agents Cloud introduction ("QA Agents Cloud is the AI-assisted QA testing product I built and run myself.")
    And the H1, the title and the meta description are unchanged
    And the FAQPage answer for the P&L question equals the visible answer word for word

  Scenario: Fonts and logos load lightly
    Then the web fonts are linked from the head with preconnect and display=swap, not imported from the stylesheet
    And logo-icon.png is under 60 KB and logo-full.png under 100 KB

  Scenario: Crawlers find the right files
    Then robots.txt allows all and names "https://hamingcs.com/sitemap.xml"
    And sitemap.xml lists "https://hamingcs.com/" with a lastmod date
    And llms.txt is a short plain-text summary that uses the page's own wording

  Scenario: Images and links are accessible
    Then every meaningful image has descriptive alt text and its width and height
    And images below the first screen load lazily
    And the enlarged-screenshot dialog holds no image until one is opened
    And every external link has rel "noopener" and no link text is "click here" or "read more"

  Scenario: No forbidden claims
    Then none of the share text, meta text or structured data contains a rating, review count, award, address, phone number or customer name
    And it never says AI agents "run" the business, only that they support it
    And it never says a customer uses QA Agents Cloud
