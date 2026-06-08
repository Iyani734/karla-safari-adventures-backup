import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle,
  Cookie,
  FileText,
  Globe2,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';

const LAST_UPDATED = 'June 2, 2026';

const CONTACT = {
  company: 'Karla Safari Adventures',
  address: 'Westlands, Nairobi, Kenya',
  email: 'info@karlasafariadventures.com',
  bookingsEmail: 'bookings@karlasafariadventures.com',
  phone: '+254 745 969 305',
  alternatePhone: '+254 717 849 140',
};

const policyNav = [
  {
    slug: 'privacy-policy',
    label: 'Privacy Policy',
    shortLabel: 'Privacy',
    icon: ShieldCheck,
    description: 'How we collect, use, share, store, and protect visitor and traveller information.',
  },
  {
    slug: 'terms-and-conditions',
    label: 'Terms and Conditions',
    shortLabel: 'Terms',
    icon: Scale,
    description: 'The rules for using this website, requesting proposals, and booking safari services.',
  },
  {
    slug: 'refund-cancellation-policy',
    label: 'Refund & Cancellation Policy',
    shortLabel: 'Refunds',
    icon: RefreshCw,
    description: 'How cancellations, supplier charges, refunds, postponements, and force majeure are handled.',
  },
  {
    slug: 'cookie-policy',
    label: 'Cookie Policy',
    shortLabel: 'Cookies',
    icon: Cookie,
    description: 'How cookies, local storage, browser preferences, and third-party tools may be used.',
  },
];

const privacyDataMap = [
  {
    category: 'Inquiry and quote data',
    examples: 'Name, email, phone, travel dates, preferred tour, travellers, budget, and message.',
    purpose: 'To respond to safari enquiries, design proposals, and keep a clear planning record.',
  },
  {
    category: 'Booking and itinerary data',
    examples: 'Passenger details, itinerary preferences, dietary needs, accessibility requests, rooming notes, and emergency coordination details.',
    purpose: 'To reserve lodges, camps, permits, vehicles, guides, transfers, and related travel services.',
  },
  {
    category: 'Review and feedback data',
    examples: 'Name, email, country, travel month, destination, rating categories, review title, and review content.',
    purpose: 'To moderate, verify, and publish safari reviews or improve service quality.',
  },
  {
    category: 'Newsletter and campaign data',
    examples: 'Email address, campaign source, subscription status, and unsubscribe preference.',
    purpose: 'To send safari insights, seasonal offers, and service updates when requested.',
  },
  {
    category: 'Website preference data',
    examples: 'Favourite tours, modal preferences, session context, recently selected tours, and quote handoff details.',
    purpose: 'To make the site easier to use and preserve the planning context you choose to provide.',
  },
  {
    category: 'Technical and security data',
    examples: 'Device type, browser signals, page interactions, IP-derived region, logs, and form delivery records.',
    purpose: 'To operate the website, troubleshoot errors, reduce abuse, and maintain security.',
  },
];

const privacyRights = [
  'Be informed about how your personal data is used.',
  'Request access to personal data we hold about you.',
  'Ask us to correct inaccurate or incomplete information.',
  'Object to or restrict certain processing where the law allows.',
  'Request deletion where retention is no longer necessary or legally required.',
  'Withdraw consent for marketing or optional processing at any time.',
  'Ask questions or raise a complaint with the relevant data protection authority.',
];

const bookingResponsibilities = [
  'Review names, dates, accommodation level, destination order, and inclusions before paying a deposit.',
  'Check passport validity, visa requirements, health requirements, insurance, and flight timing before travel.',
  'Tell us early about medical, mobility, dietary, child travel, pregnancy, or special assistance needs.',
  'Respect park rules, guide instructions, wildlife distance rules, local communities, and lodge policies.',
  'Keep emergency contacts reachable and respond quickly when time-sensitive supplier confirmations are needed.',
];

