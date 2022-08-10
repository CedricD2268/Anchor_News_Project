const NewDateConvertUtc = (getDate) => {
    const month = new Date(getDate).toLocaleString("en-US", {month: "short"})// December
    const day = new Date(getDate).toLocaleString("en-US", {day: "numeric"})
    const year = new Date(getDate).toLocaleString("en-US", {year: "numeric"})
    const time = new Date(getDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const date = `${day} ${month} ${year} ${time}`
    return(date)
}

export default NewDateConvertUtc