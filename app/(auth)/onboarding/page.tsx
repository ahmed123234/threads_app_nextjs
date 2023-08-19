import { currentUser } from '@clerk/nextjs'

import { AccountProfile } from "@/components/forms"
import { getUser } from '@/lib/actions/user.actions';

type User = {
  username: string | null,
  name: string | null,
  bio: string | null,
  avatarUrl?: string | null;
}
const page = async () => {

  const user = await currentUser();

  if(!user) return null;
  // get the user from the database

  type User = {
    _id: string,
    bio: string,
    username: string,
    image: string,
    name: string
}

  const userInfo = await getUser(user?.username!) as User;  

  const userData =  {
    id: user?.id,
    objectId: userInfo?._id,
    username: user?.username || userInfo?.username ,
    name: userInfo?.name || user?.firstName + ' ' + user?.lastName || '',
    bio:  userInfo?.bio || "" ,
    image: userInfo?.image || user?.imageUrl
  }

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
        <h1 className='head-text'>Onboarding</h1>
    <p className='text-base-regular mt-3 text-light-2'>
        Complete your profile now to use Threads
    </p>

    <section className='mt-9 bg-dark-2 p-10'>
        {/* use the redefined functionlity given by clerk */}

        <AccountProfile user={userData} btnTitle='Continue'/>
    </section>
    </main>
  )
}

export default page