const refundSchedule = [
  {
    stage: 'Before deposit is paid',
    outcome: 'No Karla Safari Adventures cancellation charge.',
    notes: 'Any third-party service already requested at your instruction may still carry a supplier cost.',
  },
  {
    stage: '91 or more days before departure',
    outcome: 'Refund of recoverable amounts, less bank charges, payment processor fees, and supplier non-refundable costs.',
    notes: 'We will try to negotiate favourable supplier treatment before calculating the final refund.',
  },
  {
    stage: '61 to 90 days before departure',
    outcome: 'Up to 70 percent of recoverable land arrangement costs may be refundable.',
    notes: 'Seasonal lodge deposits, domestic flights, and permits often reduce the recoverable amount.',
  },
  {
    stage: '31 to 60 days before departure',
    outcome: 'Up to 50 percent of recoverable land arrangement costs may be refundable.',
    notes: 'Many camps and lodges begin charging substantial cancellation fees during this window.',
  },
  {
    stage: '15 to 30 days before departure',
    outcome: 'Up to 25 percent of recoverable land arrangement costs may be refundable.',
    notes: 'Refunds depend heavily on whether suppliers accept resale, postponement, or goodwill credit.',
  },
  {
    stage: '14 days or fewer before departure',
    outcome: 'Usually non-refundable except for amounts a supplier expressly returns to us.',
    notes: 'Travel insurance is strongly recommended for medical, family, work, flight, or emergency disruptions.',
  },
];

const cookieRows = [
  {
    category: 'Strictly necessary storage',
    examples: 'Session state, form handoff context, security signals, and route display state.',
    consent: 'No consent required where needed to provide the requested website function.',
  },
  {
    category: 'Preference storage',
    examples: 'Favourite safaris, hidden pop-up preference, selected comparison or enquiry context.',
    consent: 'Used to remember choices you make on the website.',
  },
  {
    category: 'Form and communication tools',
    examples: 'EmailJS delivery records, enquiry metadata, newsletter submission status, and anti-abuse signals.',
    consent: 'Used when you submit a form or request a communication from us.',
  },
  {
    category: 'Analytics and performance tools',
    examples: 'Page usage, device category, referrer, errors, and aggregate visit behaviour if enabled.',
    consent: 'Where required, optional analytics should run only after consent.',
  },
  {
    category: 'Marketing and social tools',
    examples: 'Links to Instagram, Facebook, TikTok, WhatsApp, and embedded or future campaign tools.',
    consent: 'Optional marketing cookies or pixels require consent where applicable.',
  },
];

