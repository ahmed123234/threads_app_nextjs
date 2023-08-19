import { PostThread } from "@/components/forms";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const Page = async () => {
    const user = await currentUser();

    // clerk will direct the user to the login page automaticly
    if(!user) return null;
    const userInfo  = await getUser(user?.username!);
  
    if(!userInfo?.onboarded) redirect('/onboarding');
  

    return (
      <>
        <h1 className="head-text">Create Thread</h1>
        <PostThread userId={userInfo?._id}/>
      </>
    )
  }
  
  export default Page