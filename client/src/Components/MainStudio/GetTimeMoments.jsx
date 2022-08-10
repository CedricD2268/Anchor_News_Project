const GetTimeMoments = (date) => {
    let t = date.split(/[-T:Z.]/)
    let dateDiff = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    dateDiff = dateDiff.toUTCString()
    dateDiff = Date.parse(dateDiff)
    let difference = new Date().getTime() - dateDiff;

    let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    let minutesDifference = Math.floor(difference / 1000 / 60);
    // difference -= minutesDifference * 1000 * 60

    // let secondsDifference = Math.floor(difference / 1000);

    let months = Math.floor(daysDifference % 365 / 30)
    let years = Math.floor(daysDifference / 365)

    // console.log('difference = ' +
    //     daysDifference + ' day/s ' +
    //     hoursDifference + ' hour/s ' +
    //     minutesDifference + ' minute/s ' +
    //     secondsDifference + ' second/s ');

    if (daysDifference === 0 && hoursDifference === 0 && minutesDifference < 6) {
        return ('moments')
    }
    if (daysDifference === 0 && hoursDifference === 0 && minutesDifference < 59) {
        return (`${minutesDifference} minutes`)
    }
    if (daysDifference === 0 && hoursDifference >= 1) {
        if (hoursDifference === 1) {
            return (`${hoursDifference} hour`)
        }
        return (`${hoursDifference} hours`)
    }
    if (daysDifference >= 1) {
        if (daysDifference === 1) {
            return (`${daysDifference} day`)
        }
        if (daysDifference <= 31) {
            return (`${daysDifference} days`)
        }
        if (years === 0 && months >= 1) {
            if (months === 1) {
                return (`${months} month`)
            }
            return (`${months} months`)
        }
        if (years === 1) {
            return (`${years} year`)
        }
        return (`${years} years`)
    }
}

export default GetTimeMoments;