import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const ARTICLE_TYPES = {
    CREATE_ARTICLE: 'CREATE_ARTICLE',
    LOADING_ARTICLE: 'LOADING_ARTICLE',
    GET_ARTICLES: 'GET_ARTICLES',
    UPDATE_ARTICLE: 'UPDATE_ARTICLE',
    GET_ARTICLE: 'GET_ARTICLE',
    DELETE_ARTICLE: 'DELETE_ARTICLE'
}


export const createArticle = ({content, motive, auth, socket}) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('articles', { content,motive}, auth.token)
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })

    } catch (err) {
        
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getArticles = (token) => async (dispatch) => {
    try {
        dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: true })
        const res = await getDataAPI('articles', token)
        console.log('respones')
        console.log(res)
        console.log(res.data)
        dispatch({
            type: ARTICLE_TYPES.GET_ARTICLES,
            payload: {...res.data, page: 2}
        })
        
        dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: false })
    } catch (err) {
        console.log("article me error")
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

//         dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: res.data.newPost })

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
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newPost})

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
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newPost})

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
            dispatch({ type: ARTICLE_TYPES.GET_ARTICLE, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

export const deleteArticle = ({post, auth, socket}) => async (dispatch) => {
    dispatch({ type: ARTICLE_TYPES.DELETE_ARTICLE, payload: post })

    try {
        const res = await deleteDataAPI(`article/${post._id}`, auth.token)
        console.log(res)
        console.log(post)
        // Notify
        const msg = {
            id: post._id,
            text: 'delete a article.',
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