import { fetchUserById, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { log } from "console";
import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  // clerk will direct the user to the login page automaticly
  if(!user) return null;

  const userInfo  = await fetchUserById(user?.id);
  
  if(!userInfo?.onboarded) redirect('/onboarding');

  // get Activity or notifications 
      const data = await getActivity(userInfo._id);

      console.log("activities", data);
      
    return (
      <section>
        <h1 className="head-text mb-10">Activity</h1>
        <section className="mt-10 flex flex-col gap-5">
          {data.length > 0 ? (
            <>
              {data.map(activity => (
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image 
                      src={activity.author.image}
                      alt='user profile'
                      width={20}
                      height={20}
                      className=" object-cover rounded-full"
                    />
                    <p className="!text-base-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                  
                      </span>{" "}
                      replied to your thread
                    </p>
                  </article>
                </Link>
              ))}
            </>
          ): (
            <p className='!text-base-regular text-light-3'>No activity yet</p>
          ) }
        </section>
      </section>
    )
  }
  
  export default page