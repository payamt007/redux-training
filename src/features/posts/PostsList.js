import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { TimeAgo } from './TimeAgo'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
//import { selectAllPosts, fetchPosts } from './postsSlice'
import { Spinner } from '../../components/Spinner'
import { selectAllPosts, fetchPosts, selectPostIds, selectPostById } from './postsSlice'

const PostExcerpt = ({ /* post */postId }) => {
    const post = useSelector(state => selectPostById(state, postId))

    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}

export const PostsList = () => {
    //const posts = useSelector(state => state.posts)
    const posts = useSelector(selectAllPosts)
    const orderedPostIds = useSelector(selectPostIds)
    //const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    const dispatch = useDispatch()
    const error = useSelector(state => state.posts.error)

    const postStatus = useSelector(state => state.posts.status)

    useEffect(() => {
        if (postStatus === 'idle') {
            console.log('call to api')
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    /* const renderedPosts = orderedPosts.map(post => {
        return (
            <article className="post-excerpt" key={post.id}>
                <h3>{post.title}</h3>
                <div>
                    <PostAuthor userId={post.user} />
                    <TimeAgo timestamp={post.date} />
                </div>
                <p className="post-content">{post.content.substring(0, 100)}</p>
                <ReactionButtons post={post} />
                <Link to={`/posts/${post.id}`} className="button muted-button">
                    View Post
                </Link>
            </article>
        )
    }) */

    let content

    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />
    } else if (postStatus === 'succeeded') {
        // Sort posts in reverse chronological order by datetime string
        /* const orderedPosts = posts
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date)) */

        /* content = orderedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
        )) */
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
          ))
      
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {/* {renderedPosts} */}
            {postStatus}
            {content}
        </section>
    )
}