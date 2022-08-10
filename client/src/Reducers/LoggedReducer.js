const accountsPath = [
    '/accounts/login',
    '/accounts/register',
    '/accounts/login/identify',
    '/accounts/login/reset',
]

const LoggedReducer = (state = !(accountsPath.includes(window.location.pathname) || accountsPath.includes(window.location.pathname.slice(0, 21))), action) => {
    switch (action.type) {
        case 'LOGIN':
            return true;
        case 'LOGOUT':
            return false;
        default:
            return state;
    }
}
export default LoggedReducer;