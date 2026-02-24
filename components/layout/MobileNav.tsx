'use client'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { CiMenuFries } from 'react-icons/ci'
import { links } from '@/constants/navLinks'

type NavProps = { scrolled: boolean }

const MobileNav = ({ scrolled }: NavProps) => {
  const pathname: string = usePathname()
  return (
    <div className='container mx-auto px-2 xl:px-0'>
      <Sheet>
        <SheetTitle className='sr-only'></SheetTitle>
        <SheetTrigger className='flex justify-center items-center'>
          <CiMenuFries
            aria-label='Open navigation menu'
            className={`text-[32px] hover:cursor-pointer transition-all${
              scrolled
                ? 'text-primary/80 hover:text-accent-default '
                : 'text-accent-default hover:text-accent-hover'
            }`}
          />
        </SheetTrigger>

        <SheetContent className='flex flex-col '>
          {/*Logo*/}
          <div className='mt-30 mb-40 text-center text-2xl'>
            <Link href='/'>
              <h1 className='font-semibold text-4xl xl:px-0 px-2'>
                Anh
                <span className='text-accent-default'>
                  .
                </span>
              </h1>
            </Link>
          </div>

          {/*nav*/}
          <nav className='flex flex-col justify-center items-center gap-8'>
            {links.map((link, index) => {
              return (
                <SheetClose asChild key={index}>
                  <Link
                    href={link.path}
                    className={`${
                      link.path === pathname &&
                      'text-accent-default border-b-2 border-accent-default'
                    } text-xl capitalize hover:text-accent-hover transition-all`}
                  >
                    {link.name}
                  </Link>
                </SheetClose>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
