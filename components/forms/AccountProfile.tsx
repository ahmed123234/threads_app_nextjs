"use client";
// this will be used as a hook
import { useUploadThing } from "@/lib/uploadthing";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { usePathname, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";

import { Input } from '../ui/input'

import { zodResolver } from "@hookform/resolvers/zod"
import { userValidation } from "@/lib/validations/user";
import { Button } from "../ui/button";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user.actions";

type Props = {
  user?: {
    id: string;
    objcetId?: string | null;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle?: string
}
const AccountProfile = ({ user, btnTitle }: Props) => {

  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing("media")

  const form = useForm({
    // define a custom validation and pass it as a parameter the zod resolver 
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || ""
    }
  });

  console.log("the user info is", user);

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    console.log(values);
    // usualy the value of the image is called blob
    const blob = values.profile_photo

    // determine if the image has changed or not
    const hasImageChanged = isBase64Image(blob)
    if(hasImageChanged) {
      console.log("start uploading the image");
      
      const imgResponse = await startUpload(files)

      if(imgResponse && imgResponse[0].fileUrl) {
        // in react hook form u don't need to care about use state and setting the sate by the setter function insted u can muted the value directly 
        values.profile_photo = imgResponse[0].fileUrl;
      }
    }

    // TODO: update the user profile
    await updateUser({
      userId: user?.id!, 
      username: values.username , 
      name: values.name, 
      bio: values.bio, 
      image: values?.profile_photo!, 
      path: pathname
    })

    if(pathname === '/profile/edit') {
      router.back()
    } else {
      router.push('/')
    }

  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault()
    // fieldChange()

    
    const fileReader = new FileReader();

    if(e.target.files && e.target.files?.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if(!file.type.includes('image')) return;

      fileReader.readAsDataURL(file);

      fileReader.onload = async () => {
        const imageDataUrl = fileReader.result?.toString() || '';
        console.log("image is ", imageDataUrl);
        
        fieldChange(imageDataUrl);
      }

      
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo" // the name shall be the same as what is defined in the zod schema
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">

                {field.value ? (
                  <Image src={field.value} alt="profile_image"
                    width={96}
                    height={96}
                    priority // add a priority for loading the image  
                    className="rounded-full object-contain" />
                ) : (
                  <Image src='/assets/profile.svg'
                    alt="profile_image"
                    width={24}
                    height={24}
                    priority // add a priority for loading the image  
                    className="object-contain" />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className=" text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  placeholder='Add name'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className=" text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  placeholder='Add username'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className=" text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={10}
                  placeholder='Add a bio'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className=" hover:bg-primary-500">{btnTitle}</Button>
      </form>
    </Form>
  )
}

export default AccountProfile