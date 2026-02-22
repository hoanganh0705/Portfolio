// constants/services.ts (Mutable version)
export interface Service {
  num: string
  title: string
  description: string
  href: string
  packages?: {
    name: string
    price: string
    features: string[]
  }[]
  steps?: string[]
  testimonials?: {
    name: string
    comment: string
  }[]
}

export const services = [
  {
    num: '01',
    title: 'Web Developer',
    description:
      'Build dynamic, responsive websites with robust frontend interfaces and scalable backend systems. I deliver seamless, full-stack solutions that engage users and power your business.',
    href: '/services/web-development',
    tagline: 'Modern, fast & scalable websites',
    packages: [
      {
        name: 'Starter',
        price: '$50',
        features: [
          'Single-page site (up to 4 sections)',
          'Responsive design & basic SEO',
          'Deployed with HTTPS',
          '1 round of revisions',
        ],
      },
      {
        name: 'Growth',
        price: '$200',
        features: [
          'Multi-page website + Blog/CMS',
          'Performance optimization (90+ Lighthouse)',
          'Contact/lead forms & email integration',
          '3 rounds of revisions',
        ],
      },
      {
        name: 'Scale',
        price: '$800',
        features: [
          'Full-stack web app (Next.js + NestJS)',
          'Auth & role-based access',
          'Database & API integration',
          'CI/CD pipeline & analytics',
          '30-day post-launch support',
        ],
      },
    ],
    steps: [
      'Discovery Call & Requirements',
      'Proposal & Roadmap',
      'Design Wireframe & UI Kit',
      'Agile Development & Testing',
      'Launch, Monitor & Support',
    ],
    testimonials: [
      {
        name: 'Lisa N.',
        comment:
          'Our conversions increased by 35% after Anh rebuilt our site. The pages load lightning-fast and the UI feels premium!',
      },
      {
        name: 'David K.',
        comment:
          'Seamless collaboration and crystal-clear communication every step of the way. Highly recommended!',
      },
    ],
  },
  {
    num: '02',
    title: 'Private Tutor',
    description:
      'Unlock your potential with tailored tutoring sessions. From academic subjects to specialized skills, I provide personalized guidance to help you excel.',
    href: '/services/private-tutoring',
    tagline: 'Unlock your academic potential',
    packages: [
      {
        name: 'Homework Help',
        price: '$5/hr',
        features: [
          'On-demand problem solving',
          'Clarify class concepts',
          'Quick tips & tricks',
        ],
      },
      {
        name: 'Exam Prep',
        price: '$10/hr',
        features: [
          'Past-paper drilling',
          'Timed mock exams',
          'Targeted topic reviews',
        ],
      },
      {
        name: 'Skill Builder',
        price: '$200 (10-hour bundle)',
        features: [
          'Custom learning roadmap',
          'Progress tracking dashboard',
          'Weekly parents/guardian reports',
        ],
      },
    ],
    steps: [
      'Initial Assessment & Goal Setting',
      'Personalized Study Plan',
      'Interactive Lessons & Practice',
      'Weekly Progress Review',
      'Mastery Check & Next Steps',
    ],
    testimonials: [
      {
        name: 'Minh T.',
        comment:
          'From struggling with calculus to topping the class – couldn’t have done it without these sessions!',
      },
      {
        name: 'Anh.',
        comment:
          'Clear explanations and tons of patience. My confidence in Physics skyrocketed!',
      },
    ],
  },
  {
    num: '03',
    title: 'English Teacher',
    description:
      'Master English with personalized lessons tailored to your goals. Whether for professional growth or personal enrichment, I make learning dynamic, effective and enjoyable.',
    href: '/services/english-teaching',
    tagline: 'Personalized English coaching for every goal',
    packages: [
      {
        name: 'Conversation Booster',
        price: '$15/session',
        features: [
          '2-hour 1-on-1 calls',
          'Real-life speaking topics',
          'Instant pronunciation feedback',
        ],
      },
      {
        name: 'IELTS Master',
        price: '$25/session',
        features: [
          'Writing & Speaking focus',
          'Band-7+ task strategies',
          'Detailed corrections & notes',
        ],
      },
      {
        name: 'Business English',
        price: '$20/session',
        features: [
          'Presentation & email skills',
          'Negotiation role-plays',
          'Industry-specific vocabulary',
        ],
      },
    ],
    steps: [
      'Placement Test & Needs Analysis',
      'Goal Alignment & Course Plan',
      'Interactive Lessons & Tasks',
      'Weekly Feedback & Homework',
      'Achievement Review & Next Level',
    ],
    testimonials: [
      {
        name: 'Quan L.',
        comment:
          'Hit IELTS 7.5 after just 12 weeks – lessons were fun and super focused!',
      },
      {
        name: 'Jenny P.',
        comment:
          'My colleagues noticed my improved fluency and confidence in meetings. Thank you!',
      },
    ],
  },
  {
    num: '04',
    title: 'SEO',
    description:
      'Skyrocket your online visibility with strategic SEO. I optimize your website to climb search engine rankings, attract targeted traffic, and convert visitors into loyal customers through data-driven techniques.',
    href: '/services/seo',
    tagline: 'Skyrocket your online visibility',
    packages: [
      {
        name: 'Audit & Quick Wins',
        price: '$20 (one-off)',
        features: [
          'Comprehensive site audit',
          'Technical fixes & on-page tweaks',
          'Actionable 30-day roadmap',
        ],
      },
      {
        name: 'Growth SEO',
        price: '$80/mo',
        features: [
          'Keyword research & clustering',
          'Content Optimization & internal linking',
          'Monthly performance report',
        ],
      },
      {
        name: 'Authority SEO',
        price: '$150/mo',
        features: [
          'All Growth SEO features',
          'White-hat link building',
          'Digital PR & guest posts',
          'Quarterly strategy workshop',
        ],
      },
    ],
    steps: [
      'Site Audit & Benchmarking',
      'Keyword & Competitor Research',
      'On-Page Optimization',
      'Link Building & Content Marketing',
      'Reporting & Continuous Improvement',
    ],
    testimonials: [
      {
        name: 'StoreHub.io',
        comment:
          'Organic traffic doubled within 6 months – ROI on point!',
      },
      {
        name: 'GreenHome VN',
        comment:
          'Went from page 5 to top 3 for our main keyword. Brilliant!',
      },
    ],
  },
]
