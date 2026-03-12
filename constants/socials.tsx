import {
  FaGithub,
  FaFacebook,
  FaLinkedin,
} from 'react-icons/fa'
import { siteConfig } from '@/lib/site-config'

export interface SocialItem {
  name: string
  icon: React.ReactNode
  path: string
}

export const socials: SocialItem[] = [
  {
    name: 'Github',
    icon: <FaGithub />,
    path: siteConfig.social.github,
  },
  {
    name: 'Facebook',
    icon: <FaFacebook />,
    path: siteConfig.social.facebook,
  },
  {
    name: 'Linkedin',
    icon: <FaLinkedin />,
    path: siteConfig.social.linkedin,
  },
]
