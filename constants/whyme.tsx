import { TiLightbulb } from 'react-icons/ti'
import { RxRocket } from 'react-icons/rx'
import { MdLockOutline } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'

export interface WhyMeItem {
  icon: React.ReactNode
  whyMe: string
  briefDesc: string
}

export const whyMe: WhyMeItem[] = [
  {
    icon: <TiLightbulb />,
    whyMe: 'Problem-solving mindset',
    briefDesc:
      'Challenges are addressed through strategic thinking and creative solutions, leveraging research and experience to meet complex requirements effectively.',
  },
  {
    icon: <RxRocket />,
    whyMe: 'Fast Service',
    briefDesc:
      "My passion lies in crafting high-quality web solutions. I'm a lifelong learner, constantly honing my skills to bring you the most current and effective technologies.",
  },
  {
    icon: <MdLockOutline />,
    whyMe: 'Secure solutions',
    briefDesc:
      'Built with stability and data protection in mind, using industry-standard security protocols and robust testing procedures.',
  },

  {
    icon: <IoEyeOutline />,
    whyMe: 'Transparent and clear',
    briefDesc:
      'Maintains consistent updates and transparent collaboration to ensure all stakeholders remain aligned throughout the development process.',
  },
]
