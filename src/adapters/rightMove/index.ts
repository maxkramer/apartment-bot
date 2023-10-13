import Adapter from "../../types/adapter";
import Config from "../../types/config";
import {Apartment} from "../../entity";
import {Page} from "playwright";
import {Models, Pagination} from "./models";
import {DEFAULT_CURRENCY_CODE, DEFAULT_PAGE_TIMEOUT, logger} from "../../config/constants";
import Prices from "../../entity/prices";
import {BASE_URL} from "./constants";
import {parseMoneyFromDisplayPrice} from "./utils";

const generateSearchUrl = (config: Config, index: string) => `${BASE_URL}/property-to-rent/find.html?locationIdentifier=${config.location}&maxBedrooms=${config.minBeds + 2}&minBedrooms=${config.minBeds}&maxPrice=${config.maxPrice}&minPrice=${config.minPrice}&propertyTypes=detached%2Csemi-detached%2Cterraced%2Cflat%2Cbungalow&maxDaysSinceAdded=7&mustHave=&dontShow=houseShare%2Cretirement%2Cstudent${config.furnished ? '&furnishTypes=furnished%2CpartFurnished' : ''}&keywords=&index=${index}`
const mapListing = (listing: Models, adapterName: string): Apartment => {
    const apartment = new Apartment()
    apartment.externalId = listing.id.toString()
    apartment.title = listing.propertyTypeFullDescription
    apartment.address = listing.displayAddress
    apartment.description = listing.summary
    apartment.image = listing.propertyImages.mainImageSrc
    apartment.publishedOn = listing.firstVisibleDate
    apartment.url = `${BASE_URL}${listing.propertyUrl}`
    apartment.messageUrl = `${BASE_URL}${listing.contactUrl}`
    apartment.adapterName = adapterName
    apartment.location = {
        type: 'Point',
        coordinates: [listing.location.longitude, listing.location.latitude]
    }

    const prices = new Prices()
    prices.monthly = parseMoneyFromDisplayPrice(listing.price.displayPrices[0])
    prices.weekly = parseMoneyFromDisplayPrice(listing.price.displayPrices[1])
    prices.currency = DEFAULT_CURRENCY_CODE
    apartment.prices = prices

    return apartment
}

const runSearch = async (page: Page, config: Config): Promise<Array<Models>> => {
    const fetchPage = (index: string) => {
        logger.info(`Going to ${generateSearchUrl(config, index)}`)
        return page.goto(generateSearchUrl(config, index))
            .then(() => page.waitForTimeout(DEFAULT_PAGE_TIMEOUT))
            .then(() => page.evaluate<Array<Models>>('window.jsonModel.properties'))
            .then((properties) => page.evaluate<Pagination>('window.jsonModel.pagination')
                .then((pagination) => ({
                    pagination,
                    properties
                })))
    }

    const firstPage = await fetchPage('0')
    const paginationOptions = firstPage.pagination.options.filter(({value}) => value !== firstPage.pagination.options[0].value)

    const allListings = [...firstPage.properties]
    for (const option of paginationOptions) {
        const page = await fetchPage(option.value)
        allListings.push(...page.properties)
    }

    return Promise.resolve(allListings)
}

const rightMoveAdapter: Adapter = ({
    fetchAll: (config, browser) => {
        logger.info(`Fetching apartments from ${config.name}`)
        return browser
            .newPage()
            .then((page) => runSearch(page, config))
            .then((listings) => listings.map((listing) => mapListing(listing, config.name)))
    }
})
export default rightMoveAdapter
