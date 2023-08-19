"use client";
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import classname from 'classnames'

const SidebarLinks = ({ bottombarType }: { bottombarType?: boolean }) => {
    const pathname = usePathname();
    const { userId } = useAuth()
    
  return (
    <>
        {sidebarLinks.map((link) => {
          const { route, label, imgURL } = link
          if (route === '/profile') {
            // route = ;
            // console.log("route now is", route);
            
          }

          const isActive = (pathname.includes(route) && route.length > 1) || pathname === route;
          return (
          <Link href={link.route === '/profile'? `/profile/${userId}`: link.route}
            key={link.label}
            className={classname({
              'bg-primary-500': isActive,
              'bottombar_link': bottombarType,
              'leftsidebar_link': !bottombarType
            })}
          >
            <Image src={imgURL} alt={label} width={24} height={24} />

            <p className={classname("text-light-1", {
              "max-lg:hidden": !bottombarType,
              "text-subtle-medium max-sm:hidden": bottombarType
            })}>
              {/* select the first word or all of the sentence */}
              { bottombarType? label.split(/\s+/)[0]: label}
              
              </p>
          </Link>
        )})}
    </>
  )
}

export default SidebarLinks