import { ThreadCard } from "@/components/cards"
import { Comment } from "@/components/forms";
import { fetchThread } from "@/lib/actions/thread.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

const page = async ({ params: { id }}: { params: { id: string }}) => {

    if(!id) return null;
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await getUser(user?.username!);

    console.log("user info", userInfo);
    
    
    if(!userInfo.onboarded) redirect('/onboarding');

    const data = await fetchThread(id);
    

    if(!data) return null;
    const { _id, text, author, community, createdAt, children, parentId } = data;
  return (
    <section className="relative">
        <div >
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
        </div>

        <div className="mt-7">
            <Comment 
              threadId={id}
              currentUserId={userInfo?._id}
              currentUserImg={userInfo?.image}
            />
        </div>

        <div className="mt-10">
          {children.map((child: any ) => {
            const { _id, parentId, text, author, community, createdAt, children } = child;
            return (
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
              isComment={true}
            />
            )
          })}
        </div>

    </section>
  )
}

export default page