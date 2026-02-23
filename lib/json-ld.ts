import { siteConfig } from './site-config'

export const json_ld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      'name': siteConfig.author.name,
      'alternateName': siteConfig.author.alternateName,
      'jobTitle': siteConfig.author.jobTitle,
      'url': siteConfig.url,
      'email': siteConfig.author.email,
      'image': siteConfig.defaultOgImage,
      'sameAs': [
        siteConfig.social.github,
        siteConfig.social.facebook,
        siteConfig.social.linkedin,
      ],
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Ho Chi Minh City',
        'addressRegion': 'Ho Chi Minh',
        'addressCountry': 'VN',
      },
      'knowsAbout': [
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
      'description': siteConfig.description,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      'url': siteConfig.url,
      'name': siteConfig.name,
      'alternateName': ['anhnguyendev', 'Anh Nguyen Dev Portfolio'],
      'description': siteConfig.description,
      'publisher': { '@id': `${siteConfig.url}/#person` },
      'inLanguage': 'en-US',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${siteConfig.url}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteConfig.url}/#service`,
      'name': 'Anh Nguyen Dev — Web Development & Education Services',
      'url': siteConfig.url,
      'provider': { '@id': `${siteConfig.url}/#person` },
      'areaServed': {
        '@type': 'GeoCircle',
        'geoMidpoint': {
          '@type': 'GeoCoordinates',
          'latitude': 10.8231,
          'longitude': 106.6297,
        },
        'geoRadius': '50000',
      },
      'serviceType': [
        'Full-Stack Web Development',
        'Private Tutoring',
        'English Teaching',
        'SEO Optimization',
      ],
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Ho Chi Minh City',
        'addressRegion': 'Ho Chi Minh',
        'addressCountry': 'VN',
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'email': siteConfig.author.email,
        'contactType': 'Customer Support',
        'availableLanguage': ['English', 'Vietnamese'],
      },
      'description':
        'Freelance full-stack web development, private tutoring, English teaching, and SEO optimization services by Anh Nguyen Dev in Vietnam.',
    },
  ],
}
