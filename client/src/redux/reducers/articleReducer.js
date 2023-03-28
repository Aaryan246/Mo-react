import { ARTICLE_TYPES } from '../actions/articleAction'
import { EditData, DeleteData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    article: [],
    result: 0,
    page: 2
}

const articleReducer = (state = initialState, action) => {
    
    switch (action.type){
        case ARTICLE_TYPES.CREATE_ARTICLE:
            return {
                ...state,
                article: [action.payload, ...state.articles]
            };
        case ARTICLE_TYPES.LOADING_ARTICLE:
            return {
                ...state,
                loading: action.payload
            };
        case ARTICLE_TYPES.GET_ARTICLES:
            console.log(action)
            return {
                ...state,
                
                article: action.payload.article,
                result: action.payload.result,
                page: action.payload.page
            };
        case ARTICLE_TYPES.UPDATE_ARTICLE:
            return {
                ...state,
                articles: EditData(state.article, action.payload._id, action.payload)
            };
        case ARTICLE_TYPES.DELETE_ARTICLE:
            return {
                ...state,
                articles: DeleteData(state.article, action.payload._id)
            };
        default:
            return state;
    }
}

export default articleReducer