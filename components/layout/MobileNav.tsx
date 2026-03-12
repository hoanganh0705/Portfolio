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
import { useLocale } from '@/lib/locale-context'

type NavProps = { scrolled: boolean }

const MobileNav = ({ scrolled }: NavProps) => {
  const pathname: string = usePathname()
  const { locale, dict } = useLocale()

  const links = [
    { name: dict.nav.home, path: `/${locale}` },
    { name: dict.nav.resume, path: `/${locale}/resume` },
    { name: dict.nav.work, path: `/${locale}/work` },
    { name: dict.nav.blog, path: `/${locale}/blog` },
    {
      name: dict.nav.contact,
      path: `/${locale}/contact`,
    },
  ]

  return (
    <div className='container mx-auto px-2 xl:px-0'>
      <Sheet>
        <SheetTitle className='sr-only'>Navigation menu</SheetTitle>
        <SheetTrigger className='flex justify-center items-center'>
          <CiMenuFries
            aria-label='Open navigation menu'
            className={`text-[32px] hover:cursor-pointer transition-all ${
              scrolled
                ? 'text-primary/80 hover:text-accent-default '
                : 'text-accent-default hover:text-accent-hover'
            }`}
          />
        </SheetTrigger>

        <SheetContent className='flex flex-col '>
          {/*Logo*/}
          <div className='mt-30 mb-40 text-center text-2xl'>
            <Link href={`/${locale}`}>
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
            {links.map((link) => {
              return (
                <SheetClose asChild key={link.path}>
                  <Link
                    href={link.path}
                    className={`${
                      (link.path === pathname ||
                        (link.path === `/${locale}` &&
                          pathname === `/${locale}/`)) &&
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
