export const getRealeaseDate = (relDate) => {
    if (relDate) {
        const dateData = relDate.split('-')
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December ',
        ]
        let [year, month, day] = dateData
        if (month[0] === '0') month = month.slice(1)
        month -= 1
        if (day[0] === '0') day = day.slice(1)
        const newFormatDate = `${months[month]} ${day}, ${year}`
        return newFormatDate
    }
    return ''
}

export const shortOverview = (text) => {
    let newStr = text.split(' ').slice(0, 25)
    if (newStr.length < text.split(' ').length) {
        newStr.push('...')
        return newStr.join(' ')
    }
    return text
}
