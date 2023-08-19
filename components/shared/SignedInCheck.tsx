"use client";
import { SignedIn, SignOutButton } from "@clerk/nextjs"
import Image  from 'next/image'
import { useRouter } from "next/navigation";
const SignedInCheck = ({ position }: { position?: string }) => {
  const router = useRouter();
  return (
    <>
        {/* if the user is signned in (session is not null) */}
    <SignedIn>
    {/* if you are signedin then every thing wrapped insude it will be rendered on the browser */}
    <SignOutButton 
      signOutCallback={() =>  {position && router.push('/sign-in')}}
    >
      <div className={`flex cursor-pointer ${position && 'gap-4 p-4'}`}>
        <Image src='/assets/logout.svg' 
          alt="logout"
          width={24}
          height={24}
        />
        {position && <p className="text-light-2 max-lg:hidden">
          Logout
        </p>}
      </div>
    </SignOutButton>
  </SignedIn>   
    </>
  )
}

export default SignedInCheck