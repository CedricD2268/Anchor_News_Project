import update from 'react-addons-update';

const SearchQueryReducer = (state = {searchOne: '', searchTwo: '', searchThree: ''}, action) => {
    switch (action.type){
        case 'SEARCH-QUERY':
            return update(state, {$merge : action.payload});
        default:
            return state;
    }
}
export default SearchQueryReducer;