const policies = {
  'privacy-policy': {
    title: 'Privacy Policy',
    eyebrow: 'Data protection, privacy, and traveller confidence',
    icon: ShieldCheck,
    intro:
      'This Privacy Policy explains how Karla Safari Adventures handles personal information when you browse the website, request a quote, subscribe to updates, write a review, or plan a safari with our team.',
    highlights: [
      'Designed around Kenya privacy expectations and international traveller transparency.',
      'Covers website forms, reviews, newsletter signups, favourites, itinerary planning, and supplier sharing.',
      'Explains your access, correction, objection, deletion, and marketing opt-out rights.',
    ],
    stats: [
      { label: 'Primary contact', value: CONTACT.email },
      { label: 'Main location', value: 'Nairobi, Kenya' },
      { label: 'Response target', value: 'Within 24 hours' },
    ],
    sections: [
      {
        id: 'scope',
        title: '1. Scope and controller details',
        icon: Globe2,
        body: [
          `${CONTACT.company} operates this website and uses it to provide safari planning, travel information, quote requests, booking support, reviews, and related communications. For the purposes of this policy, "we", "us", and "our" mean ${CONTACT.company}.`,
          'This policy applies to visitors, prospective travellers, newsletter subscribers, review contributors, booking clients, and anyone who contacts us through the website, email, phone, WhatsApp, or social media links connected to the site.',
          'The final handling of your personal data may also be affected by the specific lodges, camps, airlines, activity providers, permit authorities, payment providers, and local partners needed to deliver your itinerary.',
        ],
      },
      {
        id: 'data-map',
        title: '2. Personal data we may collect',
        icon: FileText,
        body: [
          'We collect information directly from you, from your use of the website, from booking communications, and from service partners where necessary to administer a safari. We aim to collect only what is relevant for the purpose at hand.',
        ],
        table: {
          columns: ['Category', 'Examples', 'Why it matters'],
          rows: privacyDataMap.map((row) => [row.category, row.examples, row.purpose]),
        },
      },
      {
        id: 'lawful-use',
        title: '3. How and why we use your information',
        icon: UserCheck,
        body: [
          'We use personal data to respond to enquiries, prepare proposals, reserve services, manage traveller support, send requested information, deliver newsletters, moderate reviews, improve the website, prevent abuse, and meet legal or accounting obligations.',
          'Depending on the context, our lawful reasons may include your consent, steps needed before entering a travel contract, performance of a booking contract, legitimate business interests, compliance with legal obligations, or protection of vital interests in an emergency.',
          'We do not sell personal information. We do not use traveller data to make automated decisions that produce legal or similarly significant effects.',
        ],
        cards: [
          {
            title: 'Proposal planning',
            text: 'We combine the details you give us with destination knowledge to design routes, lodge options, safari pace, seasonal advice, and price estimates.',
          },
          {
            title: 'Trip operations',
            text: 'Once you book, we use relevant details to coordinate rooms, transfers, guides, permits, dietary needs, special occasions, and emergency support.',
          },
          {
            title: 'Service improvement',
            text: 'Reviews, form trends, delivery records, and website behaviour help us improve content, fix issues, and understand what travellers need.',
          },
        ],
      },
      {
        id: 'sharing',
        title: '4. Sharing with suppliers and service providers',
        icon: BookOpen,
        body: [
          'Safari delivery requires coordination with trusted third parties. We may share relevant information with lodges, camps, hotels, ground handlers, guides, vehicle providers, domestic flight operators, permit authorities, activity providers, payment or banking providers, professional advisers, and technology providers such as form delivery services.',
          'We only share the information reasonably required for the service. For example, a lodge may need names, arrival dates, rooming notes, dietary requirements, and special requests. A permit authority may need passport or identity details. A form provider may process your submitted enquiry so it reaches our inbox.',
          'Some partners may act as independent controllers under their own privacy notices. Their rules may apply when you interact with them directly or when they are legally required to process your information in their own right.',
        ],
      },
      {
        id: 'international',
        title: '5. International transfers',
        icon: Globe2,
        body: [
          'Because safaris often involve Kenya, Tanzania, Uganda, Rwanda, South Africa, international travellers, global email services, and cross-border suppliers, personal data may be processed outside your home country.',
          'Where cross-border transfer safeguards are required, we aim to use appropriate contractual, technical, organisational, or consent-based safeguards. We also limit sharing to what is necessary for the itinerary or communication you requested.',
        ],
      },
      {
        id: 'retention-security',
        title: '6. Retention and security',
        icon: Lock,
        body: [
          'We keep personal data only for as long as reasonably necessary for the purpose collected, including enquiry follow-up, booking operations, accounting, legal record keeping, dispute management, fraud prevention, and service improvement.',
          'Typical enquiry records may be kept long enough to continue a planning conversation and understand past requests. Booking records may be kept longer because they can be needed for tax, supplier reconciliation, insurance, legal, or customer service purposes.',
          'We use practical security measures such as limited access, reputable service providers, secure accounts, staff awareness, and record review. No internet transmission is completely risk-free, so visitors should avoid sending highly sensitive information until it is specifically needed for a confirmed booking.',
        ],
      },
      {
        id: 'rights',
        title: '7. Your privacy rights',
        icon: ShieldCheck,
        body: [
          'Depending on your location and the applicable law, you may have the following rights. We will respond to valid requests as promptly as reasonably possible and may need to verify your identity before acting.',
        ],
        list: privacyRights,
      },
      {
        id: 'children',
        title: '8. Children and family bookings',
        icon: UserCheck,
        body: [
          'We do not knowingly invite children to submit personal data directly through the website. Family safari information should be provided by a parent, guardian, or authorised adult.',
          'For confirmed family travel, we may need child ages, rooming details, passport or permit details, medical considerations, dietary requirements, and guardian contact information to operate the trip safely and responsibly.',
        ],
      },
      {
        id: 'contact',
        title: '9. Privacy contact',
        icon: Mail,
        body: [
          `Send privacy questions, access requests, correction requests, deletion requests, or marketing opt-outs to ${CONTACT.email}. You can also call ${CONTACT.phone} or write to ${CONTACT.company}, ${CONTACT.address}.`,
          'If you believe your data protection concern has not been resolved, you may contact the relevant data protection authority for your location. In Kenya, the Office of the Data Protection Commissioner provides information about data subject rights and complaint channels.',
        ],
      },
    ],
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions',
    eyebrow: 'Website use, proposals, bookings, and safari responsibilities',
    icon: Scale,
    intro:
      'These Terms and Conditions explain how visitors may use this website and how safari enquiries, proposals, bookings, supplier arrangements, and traveller responsibilities are handled.',
    highlights: [
      'Website information is a planning guide until confirmed in a written proposal or invoice.',
      'Final bookings are subject to itinerary-specific supplier terms and payment schedules.',
      'Responsible travel, safety, wildlife rules, and guide instructions are essential conditions.',
    ],
    stats: [
      { label: 'Applies to', value: 'Website and safari services' },
      { label: 'Booking model', value: 'Custom proposal' },
      { label: 'Support channel', value: CONTACT.bookingsEmail },
    ],
    sections: [
      {
        id: 'agreement',
        title: '1. Acceptance of these terms',
        icon: CheckCircle,
        body: [
          `By using this website, submitting a form, requesting a quote, subscribing to updates, writing a review, or booking travel services with ${CONTACT.company}, you agree to these Terms and Conditions.`,
          'If you make a booking on behalf of other travellers, you confirm that you are authorised to accept these terms for the group and to share necessary traveller information with us.',
          'A signed proposal, invoice, payment request, supplier condition, or written itinerary may include additional terms. If there is a conflict, the itinerary-specific written booking terms usually take priority for that booking.',
        ],
      },
      {
        id: 'website-use',
        title: '2. Website use and content',
        icon: FileText,
        body: [
          'The website provides safari inspiration, destination information, tour ideas, blog content, images, enquiry forms, review submission tools, and links to third-party services. It is provided for general planning and communication.',
          'You must not misuse the website, attempt unauthorised access, scrape content at scale, submit false enquiries, interfere with forms, upload harmful content, or use the website in a way that damages our systems or reputation.',
          'Images, text, itineraries, branding, layouts, and curated travel content are protected by intellectual property rights. You may not copy, republish, sell, or commercially reuse them without written permission.',
        ],
      },
      {
        id: 'quotes',
        title: '3. Enquiries, proposals, and availability',
        icon: Mail,
        body: [
          'Website tour pages are examples of possible journeys. Prices, availability, park fees, accommodation, permit rules, flight schedules, vehicle availability, and seasonal conditions can change.',
          'A quote is not a confirmed booking until we issue written confirmation and the required payment has cleared. Holding space with camps, lodges, airlines, or permit authorities may require a deposit and is subject to their policies.',
          'We may decline an enquiry or booking request where availability is unsuitable, safety standards cannot be met, payment requirements are not satisfied, or the requested travel would be irresponsible or impractical.',
        ],
      },
      {
        id: 'prices',
        title: '4. Prices, deposits, and payment',
        icon: FileText,
        body: [
          'Quoted prices are normally based on the itinerary, dates, group size, accommodation level, exchange rates, park fees, permits, transport, taxes, and supplier availability at the time of proposal.',
          'Deposits secure planning and supplier reservations. Balance due dates will be stated in your proposal or invoice. Late payment may result in cancellation, supplier penalties, or loss of availability.',
          'Bank charges, card processing fees, currency conversion costs, international transfer costs, and chargeback costs are the responsibility of the payer unless otherwise stated in writing.',
          'Where a supplier, government authority, airline, park, conservancy, or tax authority changes a mandatory fee after quotation, we may need to adjust the final amount and will explain the reason clearly.',
        ],
      },
      {
        id: 'traveller-responsibilities',
        title: '5. Traveller responsibilities',
        icon: UserCheck,
        body: [
          'Safari travel involves remote locations, wildlife environments, international borders, climate variation, road conditions, and supplier schedules. Travellers are responsible for preparing properly and communicating honestly.',
        ],
        list: bookingResponsibilities,
      },
      {
        id: 'safety',
        title: '6. Wildlife, guide instructions, and responsible conduct',
        icon: AlertTriangle,
        body: [
          'Wildlife sightings are never guaranteed. Animal behaviour, weather, migration timing, road conditions, park rules, and conservation restrictions can affect what you see and how long you spend at each sighting.',
          'You must follow guide, ranger, pilot, lodge, camp, and park authority instructions. This includes remaining in vehicles unless permitted, keeping a safe distance from wildlife, avoiding noise at sensitive sightings, respecting photography rules, and observing community protocols.',
          'We may remove a traveller from an activity or itinerary where their behaviour creates safety, conservation, legal, or reputational risk. Costs resulting from such removal are the traveller responsibility.',
        ],
      },
      {
        id: 'changes',
        title: '7. Itinerary changes and force majeure',
        icon: CalendarClock,
        body: [
          'We try to deliver the itinerary as confirmed, but safari travel can require adjustments. Changes may arise from weather, road conditions, wildlife movement, government action, park closures, aircraft delays, supplier changes, illness, security concerns, public health measures, or events beyond reasonable control.',
          'Where possible, we will provide a suitable alternative of comparable value. If an alternative costs more because of supplier pricing or emergency logistics, the additional cost may be payable by the traveller unless covered by insurance or supplier goodwill.',
          'Force majeure events may limit refunds and require reliance on supplier credits, postponement, or travel insurance.',
        ],
      },
      {
        id: 'liability',
        title: '8. Liability and third-party suppliers',
        icon: Scale,
        body: [
          'We coordinate safari services using carefully selected partners, but many services are delivered by independent suppliers such as lodges, camps, airlines, guides, transfer companies, activity providers, permit authorities, and payment providers.',
          'Supplier terms, safety rules, insurance conditions, cancellation rules, and liability limitations may apply. We are not responsible for losses caused by a third party where the issue is outside our reasonable control, although we will assist you in resolving genuine service problems.',
          'Nothing in these terms excludes liability that cannot legally be excluded. These terms do not affect mandatory consumer rights that apply to your booking.',
        ],
      },
      {
        id: 'reviews',
        title: '9. Reviews and user content',
        icon: Sparkles,
        body: [
          'If you submit a review or testimonial, you give us permission to moderate, display, edit for length or clarity, and use it in website or marketing materials, unless you request otherwise.',
          'Reviews must be honest, lawful, respectful, and based on genuine experience. We may remove content that is false, abusive, discriminatory, defamatory, spammy, or unrelated to the travel experience.',
        ],
      },
      {
        id: 'law',
        title: '10. Governing law and disputes',
        icon: Scale,
        body: [
          'These website terms are intended to be governed by the laws of Kenya unless mandatory rules in another jurisdiction apply to a particular consumer booking.',
          'Before starting formal action, both sides should first try to resolve concerns through good-faith written communication. Send booking disputes to the email address on your invoice or to the contact details listed on this page.',
        ],
      },
    ],
  },
  'refund-cancellation-policy': {
    title: 'Refund & Cancellation Policy',
    eyebrow: 'Cancellations, postponements, supplier charges, and refund handling',
    icon: RefreshCw,
    intro:
      'This policy explains the default approach to cancellations, refunds, postponements, non-refundable supplier costs, and disrupted safari arrangements. Your confirmed proposal or invoice may contain stricter or more specific terms.',
    highlights: [
      'Cancellation requests must be sent in writing.',
      'Refunds depend on what suppliers return to us and what costs are non-refundable.',
      'Travel insurance is strongly recommended for every safari booking.',
    ],
    stats: [
      { label: 'Cancellation notice', value: 'Written notice required' },
      { label: 'Refund basis', value: 'Recoverable amounts' },
      { label: 'Recommended cover', value: 'Comprehensive travel insurance' },
    ],
    sections: [
      {
        id: 'principle',
        title: '1. Core refund principle',
        icon: FileText,
        body: [
          'Safari bookings usually involve multiple suppliers, including lodges, camps, hotels, ground handlers, domestic airlines, permit authorities, conservancies, park authorities, vehicle providers, and guides. Many of these suppliers require deposits or prepayment.',
          'For that reason, refunds are based on recoverable amounts rather than the full amount paid. A recoverable amount is money we are able to reclaim or have not yet had to pay out, after deducting supplier penalties, bank charges, card fees, permit charges, taxes, administrative costs, and any services already delivered.',
          'If your final proposal or invoice gives a different cancellation schedule, the booking-specific schedule controls that booking.',
        ],
      },
      {
        id: 'how-to-cancel',
        title: '2. How to cancel',
        icon: Mail,
        body: [
          `Cancellation requests must be made in writing to ${CONTACT.email} or ${CONTACT.bookingsEmail}. The cancellation date is the date on which we receive the written request during normal business processing, not the date you intended to send it.`,
          'The request should include the lead traveller name, booking reference if available, travel dates, reason for cancellation, and whether you want a refund, postponement, credit, or supplier renegotiation.',
          'We may ask for additional information if a supplier, insurer, airline, or permit authority needs it to process a refund or credit.',
        ],
      },
      {
        id: 'schedule',
        title: '3. Default cancellation schedule',
        icon: CalendarClock,
        body: [
          'The guide below is a default planning schedule for land arrangements unless your written proposal states otherwise. It does not override stricter airline, permit, lodge, park, or group-departure rules.',
        ],
        table: {
          columns: ['Timing', 'Default outcome', 'Important notes'],
          rows: refundSchedule.map((row) => [row.stage, row.outcome, row.notes]),
        },
      },
      {
        id: 'non-refundable',
        title: '4. Costs that are commonly non-refundable',
        icon: AlertTriangle,
        body: [
          'Some safari costs are difficult or impossible to recover once booked. These may include gorilla or chimpanzee permits, special park or conservancy permits, domestic or regional flights once ticketed, non-refundable lodge deposits, private charter commitments, peak-season room blocks, bank charges, payment processor fees, visa costs, insurance premiums, and any service already delivered.',
          'If a supplier later refunds a non-refundable item as goodwill, we will pass the recoverable amount back to you after applicable costs.',
        ],
      },
      {
        id: 'postponement',
        title: '5. Postponements and travel credits',
        icon: RefreshCw,
        body: [
          'Where cancellation is not ideal, we will often try to postpone the itinerary. Postponement depends on supplier approval, new dates, seasonal pricing, availability, park fee changes, flight rules, and permit validity.',
          'A travel credit is not the same as a cash refund. Credits may expire, may be supplier-specific, may not be transferable, and may require payment of fare differences, seasonal surcharges, or new government fees.',
        ],
      },
      {
        id: 'operator-cancellation',
        title: '6. If we or a supplier cancel',
        icon: HelpCircle,
        body: [
          'If we must cancel a confirmed arrangement for reasons within our control, we will aim to provide a suitable replacement, postponement, credit, or refund of recoverable amounts.',
          'If a supplier cancels because of weather, safety, mechanical issues, park closure, overbooking, insolvency, public health restrictions, or government action, the supplier rules and available remedies will apply. We will advocate for you and communicate available options clearly.',
        ],
      },
      {
        id: 'chargebacks',
        title: '7. Payment disputes and chargebacks',
        icon: Scale,
        body: [
          'If you believe a payment is incorrect, contact us first so we can investigate. Unfounded chargebacks can create bank fees, supplier complications, and booking risk.',
          'Where a chargeback is raised after services have been supplied or supplier costs have been incurred, we may provide records to the payment provider and may seek recovery of bank fees, penalties, and unpaid amounts.',
        ],
      },
      {
        id: 'insurance',
        title: '8. Travel insurance',
        icon: ShieldCheck,
        body: [
          'Comprehensive travel insurance is strongly recommended and may be required for some itineraries. It should cover cancellation, curtailment, medical emergencies, evacuation, luggage, flight disruption, missed connections, supplier failure where available, and activities included in your itinerary.',
          'Insurance should be purchased soon after booking because some benefits only apply if coverage begins early.',
        ],
      },
      {
        id: 'refund-processing',
        title: '9. Refund processing time',
        icon: FileText,
        body: [
          'Once a refund amount is confirmed, processing time depends on supplier remittance, bank timelines, currency conversion, payment method, and verification requirements. We will give a realistic update once suppliers have responded.',
          'Refunds are normally returned to the original payer or payment method unless law, banking rules, or written agreement require another method.',
        ],
      },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    eyebrow: 'Cookies, local storage, browser preferences, and consent choices',
    icon: Cookie,
    intro:
      'This Cookie Policy explains how this website may use cookies, local storage, session storage, form tools, and similar technologies to operate, remember preferences, improve service, and support communications.',
    highlights: [
      'The site uses browser storage for favourites, quote context, and pop-up preferences.',
      'Form submissions may use third-party communication tools to deliver enquiries.',
      'Optional analytics or marketing cookies should be used only where consent rules allow.',
    ],
    stats: [
      { label: 'Preference storage', value: 'Favorites and pop-ups' },
      { label: 'Forms', value: 'Email delivery tools' },
      { label: 'Control point', value: 'Browser settings' },
    ],
    sections: [
      {
        id: 'what',
        title: '1. What cookies and similar technologies are',
        icon: Cookie,
        body: [
          'Cookies are small text files placed on your device by a website. Similar technologies include local storage, session storage, pixels, tags, and embedded third-party tools.',
          'These tools can remember choices, keep a website working, measure performance, deliver forms, protect against abuse, or connect a visitor with social and marketing platforms.',
        ],
      },
      {
        id: 'current-site',
        title: '2. How this website currently uses browser storage',
        icon: Lock,
        body: [
          'The website may use local storage or session storage to remember favourite safari selections, hide a promotional modal after you dismiss it, preserve quote handoff context, and avoid losing your planning context as you move through the site.',
          'These records are generally stored in your own browser. You can remove them by clearing your browser storage or site data.',
        ],
      },
      {
        id: 'categories',
        title: '3. Cookie and storage categories',
        icon: FileText,
        body: [
          'The categories below explain the types of technology that may be used now or added as the website grows. We aim to separate necessary functionality from optional analytics or marketing tools.',
        ],
        table: {
          columns: ['Category', 'Examples', 'Consent position'],
          rows: cookieRows.map((row) => [row.category, row.examples, row.consent]),
        },
      },
      {
        id: 'third-parties',
        title: '4. Third-party tools',
        icon: Globe2,
        body: [
          'The website links to or may interact with services such as WhatsApp, Instagram, Facebook, TikTok, flag/image services, map or media providers, and form delivery providers. Those services may set their own cookies or process data when you interact with them.',
          'When you leave this website through a social, messaging, or supplier link, the third-party privacy and cookie rules apply to that interaction.',
        ],
      },
      {
        id: 'choices',
        title: '5. Your choices',
        icon: UserCheck,
        body: [
          'You can block, delete, or manage cookies and site storage in your browser settings. If you block necessary storage, features such as favourites, modal preferences, or enquiry handoff context may not work correctly.',
          'Where a cookie banner or preference tool is presented, use it to accept, reject, or adjust optional categories. You can also contact us if you need help understanding how a particular tool is used.',
        ],
      },
      {
        id: 'updates',
        title: '6. Updates to this Cookie Policy',
        icon: CalendarClock,
        body: [
          'We may update this Cookie Policy when the website adds new features, analytics, marketing tools, embedded content, booking tools, or consent controls. The updated date at the top of the page shows when the current version was published.',
        ],
      },
    ],
  },
};

const policyAliases = {
  privacy: 'privacy-policy',
  terms: 'terms-and-conditions',
  'refund-policy': 'refund-cancellation-policy',
  'cancellation-policy': 'refund-cancellation-policy',
  cookies: 'cookie-policy',
};

function getPolicyFromPath(pathname) {
  const slug = pathname.split('/').filter(Boolean)[0] || 'privacy-policy';
  return policies[slug] ? slug : policyAliases[slug] || 'privacy-policy';
}

function PolicyTable({ table }) {
  return (
    <div className="mt-6 max-w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-800/80">
      <div className="overflow-x-auto">
        <table className="min-w-[720px] divide-y divide-slate-700">
          <thead className="bg-slate-700/60">
            <tr>
              {table.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-orange-300"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {table.rows.map((row, rowIndex) => (
              <tr key={`${row[0]}-${rowIndex}`} className="align-top">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${row[0]}-${cellIndex}`}
                    className={`px-4 py-4 text-sm leading-relaxed ${
                      cellIndex === 0 ? 'font-semibold text-white' : 'text-gray-300'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionBlock({ section }) {
  const Icon = section.icon || FileText;

  return (
    <section id={section.id} className="min-w-0 scroll-mt-32">
      <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-800/80 p-5 shadow-2xl shadow-black/20 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/15">
            <Icon className="h-5 w-5 text-orange-400" />
          </div>
          <div className="min-w-0 break-words">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{section.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-gray-300">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {section.list && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {section.list.map((item) => (
              <li key={item} className="flex gap-3 rounded-lg border border-slate-700 bg-slate-700/60 p-4 text-sm leading-6 text-gray-300">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {section.cards && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {section.cards.map((card) => (
              <article key={card.title} className="min-w-0 rounded-lg border border-slate-700 bg-slate-700/60 p-4">
                <h3 className="text-base font-bold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-300">{card.text}</p>
              </article>
            ))}
          </div>
        )}

        {section.table && <PolicyTable table={section.table} />}
      </div>
    </section>
  );
}

function LegalPage() {
  const location = useLocation();
  const activeSlug = getPolicyFromPath(location.pathname);
  const policy = policies[activeSlug];
  const ActiveIcon = policy.icon;

  useEffect(() => {
    document.title = `${policy.title} | Karla Safari Adventures`;
  }, [policy.title]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-900 text-white">
      <section className="relative overflow-hidden border-b border-slate-700">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="max-w-5xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">
              <ActiveIcon className="h-4 w-4 text-orange-400" />
              {policy.eyebrow}
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {policy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl">
              {policy.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#policy-content"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:from-orange-600 hover:to-red-600"
              >
                Read policy
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-bold text-orange-300 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-200"
              >
                Ask a question
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {policy.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-slate-700 bg-slate-800/80 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">{stat.label}</p>
                <p className="mt-2 break-words text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="policy-content" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="min-w-0 lg:sticky lg:top-32 lg:self-start">
            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800/80 p-4 backdrop-blur">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Policy library</p>
              <nav className="space-y-2">
                {policyNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.slug === activeSlug;
                  return (
                    <Link
                      key={item.slug}
                      to={`/${item.slug}`}
                      className={`flex items-start gap-3 rounded-lg border px-3 py-3 transition ${
                        isActive
                          ? 'border-orange-500/45 bg-orange-500/15 text-white'
                          : 'border-slate-700 bg-slate-800/70 text-gray-300 hover:border-orange-500/30 hover:bg-slate-700/60 hover:text-orange-200'
                      }`}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">{item.shortLabel}</span>
                        <span className="mt-1 block break-words text-xs leading-5 text-gray-400">{item.description}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Last updated</p>
              <p className="mt-2 text-sm font-semibold text-white">{LAST_UPDATED}</p>
              <p className="mt-3 text-xs leading-5 text-gray-300">
                These pages provide website and booking transparency. Your confirmed proposal, invoice, and supplier rules may add itinerary-specific terms.
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-7">
            <div className="grid gap-4 md:grid-cols-3">
              {policy.highlights.map((highlight) => (
                <div key={highlight} className="min-w-0 rounded-lg border border-slate-700 bg-slate-800/80 p-4">
                  <CheckCircle className="h-5 w-5 text-orange-400" />
                  <p className="mt-3 text-sm leading-6 text-gray-300">{highlight}</p>
                </div>
              ))}
            </div>

            {policy.sections.map((section) => (
              <SectionBlock key={section.id} section={section} />
            ))}

            <section className="rounded-lg border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-600/5 p-5 sm:p-7">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Need clarification?</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Contact Karla Safari Adventures</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300">
                    For privacy requests, booking terms, refund questions, supplier conditions, or cookie questions, contact the team before you book or travel.
                  </p>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-orange-400" />
                    <a className="hover:text-orange-200" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-orange-400" />
                    <a className="hover:text-orange-200" href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-orange-400" />
                    <span>{CONTACT.address}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LegalPage;
