'use client'
import { searchValidation } from "@/lib/validations/search"
import { userValidation } from "@/lib/validations/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormControl, FormDescription, Input, Button, FormItem, FormLabel } from "../ui"
import Image from "next/image"
import * as z from 'zod'

const SearchBar = () => {

    const form = useForm({
        resolver: zodResolver(searchValidation),
        defaultValues: {
            searchTerm: ''
        }
    })

    const handleChange = () => {

    }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-md  py-1 px-8 border-gray-400 bg-dark-2"
      >
        <FormField
          control={form.control}
          name="searchTerm"
          render={({ field }) => (
            <FormItem className="flex w-full bg-transparent items-center justify-center">
              <Image  src='/assets/search.svg' alt="search" width={20} height={20}/>
              <FormControl className=" ">
                <Input 
                    // onChange={ () => handleChange()}
                    // value={searchTerm}
                  placeholder="Search For User..."
                  type="text"
                  className="no-focus text-light-1 outline-none border-none bg-transparent flex-1"
                  {...field}
                />
    
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        {/* <Button type="submit" className="comment-form_btn">Reply</Button> */}

      </form>
    </Form>
  )
}

export default SearchBar