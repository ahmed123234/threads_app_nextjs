"use client"
import { useForm } from "react-hook-form";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "../ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidation } from "@/lib/validations/thread";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

type Props = {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
} 

const Comment = ({ threadId, currentUserId, currentUserImg }: Props) => {

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
     thread: "",
     accountId: ""

    }
  })

  const onSubmit = async (values: z.infer<typeof commentValidation>)=> {
    // comment is also a thread
    // 
    // console.log(values);
   await addCommentToThread({
    threadId,
    author: currentUserId,
    commentText: values.thread,
    path: pathname,
   });

  //  reset the form to be able to add another comment 
    form.reset()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <Image src={currentUserImg} alt="profile image" width={48} height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className=" bg-transparent border-none">
                <Input 
                  placeholder="Comment..."
                  type="text"
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
    
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">Reply</Button>

      </form>
    </Form>
  )
}

export default Comment