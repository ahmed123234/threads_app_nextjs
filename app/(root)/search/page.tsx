import { UserCard } from "@/components/cards";
import { ProfileHeader, SearchBar, ThreadsTab } from "@/components/shared";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUserById, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  // clerk will direct the user to the login page automaticly
  if(!user) return null;

  const userInfo  = await fetchUserById(user?.id);
  
  if(!userInfo?.onboarded) redirect('/onboarding');

  // fetch users
  const data = await fetchUsers({ 
    userId: user?.id,
    serachTerm: '',
    // sortBy: 's',
    pageNumber: 1,
    pageSize: 25
  
  });

  console.log("users are ", data.users);
  
  return (
    <section>
      <SearchBar />

      <section className="mt-14 flex flex-col gap-9">
      {data.users.length === 0? (
        <p className="no-result">No users</p>
      ): (
        data.users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            name={user.name}
            username={user.username}
            imgUrl={user.image}
            userType='User'
          />
          ))
      )}
      </section>
    </section>
  )
}

export default page