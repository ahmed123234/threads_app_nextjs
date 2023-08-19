'use client';
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Textarea,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage, //detect the error messages that appers when something goes wrong
  FormLabel
} from '@/components/ui'
import { usePathname, useRouter } from "next/navigation";
import { threadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";


const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: '',
      accountId: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof threadValidation >) => {
    await createThread({ 
      text: values?.thread, 
      author: userId, 
      community: null, 
      path: pathname 
    });

    router.push('/');
  }
  return (

    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 mt-8"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className=" text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className=" no-focus border border-dark-4 bg-dark-3 text-light-1">

                <Textarea
                  rows={15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className=" hover:bg-primary-500">Post Thread</Button>

      </form>
    </Form>

  )
}

export default PostThread