import Adapter from "../../types/adapter";
import Config from "../../types/config";
import axios from "axios";
import {Listing} from "./listing";
import Property from "../../types/property";
import {logger} from "../../config/constants";

const generateSearchUrl = (config: Config) => `https://www.openrent.co.uk/properties-to-rent/london/flats?term=London&prices_min=${config.minPrice}&prices_max=${config.maxPrice}&isLive=true&priceperweek=true`
const generateGetPropertiesUrl = (ids: Array<string>) => {
    const params = new URLSearchParams(ids.map((id) => ["ids", id]))
    return `https://www.openrent.co.uk/search/propertiesbyid?${params.toString()}`
}
const mapListings: (listings: Array<Listing>) => Array<Property> = (listings) => listings.map((listing) => ({
    id: listing.id.toString(),
    title: listing.title,
    description: `${listing.description}\n${listing.details?.join(", ")}`,
    address: listing.description.replace(listing.description.split(',')[0], ''),
    image: listing.imageUrl?.replace('//', 'https://'),
    prices: {
        monthly: `£${listing.rentPerMonth}`,
        weekly: `£${listing.rentPerWeek.toFixed(2)}`,
    },
    lastUpdated: listing.lastUpdated,
    messageLink: `https://www.openrent.co.uk/messagelandlord/${listing.id}`,
    url: `https://www.openrent.co.uk/${listing.id}`,
}))

const chunkIds = (ids: Array<string>): Array<Array<string>> => {
    const chunks = [], n = ids.length
    let i = 0
    while (i < n) {
        chunks.push(ids.slice(i, i += 20))
    }
    return chunks
}

const openRentAdapter: Adapter = ({
    fetchProperties: (config, browser) => {
        logger.info(`Fetching properties from ${config.name}`)
        return browser
            .newPage()
            .then((page) =>
                page.goto(generateSearchUrl(config))
                    .then(() => page.waitForTimeout(2_000))
                    .then(() => page.evaluate<Array<string>>('window.searchRender.propertyIds'))
            )
            .then(chunkIds)
            .then((chunks) => Promise.all(chunks.map((ids) => axios.get<Listing[]>(generateGetPropertiesUrl(ids)).then((response) => response.data)
            )))
            .then((chunks) => chunks.flatMap((chunk) => chunk))
            .then(mapListings)
            .then((chunks) => chunks.flatMap((listings) => listings))
            .then((allListings) => allListings.filter((listing) => listing.id !== undefined))
    }
})
export default openRentAdapter
