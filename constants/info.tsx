import {
  FaEnvelope,
  FaMapMarkedAlt,
  FaPhoneAlt,
} from 'react-icons/fa'
import { siteConfig } from '@/lib/site-config'

export interface InfoItem {
  icon: React.ReactNode
  title: string
  description: string
}

export const info: InfoItem[] = [
  {
    icon: <FaPhoneAlt />,
    title: 'Phone',
    description: siteConfig.author.phone,
  },
  {
    icon: <FaEnvelope />,
    title: 'Email',
    description: siteConfig.author.email,
  },
  {
    icon: <FaMapMarkedAlt />,
    title: 'Address',
    description: siteConfig.author.location,
  },
] as const
