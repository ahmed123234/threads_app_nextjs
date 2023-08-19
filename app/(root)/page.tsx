//app/page.tsx
import { ThreadCard } from "@/components/cards";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { UserButton, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchThreads(1, 30);
  console.log("result ", result);
  const user = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {
        result.posts.length === 0? (
          <p className="no-result"> No threads found</p>
        ):
          result.posts.map((post) => {
            // @ts-ignore
              const { 
                _id,
                parentId,
                community,
                createdAt,
                text,
                author,
                children
              } = post
             return(
              <ThreadCard 
                key={_id}
                id={_id}
                currentUserId={user?.id!}
                parentId={parentId}
                content={text}
                author={author}
                community={community}
                createdAt={createdAt}
                comments={children}
              />
            )
            })
        }
      </section>
      {/* <UserButton afterSignOutUrl="/"/> */}
    </>
  )
}