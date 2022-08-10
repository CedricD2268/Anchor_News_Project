import update from 'react-addons-update';

const GetTinyBodyReducer = (state = {BodyOne: '', BodyTwo: ''}, action) => {
    switch (action.type) {
        case 'GET-BODY':
            return update(state, {$merge : action.payload});
        default:
            return state;
    }
}
export default GetTinyBodyReducer;