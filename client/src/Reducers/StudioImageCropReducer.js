import update from 'react-addons-update';

const StudioImageCropReducer = (state = {cropOne: null, cropTwo: null, cropThree: null}, action) => {
    switch (action.type) {
        case 'CROP-IMAGE':
            return update(state, {$merge : action.payload});
        default:
            return state;
    }
}
export default StudioImageCropReducer ;