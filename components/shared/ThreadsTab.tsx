import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { ThreadCard } from "../cards";
import { auth } from "@clerk/nextjs";

type Props = {
  currentUserId: string;
  accountId: string;
  accountType: "User" | "Community" 
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props ) => {
  // TODO: Fetch profile threads
  const data = await fetchUserThreads(accountId);

  if(!data) redirect('/')

  console.log("threads: ", data.threads);
  
  return (
    <section className="flex flex-col gap-10 mt-9">
      {data.threads.map((thread: any) => { 
        const { _id, parentId, text, author, community, createdAt, children } = thread;
        return (
        <ThreadCard 
          key={_id}
          id={_id}
          currentUserId={currentUserId}
          parentId={parentId}
          content={text}
          author={
            accountType === 'User'? { name: data.name, image: data.image, id: data.id }: 
            { name: thread.author.name, 
              image: thread.author.image, 
              id: thread.author.id
            } 
          }
          community={community}
          createdAt={createdAt}
          comments={children}
          // isComment={true}
        />  
        )
    })}
    </section>
  )
}

export default ThreadsTab