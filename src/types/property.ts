type Property = {
    id: string
    title: string,
    description: string,
    address: string,

    image?: string,
    prices: {
        monthly: string,
        weekly: string,
    },
    lastUpdated?: string,

    url: string,
    messageLink?: string
}
export default Property
