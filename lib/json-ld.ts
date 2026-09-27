import { siteConfig } from './site-config'
// json-ld.ts is a utility file that generates JSON-LD structured data for the website. JSON-LD is a method of encoding Linked Data using JSON, which helps search engines understand the content and context of the website, improving SEO and rich results in search engine listings.

export function getJsonLd(locale: string = 'en') {
  const inLanguage = locale === 'vi' ? 'vi-VN' : 'en-US'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}/#person`,
        name: 'Nguyễn Hoàng Anh',
        alternateName: siteConfig.author.alternateName,
        givenName: 'Nguyễn Hoàng Anh',
        familyName: 'Nguyễn',
        jobTitle: 'Full-Stack Developer',
        url: siteConfig.url,
        email: siteConfig.author.email,
        image: siteConfig.defaultOgImage,
        sameAs: [
          siteConfig.social.github,
          siteConfig.social.facebook,
          siteConfig.social.linkedin,
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ho Chi Minh City',
          addressRegion: 'Ho Chi Minh',
          addressCountry: 'VN',
        },
        knowsAbout: [
          'Web Development',
          'Next.js',
          'React',
          'Tailwind CSS',
          'Node.js',
          'TypeScript',
          'JavaScript',
          'Python',
          'SEO Optimization',
          'English Teaching',
          'Private Tutoring',
          'Mathematics Tutoring',
        ],
        description: siteConfig.description,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: [
          'anhnguyendev',
          'Anh Nguyen',
          'Nguyễn Hoàng Anh',
        ],
        description: siteConfig.description,
        publisher: { '@id': `${siteConfig.url}/#person` },
        inLanguage: inLanguage,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteConfig.url}/#webpage`,
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { '@id': `${siteConfig.url}/#website` },
        about: { '@id': `${siteConfig.url}/#person` },
        inLanguage: inLanguage,
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteConfig.url}/#service`,
        name: 'Anh Nguyen Dev — Web Development & Education Services',
        url: siteConfig.url,
        provider: { '@id': `${siteConfig.url}/#person` },
        areaServed: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 10.8231,
            longitude: 106.6297,
          },
          geoRadius: '50000',
        },
        serviceType: [
          'Full-Stack Web Development',
          'Private Tutoring',
          'English Teaching',
          'SEO Optimization',
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ho Chi Minh City',
          addressRegion: 'Ho Chi Minh',
          addressCountry: 'VN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: siteConfig.author.email,
          contactType: 'Customer Support',
          availableLanguage: ['English', 'Vietnamese'],
        },
        description:
          'Freelance full-stack web development, private tutoring, English teaching, and SEO optimization services by Nguyễn Hoàng Anh in Vietnam.',
      },
    ],
  }
}
