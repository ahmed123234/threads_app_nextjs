import Image from "next/image";
import Link from "next/link";
import className from 'classnames'

type SubProps = {
  name: string;
  image: string;
  id: string;
}
type Props = {
  id: string;
  parentId: string | null;
  community: SubProps | null;
  createdAt: string;
  content: string;
  author: SubProps;
  comments: {
    author: {
      image: string;
    }
  }[];
  currentUserId: string;
  isComment?: boolean
}

const ThreadCard = ({ id, parentId, community, createdAt, content, author, comments, currentUserId, isComment }: Props) => {
  return (
    // html semantic tag usualy yused for card
    <article className={className("felx w-full flex-col rounded-xl", {
      'px-0 xs:px-7 mb-2': isComment,
      'bg-dark-2 p-7': !isComment
    })}>
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-start">
            <Link
              href={`/profile/${author.id}`}
              className="relative h-11 w-11 mb-3"
            >
              <Image
                src={author.image}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            {/* <div className="thread-card_bar"></div> */}
          </div>

          <div className="flex flex-col w-full">
            <Link
              href={`/profile/${author.id}`}
              className="w-fit"
            >
              <h4 className=" cursor-pointer text-base-semibold text-light-1">{author.name}</h4>

            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={className("mt-5 flex flex-col gap-3", {
              'mb-10': isComment
            })}>
              <div className="flex gap-3.5">
                <Image
                  src='/assets/heart-gray.svg'
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />

                <Link href={`/thread/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>


                <Image
                  src='/assets/repost.svg'
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />

                <Image
                  src='/assets/share.svg'
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link
                  href={`/thread/${id}`}
                >
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

    </article>
  )
}

export default ThreadCard