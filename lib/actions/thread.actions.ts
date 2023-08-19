'use server'
import { revalidatePath } from "next/cache";
import Thread  from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { log } from "console";

interface Params{
    text: string,
    author: string,
    community: string | null,
    path: string
}

export const createThread = async ({text, author, community, path} : Params ) => {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community,

        });

        // update the user model
        await User.findByIdAndUpdate({ _id: author }, {
            $push: { threads: createdThread._id }
        })
        // to insure that the changes are happen imedietly on our nextjs 13 website
        revalidatePath(path);
    }catch(err: any) {
        console.log(err);  
        throw new Error(`Error creating thread ${err.message}`)
    }
}

export const fetchThreads = async (pageNumber=1, pageSize=20) => {
    try {
        connectToDB();

        // Calculate the number of pages you want to skip according to the page number
        let offset = ((Number)(pageSize * Number((pageNumber - 1)))) || 0;

        // Fetch the posts that have no parents (Top Level Threads)
        const threadsQuery = Thread.find({ parentId: { $in: [ null, undefined ] }})
        .sort({ createdAt: 1 }).skip(offset).limit(pageSize)
        .populate({ path: "author", model: User })
        .populate({ 
            path: 'children', 
            populate: {
                path: 'author',
                model: User,
                select:'_id name parentId image'
            }
        })

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}});
        const posts = await threadsQuery.exec();
        const isNext = totalPostsCount > posts.length + offset;
        return { posts, isNext }
    } catch(err: any) {
        console.log(err);
        throw new Error(`Error Fetching threads: ${err.message}`)
    }
}


export const fetchThread = async (id: string) => {
    try {
        connectToDB();

        // Fetch the posts that have no parents (Top Level Threads)
        const threadQuery = Thread.findById(id)
        .populate({ path: "author", model: User, select: "_id id name image" })
        .populate({ 
            path: 'children', 
            populate: [
                {
                    path: 'author',
                    model: User,
                    select:'_id name parentId image'
                }, 
                {
                    path: "children",
                    model: 'Thread',
                    populate: {
                        path: "author",
                        model: 'User',
                        select: '_id name parentId image'
                    }
                }
            ]
        })

        const post = await threadQuery.exec();
        return post;
    } catch(err: any) {
        console.log(err);
        throw new Error(`Error Fetching thread: ${err.message}`)
    }
}

interface CommentParams {
    threadId: string,
    author: string,
    path: string, 
    commentText: string
}

export const addCommentToThread = async ({ threadId, author, path, commentText }: CommentParams) => {

    try {
        connectToDB();
        // adding a comment
        // Find the original thread by id
        const originalThread = await Thread.findById(threadId);
        
        if(!originalThread){
            throw new Error('No such thread found');
        }

        // create new thraed with comment text
        const commentThread = new Thread({
            text: commentText,
            author,
            parentId: threadId
        })

        // save the newly created thraed in DB
        const savedCommentThraed = await commentThread.save();

        // update the original thread to include the comment thread
        originalThread.children.push(savedCommentThraed._id);
        // save the original thread after updating
        await originalThread.save();

        revalidatePath(path);

    } catch(err: any) {
        throw new Error(`Error adding comment to the given thread: ${err.message}`)
    }
}