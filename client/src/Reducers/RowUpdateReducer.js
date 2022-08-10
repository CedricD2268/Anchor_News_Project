import update from 'react-addons-update';

const RowUpdateReducer = (state = {RowAOne: '', RowATwo: '', RowAThree: '', RowAFour: ''}, action) => {
    switch (action.type){
        case 'ROW-UPDATE':
            return update(state, {$merge : action.payload});
        default:
            return state;
    }
}
export default RowUpdateReducer;