import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const POST_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}


export const createArticle = ({content, motive,images, auth, socket}) => async (dispatch) => {
    let media = []
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        // if(images.length > 0) media = await imageUpload(images)

        const res = await postDataAPI('article', { content,motive}, auth.token)

        dispatch({ 
            type: POST_TYPES.CREATE_POST, 
            payload: {...res.data.newPost, user: auth.user} 
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })

        // Notify
        const msg = {
            id: res.data.newPost._id,
            text: 'added a new article.',
            recipients: res.data.newPost.user.followers,
            url: `/article/${res.data.newPost._id}`,
            content
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getArticles = (token) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
        const res = await getDataAPI('articles', token)
        
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// export const updatePost = ({content,motive, images, auth, status}) => async (dispatch) => {
//     let media = []
//     const imgNewUrl = images.filter(img => !img.url)
//     const imgOldUrl = images.filter(img => img.url)

//     if(status.content === content 
//         && status.motive === motive
//         && imgNewUrl.length === 0
//         && imgOldUrl.length === status.images.length
//     ) return;

//     try {
//         dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
//         if(imgNewUrl.length > 0) media = await imageUpload(imgNewUrl)

//         const res = await patchDataAPI(`post/${status._id}`, { 
//             content,motive, images: [...imgOldUrl, ...media] 
//         }, auth.token)

//         dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost })

//         dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })
//     } catch (err) {
//         dispatch({
//             type: GLOBALTYPES.ALERT,
//             payload: {error: err.response.data.msg}
//         })
//     }
// }

export const likeArticle = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, auth.user]}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('likePost', newPost)

    try {
        await patchDataAPI(`article/${post._id}/like`, null, auth.token)
        
        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your article.',
            recipients: [post.user._id],
            url: `/article/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unLikeArticle = ({post, auth, socket}) => async (dispatch) => {
    const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('unLikePost', newPost)

    try {
        await patchDataAPI(`article/${post._id}/unlike`, null, auth.token)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'like your article.',
            recipients: [post.user._id],
            url: `/article/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getArticle = ({detailPost, id, auth}) => async (dispatch) => {
    if(detailPost.every(post => post._id !== id)){
        try {
            const res = await getDataAPI(`article/${id}`, auth.token)
            dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

export const deleteArticle = ({post, auth, socket}) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post })

    try {
        const res = await deleteDataAPI(`article/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'added a new article.',
            recipients: res.data.newPost.user.followers,
            url: `/article/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// export const savePost = ({post, auth}) => async (dispatch) => {
//     const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
//     dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

//     try {
//         await patchDataAPI(`savePost/${post._id}`, null, auth.token)
//     } catch (err) {
//         dispatch({
//             type: GLOBALTYPES.ALERT,
//             payload: {error: err.response.data.msg}
//         })
//     }
// }

// export const unSavePost = ({post, auth}) => async (dispatch) => {
//     const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
//     dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

//     try {
//         await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
//     } catch (err) {
//         dispatch({
//             type: GLOBALTYPES.ALERT,
//             payload: {error: err.response.data.msg}
//         })
//     }
// }