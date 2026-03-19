import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const config = [
  ...nextCoreWebVitals,
  prettier,
  {
    rules: {
      semi: 'off',
      quotes: ['warn', 'single', { avoidEscape: true }],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
    },
  },
]

export default config
