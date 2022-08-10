export const LoginRx = () =>{
    return {
        type: 'LOGIN'
    };
}
export const LogoutRx = () =>{
    return {
        type: 'LOGOUT'
    };
}

export const MediaLoginErrorRx = (arr) =>{
    return {
        type: 'MEDIA-ERROR',
        payload: arr
    };
}

export const ViewProfileRx = (arr) =>{
    return {
        type: 'VIEW-PROFILE',
        payload: {...arr }
    };
}

export const CropImageRx = (obj) =>{
    return {
        type: 'CROP-IMAGE',
        payload: obj
    };
}

export const GetBodyRx = (obj) =>{
    return {
        type: 'GET-BODY',
        payload: obj
    };
}

export const GetOverlayRx = (obj) =>{
    return {
        type: 'OVERLAY-VALUE',
        payload: obj
    };
}

export const GetSearchRx = (obj) =>{
    return {
        type: 'SEARCH-QUERY',
        payload: obj
    };
}


export const GetBoxChart = (obj) =>{
    return {
        type: 'VIEW-CHART',
        payload: obj
    };
}

export const GetRowUpdateRx = (obj) =>{
    return {
        type: 'ROW-UPDATE',
        payload: obj
    };
}
