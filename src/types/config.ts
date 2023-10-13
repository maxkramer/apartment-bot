type Config = {
    enabled: boolean
    minPrice: number
    maxPrice: number
    minBeds: number
    furnished: boolean
    location?: string
    name: string
    slack: {
        icon: string,
        channel: string
    }
}

export default Config
