export const GetArticleTopicTypeName = async (name) => {
    const data = {'name': name}
    try {
        const res = await fetch('http://localhost:5000/studio/view/article_type_topic', {
            method: "POST",
            headers: {"Content-Type": "application/json;charset=UTF-8"},
            credentials: 'include',
            body: JSON.stringify(data)
        });
        let parseRes = await res.json()
        let mirror = []

        for (const element of parseRes) {
            mirror.push(Object.values(element))
        }
        return mirror
    } catch (err) {
        console.error(err.message)
    }

}