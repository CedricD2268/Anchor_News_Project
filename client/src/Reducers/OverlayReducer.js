import update from 'react-addons-update';

const Overlay = (state = {
    sidebarTwo: false,
    sidebarThree: false,
    sidebarFour: false,
    sidebarCreate: {ov: false, title: '', listState: false, buttonName: 'Create', collectionName: ''},
    sidebarFollowListRender: false,
    share: {ov: false},
    support: {ov: false},
    removeAccount: {ov: false}
}, action) => {
    switch (action.type) {
        case 'OVERLAY-VALUE':
            return update(state, {$merge : action.payload});
        default:
            return state;
    }
}
export default Overlay;