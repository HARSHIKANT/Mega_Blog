import React,{useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Button,Input,Select,RTE} from '../index'
import appwriteService from '../../appwrite/conf'
import { useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'


function PostForm({post}) {
    const {register,handleSubmit,watch,setValue,control,getValues} = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    })
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)

    const submit = async (data) => {
    console.log("Form submitted:", data);
    console.log("Raw image field:", data.image);
    console.log("First file:", data.image?.[0]);
    if (data.slug.length > 36 || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(data.slug)) {
        alert("Invalid slug! Must be ≤ 36 chars and only letters, numbers, ., -, _ (no special char at start)");
        return;
      }

    if (post) {
        let fileId = post.featuredImage; // keep old one by default

        // Upload new file if provided
        if (data.image && data.image[0]) {
            console.log("Uploading file:", data.image[0]);
            const file = await appwriteService.uploadFile(data.image[0]);
            console.log("Uploaded file response:", file);
            if (file) {
                // delete old file if existed
                if (post.featuredImage) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                fileId = file.$id;
            }
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
            title: data.title,
            slug: data.slug,
            content: data.content,
            status: data.status,
            featuredImage: fileId, // always a string
        });

        if (dbPost) {
            console.log("Final fileId before saving:", fileId);
            await new Promise(r => setTimeout(r, 500)); // artificial delay
            navigate(`/post/${dbPost.$id}`);
        }
    } else {
        // new post
        let fileId = null;
    
        if (data.image && data.image[0]) {
            console.log("About to upload file:", data.image[0]); // 👈 add this
            const file = await appwriteService.uploadFile(data.image[0]);
            console.log("Upload finished, response:", file); // 👈 add this
            if (file) {
                fileId = file.$id;
            }
        }
    
        console.log("Final fileId before saving post:", fileId); // 👈 add this
    
        const dbPost = await appwriteService.createPost({
            title: data.title,
            slug: data.slug,
            content: data.content,
            status: data.status,
            featuredImage: fileId,   // save only the ID
            userId: userData.$id,
        });
    
        console.log("Created post:", dbPost); // 👈 add this
    
        if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
        }
    }
};
    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string') {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '-')
                .replace(/\s+/g, '-')
        }
        return '';
    },[])

    React.useEffect(() => {
        const subscription = watch((value,{name}) => {
            if(name === 'title') {
                setValue('slug', slugTransform(value.title, {shouldValidate: true}));
            }
        })
        return () => {
            subscription.unsubscribe();
        }
    }
    , [watch, setValue, slugTransform]);

  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
        <div className='w-2/3 px-2'>
            <Input
                label='Title:'
                placeholder='Title'
                className='mb-4'
                {...register('title', { required: true })}
            />
            <Input
                label='Slug:'
                placeholder='Slug'
                className='mb-4'
                {...register('slug', { required: true })}
                onInput = {(e)=>{
                    setValue('slug', slugTransform(e.currentTarget.value), {shouldValidate: true});
                }}
            />
            <RTE
                label='Content:'
                name='content'
                control={control}
                defaultValue = {getValues('content')} 
            />
        </div>
        <div className='w-1/3 px-2'>
            <Input
                label='Featured Image:'
                type='file'
                className='mb-4'
                accept='image/png, image/jpeg, image/jpg, image/gif'
                {...register('image',{required: !post})}
            />
            {post && (
                <div className='w-full mb-4'>
                    
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className='rounded-lg'
                    />
                </div>
            )}
            <Select
                options={['active', 'draft']}
                label='Status'
                className='mb-4'
                {...register('status', { required: true })}
            />
            <Button type='submit' bgColor = {post ? "bg-green-500" : undefined} className='w-full mt-4'>
                {post ? 'Update' : 'Submit'}
            </Button>
        </div>
    </form>

  )
}

export default PostForm