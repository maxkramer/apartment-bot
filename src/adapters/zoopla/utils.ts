import moment from "moment/moment";

const featureKeyMapping: Record<string, string> = {
    bed: 'Bedroom(s)',
    bath: 'Bathroom(s)',
    chair: 'Living Room(s)'
}
export const featureToKey = (feature: string) => featureKeyMapping[feature] ?? feature

export const parsePublishedOn = (publishedOn: string) => {
    const trimmed = publishedOn.trim()
    const date = moment(trimmed, "Do MMM YYYY")
    if (date.isValid()) {
        return date.toDate()
    }
    return new Date()
}
