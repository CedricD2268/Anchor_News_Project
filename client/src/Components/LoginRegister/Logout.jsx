const Logout = async () => {
    try {
        const res = await fetch('https://njanchor.com/auth/logout', {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            credentials: 'include'
        });
        await res.json()
    } catch (err) {
        console.error(err.message)
    }
}

export default Logout;