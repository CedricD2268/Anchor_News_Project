const MediaLoginErrorReducer = (state = '', action) => {
    switch (action.type){
        case 'MEDIA-ERROR':
            return action.payload;
        default:
            return state;
    }
}
export default MediaLoginErrorReducer;