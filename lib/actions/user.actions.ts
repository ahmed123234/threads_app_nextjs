"use server";
import User from '@/lib/models/user.model'

import { connectToDB } from "../mongoose";
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { FilterQuery, SortOrder } from 'mongoose';

type UserInfo = {
    userId: string, 
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string 
}

export const updateUser = async ( userInfo: UserInfo ): Promise<void> => {
    
    const {
        userId, 
        username,
        name,
        bio,
        image,
        path 
    } = userInfo;
    try {

        connectToDB();
       const user =  await User.findOneAndUpdate({ id: userId }, {
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true
    
        }, { upsert: true });
        //upsert: used for update and insert 
        
        console.log("updated user is: ", user);
        
        if(path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch(err: any) {
        throw new Error(`Failed to create/update user: ${err.message}`)
    }
}

type User = {
    _id: string,
    bio: string,
    username: string,
    image: string,
    name: string
}

export const getUser = async(username: string): Promise<any> => {
    try {
        connectToDB();
        return await User.findOne({ username })
        // .populate({
        //     path: 'communities',
        //     model: 'Community'
        // });
    } catch(err: any) {
        console.log(err.message);
        throw new Error(`Faild to fetch user: ${err.message}`)
        
    }
}


export const fetchUserById = async (userId: string) => {
    try {
        connectToDB();
        return await User.findOne({ id: userId })
        // .populate({
        //     path: 'communities',
        //     model: 'Community'
        // });
    } catch(err: any) {
        console.log(err.message);
        throw new Error(`Faild to fetch user: ${err.message}`)
        
    }
}

// TODO: Populate community
export const fetchUserThreads = async (userId: string) => {
    try{

        connectToDB();
        // Find all the threads authored by user with the given userId 
        const userThreads = await User.findOne({ id: userId })
        .populate({
            path: 'threads',
            model: Thread,
            populate:{
                path:'children',
                model: Thread,
                populate: {
                    path:"author",
                    model: User,
                    select: "image name id"
                } 
            }
        
        }) 

        return userThreads;

    } catch(err: any) {
        throw new Error(`Error fetching user posts: ${err.message}`)
    }
} 

export const fetchUsers = async ({ userId, serachTerm='', pageNumber=1, pageSize=20, sortBy='desc' }: {
    serachTerm?: string,
    pageNumber?: number,
    pageSize?: number,
    userId: string,
    sortBy?: SortOrder
}) => {
    try {
        connectToDB();

        const skipAmmount = (pageNumber - 1) * pageSize;
        // make the search case insensitive 
        const regex = new RegExp(serachTerm, 'i');

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        };

        if (serachTerm.trim() !== '') {
            query.$or = [
                {'name': {$regex : regex}},
                {'username': {$regex : regex}}
            ]
        }

        const sortOptions = {
            'createdAt': sortBy
        }

        const usersQuery = User.find(query).skip(skipAmmount).sort(sortOptions).limit(pageSize);
        
        const totalUsersCount = await User.countDocuments(query);
        
        const users = await usersQuery.exec();
        // check if there are next pages or not
        const isNext = totalUsersCount > users.length + skipAmmount;
        return { users, isNext };
    } catch(err: any) {
        throw new Error(`Error fetching users: ${err.message}`)
    }
}

export const getActivity = async (userId: string) => {
    try {
        connectToDB();

        // find all threads created by the user
        const userThreads = await Thread.find({ author: userId })
        // .select('threads').populate({
        //     path: 'threads',
        //     model: Thread,
        //     select: 'children'
        // });
        // console.log("all threads", userThreads);
        

        // collect all the child thread ids (replies) from the 'children' field
        const childThreadIds = userThreads.reduce((acc, { children }) => {
            return acc.concat(children)
        }, [])

        const replies = await Thread.find({
            _id: {$in: childThreadIds},
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: "name image id"
        })
        return replies;
        

    }catch(err: any) {
        throw new Error(`Faild to fecth Activity: ${err.message}`);
    }
}