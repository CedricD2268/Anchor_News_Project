import update from "react-addons-update";

const GetProfileReducer = (state = {
    weatherSubmit: false,
    collection: [],
    profileImageError: false
}, action) => {
    switch (action.type){
        case 'VIEW-PROFILE':
            return update(state, {$merge : action.payload});
        default:
            return state;
    }
}
export default GetProfileReducer ;