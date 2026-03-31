import { socials } from '@/constants/socials'

interface SocialProps {
  containerStyles?: string
  iconStyles?: string
}

const Social = ({
  containerStyles = '',
  iconStyles = '',
}) => {
  return (
    <div className={containerStyles}>
      {socials.map((social) => {
        return (
          <a
            aria-label={`View my ${social.name}`}
            key={social.name}
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
