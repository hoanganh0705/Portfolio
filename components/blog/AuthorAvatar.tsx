import Image from 'next/image'
import { FaUser } from 'react-icons/fa'

interface Props {
  name: string
  image?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { container: 'w-8 h-8', icon: 18, imgSize: '32px' },
  md: { container: 'w-12 h-12', icon: 24, imgSize: '48px' },
  lg: { container: 'w-16 h-16', icon: 32, imgSize: '64px' },
}

export function AuthorAvatar({
  name,
  image,
  size = 'md',
}: Props) {
  const { container, icon, imgSize } = sizeMap[size]

  return (
    <div
      className={`relative ${container} rounded-full overflow-hidden bg-accent-default/20 shrink-0`}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes={imgSize}
          className='object-cover'
          priority
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center'>
          <FaUser
            size={icon}
            className='text-accent-default'
          />
        </div>
      )}
    </div>
  )
}
