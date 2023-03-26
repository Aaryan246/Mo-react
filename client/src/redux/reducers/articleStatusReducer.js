import { GLOBALTYPES } from '../actions/globalTypes'


const articlestatus = (state = false, action) => {
    switch (action.type){
        case GLOBALTYPES.ARTICLESTATUS:
            return action.payload;
        default:
            return state;
    }
}


export default articlestatus