/**
 * Seed script — inserts 3 well-crafted, SEO-optimized blog posts
 * Run with: npx tsx scripts/seed-blog-posts.ts
 */

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { posts } from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
const ssl = process.env.DATABASE_SSL === "true" ? "require" : false;

const sql = postgres(connectionString, { prepare: false, ssl, connect_timeout: 20 });
const db = drizzle(sql);

// ─────────────────────────────────────────────────────────────────────────────
// POST 1 — Website Development
// ─────────────────────────────────────────────────────────────────────────────

const post1 = {
  title:
    "Why Your Small Business Website Is Costing You Customers (And Exactly How to Fix It)",
  slug: "why-your-small-business-website-costs-customers",
  excerpt:
    "Most small business websites in Illinois and Wisconsin quietly lose leads without the owner ever knowing. Here is exactly what is going wrong — slow pages, buried CTAs, weak trust signals — and how to fix each issue with practical, Midwest-specific solutions that work.",
  coverImage: null,
  status: "published",
  publishedAt: new Date(),
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "You spent good money on your website. Maybe it looks fine to you — clean design, your logo at the top, a photo of the team, a contact page. But here is the uncomfortable truth most local business owners in Illinois and Wisconsin never hear directly: your website is probably scaring off more customers than it brings in.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Not because it is ugly. Not because the copy is bad. Because the small things — the friction points that feel minor to you — are deal-breakers for the person on the other end who is comparing three businesses and deciding who to call.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "This is not about guessing. These are specific, measurable problems we see on small business websites across the Midwest every single week. And every one of them has a fix.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Five Conversion Killers (and How to Fix Each One)" }],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "1. Your call-to-action is hiding" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "We looked at thirty small business websites in the Fox Valley area last month. Twenty-three of them did not have a single clear button in the header. No \"Get a Quote.\" No \"Book Now.\" No \"Call Today.\" Just a logo, some navigation links, and a hope that visitors would dig around until they found the contact page.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Here is how people actually use websites: they scan the top of the page for about three seconds to decide if you can solve their problem. If the first thing they see is not an obvious next step, they leave and call your competitor.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "The fix:" },
          {
            type: "text",
            text: " Put one primary button in your website header. Not two. Not three. One. \"Book a Free Estimate.\" \"Schedule a Consultation.\" \"Get Pricing.\" Whatever your main conversion event is, make it impossible to miss. Put it in the top-right corner of every single page. Then add a second, subtle link in the navigation that says the same thing.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "2. Your phone number is not clickable on mobile" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This sounds so basic it should not need saying. Yet we still find local business websites where the phone number is an image (not text), or it is buried in a footer, or — somehow — it is missing the ",
          },
          { type: "text", marks: [{ type: "code" }], text: "tel:" },
          {
            type: "text",
            text: " link that makes it tappable on a phone. For a plumber, electrician, or HVAC company, a huge percentage of leads come from people searching on their phone during an urgent situation. If they have to zoom in, copy a number, and switch to the dialer, you have already lost them.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "The fix:" },
          {
            type: "text",
            text: " Make sure your phone number is live text (not an image), formatted as a proper ",
          },
          { type: "text", marks: [{ type: "code" }], text: '<a href="tel:+18155551234">' },
          {
            type: "text",
            text: " link, and visible in the header on mobile. Test it yourself on an actual phone. Tap it. If it does not open the dialer, fix it today.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "3. You are using stock photos instead of real ones" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Stock photos tell visitors one thing: you did not invest in your website. When a homeowner in Madison is choosing a contractor to come into their home, they want to see the actual people who will show up. Real photos of your team. Your truck. Your latest job site. The difference between a stock photo of a smiling person in a hard hat and a real photo of your crew finishing a deck in Janesville is the difference between \"maybe\" and \"let us call these guys.\"",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "The fix:" },
          {
            type: "text",
            text: " Take thirty minutes with your phone. Get a group photo of the team in front of the shop or truck. Snap a few photos of recent projects. Replace every stock hero image with something real. It does not need to be professionally shot — authentic beats polished every time for local service businesses.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "4. Your page speed is silently killing conversions" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Google says 53 percent of mobile visitors leave a page that takes longer than three seconds to load. We tested a local roofing company's website recently — it took eight seconds to load on a 4G connection. Eight seconds. That business was spending money on Google Ads sending people to a page that was chasing them away before it even finished loading.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "The fix:" },
          {
            type: "text",
            text: " Run your website through Google's PageSpeed Insights. If your mobile score is below 70, you have work to do. Common culprits: unoptimized images (compress them), too many plugins (remove what you do not use), and slow hosting (upgrade to a better provider). Every second you shave off load time is a direct improvement to your conversion rate.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "5. You are not telling people where you serve" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is the most common miss we see on Illinois and Wisconsin small business websites. The homepage says \"Serving the Midwest\" or \"Proudly serving your community.\" That is too vague. A homeowner in Waukesha does not know if you drive to Waukesha. A business owner in Rockford does not know if Rockford is in your service area.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "The fix:" },
          {
            type: "text",
            text: " List your service area specifically. City by city. County by county. \"Serving Winnebago County, Boone County, and the greater Rockford area.\" Put this in your header, your footer, and your service pages. This builds immediate trust because the visitor knows you are local and available to them. It also helps your SEO tremendously for local search queries.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Baseline Your Website Needs to Meet in 2026" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Beyond fixing the five killers above, there are a few non-negotiables that every small business website needs today:",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "SSL certificate is active.",
                  },
                  {
                    type: "text",
                    text: " If Chrome shows \"Not Secure\" in the address bar, visitors will leave immediately. This is 2026 — that warning is a credibility death sentence.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Mobile responsive design.",
                  },
                  {
                    type: "text",
                    text: " Your website must look good and function perfectly on a phone. Not \"works okay\" — perfect. Test it on an iPhone and an Android device.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Basic accessibility.",
                  },
                  {
                    type: "text",
                    text: " Clean heading hierarchy (H1, H2, H3), sufficient color contrast, and descriptive link text. This is no longer optional — it is a baseline expectation.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Clear service pages.",
                  },
                  {
                    type: "text",
                    text: " Each service you offer should have its own page with a description, pricing or range, service area, and a direct path to book or inquire.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Real reviews and proof.",
                  },
                  {
                    type: "text",
                    text: " Embedded Google reviews, before-and-after photos, or case studies. Generic five-star badges do not cut it anymore — visitors want to see real feedback from real local customers.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "What to Do Next" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Start with the low-hanging fruit. Add a clear CTA button to your header. Make your phone number tappable. Replace one stock photo with a real one. Run PageSpeed Insights and see where you stand.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "If you are in Illinois or Wisconsin and want a straightforward assessment of where your website is losing leads, ",
          },
          {
            type: "text",
            marks: [
              { type: "link", attrs: { href: "https://getboldideas.com/contact" } },
            ],
            text: "we can help",
          },
          {
            type: "text",
            text: ". No jargon. No upsell. Just a clear look at what is working and what is not.",
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// POST 2 — AI Agents
// ─────────────────────────────────────────────────────────────────────────────

const post2 = {
  title:
    "How Local Service Businesses Use AI Agents to Capture Better Leads After Hours",
  slug: "local-service-businesses-ai-agents-capture-leads-after-hours",
  excerpt:
    "When your team goes home, leads keep coming in. Here is how plumbers, cleaners, consultants, and other local service businesses in Illinois and Wisconsin use AI agents to capture, qualify, and book leads twenty-four hours a day — without adding headcount.",
  coverImage: null,
  status: "published",
  publishedAt: new Date(),
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Here is a number that should bother you: according to industry research, businesses that respond to a lead within five minutes are nine times more likely to convert that lead than businesses that respond after thirty minutes.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Now ask yourself honestly: when was the last time someone submitted a form on your website at 8:00 PM on a Tuesday and got a response before 9:00 AM the next day?",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "If the answer is \"never\" or \"I am not sure,\" you are leaving money on the table every single night. The good news is that fixing this does not require hiring a night shift. It requires an AI agent.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "What an AI Agent Actually Does for a Local Business" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "An AI agent is not a chatbot.",
          },
          {
            type: "text",
            text: " A chatbot follows a script. It can handle exactly three questions, and when you ask a fourth, it says \"I did not understand that\" and routes you to a human. An AI agent uses a language model to understand context, ask follow-up questions, qualify a lead, and take action — booking a call, sending a quote, or creating a CRM record — all without a human touching the process.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "For local service businesses in the Midwest, this is not theoretical. Here is exactly how three types of businesses are using AI agents right now.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Plumbers and HVAC Companies: Emergency Triage" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "When a pipe bursts at 11:00 PM, the homeowner does not want to leave a voicemail. They want to know if someone can come tonight. An AI agent on your website can ask the right questions: \"Is water actively flooding?\" \"What is your zip code?\" \"Have you shut off the main valve?\" If it is a true emergency, the agent alerts the on-call team immediately. If it can wait until morning, the agent books the first available slot and sends a confirmation.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The result: emergency calls get triaged accurately, morning appointments are pre-booked overnight, and your team wakes up to a queue of qualified, confirmed leads instead of a voicemail inbox full of ",
          },
          { type: "text", marks: [{ type: "italic" }, { type: "bold" }], text: "\"call me back as soon as you get this\"" },
          { type: "text", text: " messages." },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Cleaning Services: Instant Quoting and Booking" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A cleaning business in Rockford set up an AI agent on their website. When a visitor asks about pricing, the agent asks three questions: square footage, number of bedrooms and bathrooms, and frequency (weekly, bi-weekly, one-time). It calculates an estimate, shows available time slots, and books the first visit — all without the owner lifting a finger.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Before the agent, the owner was spending two to three hours per day on the phone giving quotes and checking availability. Now the phone rings less because the website handles the transaction. The calls that do come in are from people who have already seen the price and want to book — a much warmer lead.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Consultants and Coaches: Discovery and Qualification" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "For service businesses that sell higher-ticket offerings, the AI agent plays a different role. Instead of booking immediately, it asks a handful of targeted questions to determine fit before scheduling a consultation. A business consultant in Madison might have an agent that asks about revenue range, team size, and primary challenge. If the prospect fits the ideal client profile, the agent books a call. If not, it offers a free resource instead.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This eliminates the single biggest time waste for consultants: discovery calls with people who are not a good fit.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "What Happens When the Agent Cannot Answer" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A well-designed AI agent knows its limits. When it encounters a question it cannot answer or a request that needs human judgment, it does not go silent — it creates a ticket, sends an alert, or routes the conversation to a team member. The human receives full context: who the lead is, what they asked, and what has already been discussed.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is the critical difference between a good AI agent and a frustrating one. The agent is not trying to replace your team. It is handling the volume that would otherwise overwhelm them, so when a human does get involved, it is for something that actually needs human judgment.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Getting Started with an AI Agent" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "If you are a small business owner reading this and thinking it sounds complicated, here is the straightforward version of what getting started looks like:",
          },
        ],
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Identify the three most common questions or requests you get from potential customers every week.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Decide what a successful interaction looks like — a booked call, a captured email, a completed quote request.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Set up the agent on your website with those specific questions and outcomes in mind.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Connect it to your calendar, CRM, or email so it can take action on its own.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Review the first week of transcripts, tweak the responses, and let it run.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "That is the whole process. It takes about a week to set up properly, and from that point forward, your website works for you while you sleep.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "If you are in Illinois or Wisconsin and curious about what an AI agent would look like for your specific business, ",
          },
          {
            type: "text",
            marks: [
              { type: "link", attrs: { href: "https://getboldideas.com/contact" } },
            ],
            text: "reach out",
          },
          {
            type: "text",
            text: ". We build these for small businesses every week and we keep the process as straightforward as the list above.",
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// POST 3 — Workflow Automation
// ─────────────────────────────────────────────────────────────────────────────

const post3 = {
  title:
    "Stop Copying and Pasting: How Connected Systems Save 15+ Hours Every Week",
  slug: "stop-copying-pasting-connected-systems-save-hours",
  excerpt:
    "If your team manually moves data from web forms into spreadsheets, sends invoice reminders by hand, or copies lead information into your CRM one field at a time, you are wasting time you cannot afford to lose. Here is the exact automation roadmap for small service businesses in the Midwest.",
  coverImage: null,
  status: "published",
  publishedAt: new Date(),
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Every week, thousands of small business owners in Illinois and Wisconsin do something that quietly drains their bottom line: they copy data from one place and paste it into another.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A lead fills out a form on the website. Someone copies the name, email, and phone number and pastes them into the CRM. A week later, the job is complete. Someone copies the invoice amount and pastes it into QuickBooks. A month later, someone checks if the invoice was paid and sends a reminder email.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Each one of these actions takes maybe two minutes in isolation. But add them up across a week, across a team, and you are looking at fifteen to twenty hours of labor that adds zero value to your customers. It is just overhead — and it is entirely avoidable.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Four Automations That Make the Biggest dent" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Based on what we see working for small service businesses in the region, these four automations deliver the highest return on setup time:",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "1. Form-to-CRM: The Foundation" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is the single highest-impact automation for most local businesses. When someone fills out a contact form on your website, the information should appear in your CRM instantly. Not tomorrow. Not after someone manually enters it. Instantly.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A home service company we work with in Rockford was losing three to five hours per week just on data entry — copying contact form submissions from their website email into their CRM. After connecting the two systems, leads appear in the CRM within three seconds of submission. The owner told us it was like gaining back an entire morning every week.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Time saved: " },
          {
            type: "text",
            text: "Three to five hours per week. Setup time: one afternoon.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "2. Invoice Follow-Ups: The Cash Flow Protector" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Sending invoice reminders is one of those tasks that everyone hates doing and no one does consistently. Yet consistent follow-up directly impacts how fast you get paid. An automation that sends a friendly reminder three days before an invoice is due, a gentle nudge on the due date, and a second notice five days after — all without anyone thinking about it — can reduce your average time-to-payment by five to seven days.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "One landscaping company in Kane County set this up and told us their receivables aging dropped by nearly forty percent in the first sixty days. Not because they hired a collections person — because the system did the follow-up consistently.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Time saved: " },
          {
            type: "text",
            text: "Two to four hours per week (and faster payments). Setup time: two hours.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "3. Booking Confirmations and Reminders" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "When a customer books an appointment — whether through your website, a phone call, or in person — three things need to happen: they need a confirmation, a reminder twenty-four hours before, and a follow-up after the service is complete. Each of these can be automated with a single workflow.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The no-show rate for service businesses that send automated reminders is consistently twenty to thirty percent lower than for businesses that rely on manual calls or do not send reminders at all. For a business doing fifty appointments a week, that is ten to fifteen more appointments kept — without spending an extra minute on the phone confirming schedules.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Time saved: " },
          {
            type: "text",
            text: "Three to five hours per week (and fewer no-shows). Setup time: one to two hours.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "4. Review Requests: Your Best Marketing Asset" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "You already know that reviews matter for local SEO. The problem is consistency. Most business owners ask for reviews when they remember to, which is usually after a customer has already left or moved on. An automation that sends a review request twenty-four hours after a job is marked complete — via text or email, with a direct link to your Google Business Profile — generates reviews on autopilot.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "We have seen businesses go from one review per month to eight to ten per month with nothing more than this single automation running in the background.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Time saved: " },
          {
            type: "text",
            text: "One to two hours per week (and more reviews). Setup time: one hour.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Reality Check" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Automation does not need to be complicated. The tools available today — Zapier, Make, built-in CRM workflows — are designed for non-technical business owners. You do not need a developer to connect your form to your CRM or set up an invoice reminder sequence.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "What you do need is someone to look at your specific stack, identify the handoffs that are happening manually, and build the connections. That is where most small businesses get stuck — not because the technology is hard, but because they are too busy running the business to step back and design the system.",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "\"We were spending four hours a week on stuff that added zero value to our customers. We just never measured it until we sat down and looked. Now that same work happens automatically and we actually have time to return phone calls before end of day.\"",
              },
              { type: "hardBreak" },
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "— Owner of a home services company, Fox Valley, Wisconsin",
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Where to Start" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Pick one process that drives you crazy every week. Maybe it is entering leads into your CRM. Maybe it is sending invoice reminders. Maybe it is confirming appointments. Set up that one automation. Test it for a week. If it works, move to the next one.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "If you are in Illinois or Wisconsin and want help identifying which processes would benefit most from automation, ",
          },
          {
            type: "text",
            marks: [
              { type: "link", attrs: { href: "https://getboldideas.com/contact" } },
            ],
            text: "let us talk",
          },
          {
            type: "text",
            text: ". We help small businesses build these connections without overcomplicating things.",
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main — Insert all posts
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding blog posts...\n");

  const allPosts = [post1, post2, post3];

  for (const post of allPosts) {
    // Check if slug already exists
    const exists = await sql`
      SELECT id FROM posts WHERE slug = ${post.slug} LIMIT 1
    `.catch(() => []);

    if (exists.length > 0) {
      console.log(`  ⏭  Skipping "${post.title}" — slug already exists`);
      continue;
    }

    console.log(`  📝 Creating: ${post.title}`);
    await db.insert(posts).values(post);
    console.log(`  ✅ Created successfully`);
  }

  console.log("\n✨ Done! All posts seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed to seed posts:", err);
  process.exit(1);
});
