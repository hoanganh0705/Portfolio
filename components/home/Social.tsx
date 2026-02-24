import { socials } from '@/constants/socials'
import React from 'react'

interface SocialProps {
  containerStyles?: string
  iconStyles?: string
}

const Social: React.FC<SocialProps> = ({
  containerStyles = '',
  iconStyles = '',
}) => {
  return (
    <div className={containerStyles}>
      {socials.map((social, index) => {
        return (
          <a
            aria-label={`View my ${social.name}`}
            key={index}
            href={social.path}
            className={iconStyles}
            rel='noopener noreferrer'
            target='_blank'
          >
            {social.icon}
          </a>
        )
      })}
    </div>
  )
}

export default Social
