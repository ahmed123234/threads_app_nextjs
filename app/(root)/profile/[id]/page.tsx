import { ProfileHeader, ThreadsTab } from "@/components/shared";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUserById } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async ({params: { id }}: {params: { id: string }}) => {

  const user = await currentUser();

  // clerk will direct the user to the login page automaticly
  if(!user) return null;

  const userInfo  = await fetchUserById(id);
  console.log("userInformation are", userInfo );
  

  if(!userInfo?.onboarded) redirect('/onboarding');


    return (
      <section>
        <ProfileHeader 
          accountId={userInfo.id}
          authUserId={user?.id}
          name={userInfo?.name}
          username={userInfo.username}
          bio={userInfo.bio}
          imgUrl={userInfo.image}
        />

        <div className="mt-9">
            {/* tabs comes from shadcn */}
            <Tabs defaultValue="Threads" className="w-full">
              <TabsList className="tab">
                {profileTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    <Image 
                      src={tab.icon}
                      alt="icon"
                      width={24}
                      height={24}
                      className=" object-contain"
                    />
                    <p className="max-sm:hidden ">{tab.label}</p>

                    {tab.label === 'Threads' && (
                      <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                        {userInfo.threads.length}
                      </p>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {profileTabs.map(tab => (
                <TabsContent
                  key={`content-${tab.label}`}
                  value={tab.value}
                  className="w-full text-light-1"
                >
                  <ThreadsTab 
                    currentUserId={user?.id}
                    accountId={userInfo.id}
                    accountType='User'
                  />
                </TabsContent>  
              ))}
              
            </Tabs>
        </div>
      </section>
    )
  }
  
  export default page