import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
// import { SignedInCheck } from ".."
import { dark } from '@clerk/themes'
import SignedInCheck from "./SignedInCheck"

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href='/' className="flex items-center gap-4">
        <Image 
          src='/logo.svg'
          alt="logo"
          width={28}
          height={28}
        />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedInCheck />
        </div>
        
        {/* make you able to create an organization and manage all of them */}
        <OrganizationSwitcher 
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: 'py-2 px-4'
            }
          }}
        />
      </div>
    </nav>
  )
}

export default Topbar