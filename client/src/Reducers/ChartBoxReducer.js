import update from "react-addons-update";

const ChartBoxReducer = (state = {active: false, articleId: null, data:{}, delete: false}, action) => {
    switch (action.type){
        case 'VIEW-CHART':
            return update(state, {$merge : action.payload});
        default:
            return state;
    }
}
export default ChartBoxReducer ;