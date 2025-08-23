import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/conf'

function AllPosts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
          if (posts) {
            setPosts(posts.documents);
      
            if (posts.documents[0]?.featuredImage) {
              const url = appwriteService.getFilePreview(posts.documents[0].featuredImage);
            } else {
              console.log("No featuredImage in first post");
            }
          }
        });
      }, []);
    
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.$id} className='w-1/4 p-2'>
                        <PostCard
                            $id={post.$id}
                            title={post.title}
                            featuredImage={post.featuredImage}
                        />
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts