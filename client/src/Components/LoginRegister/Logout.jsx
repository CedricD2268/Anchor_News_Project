const Logout = async () => {
    try {
        const res = await fetch('http://localhost:5000/auth/logout', {
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