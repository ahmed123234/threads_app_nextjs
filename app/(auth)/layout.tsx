import { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
// import Inter font from google fonts
import { Inter } from "next/font/google"
import '../globals.css'
 
const metadata: Metadata =  {
    title: "Threads",
    description: "A Next.js 13 Meta Threads Application",
}

const inter = Inter({ subsets: ['latin'] })

export default function AuthLayout({ 
    children
 }: { 
    children: React.ReactNode}
) {
    return(
        /**
         *   to  be able to use all of the clerck fanctionality you have 
         *   to wrap every single thing with the clerkProvoder
         * */
 
        <ClerkProvider >
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                   <div className="flex items-center justify-center w-full min-h-screen">
                    {children}
                   </div>
                </body>
            </html>
        </ClerkProvider>
    )
    
}