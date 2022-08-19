
const CloneLogin = async() =>{
    try {
        const res = await fetch('https://njanchor.com/auth/clone_login', {
            method: "GET",
            credentials: 'include',
        });
        const parseRes = await res.json()
        return(parseRes.token)
    }catch (err) {
        console.error(err.message)
    }
}
export default CloneLogin