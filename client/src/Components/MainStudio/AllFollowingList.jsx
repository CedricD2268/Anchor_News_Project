const AllFollowingList = async(unfollow) => {
    let data = {name: 'AllUnFollowingList'}
    if (!unfollow){
         data = {name: 'AllFollowingList'}
    }
    try {
        const res = await fetch('https://njanchor.com/home/mainfunction/following', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify(data)
        });
        return await res.json()

    } catch (error) {
        console.error(error.message)
    }
}

export default AllFollowingList