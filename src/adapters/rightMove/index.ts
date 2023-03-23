import Adapter from "../../types/adapter";
import Config from "../../types/config";
import Property from "../../types/property";
import {Page} from "playwright";
import {Listing, Pagination} from "./listing";
import {logger} from "../../config/constants";

const generateSearchUrl = (config: Config, index: string) => `https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=USERDEFINEDAREA%5E%7B%22polylines%22%3A%22qfkyHxhDgwD%7BKwuC%7CpCklAnyCtIjaLtyAt%7DN~sDaWz%60B%7CgE%7ClC_vC%60vCm%60Abo%40azFwa%40emFazCyv%40%7ByBor%40%60c%40w%7CIk_%40weF%22%7D&maxBedrooms=3&minBedrooms=0&maxPrice=${config.maxPrice}&minPrice=${config.minPrice}&propertyTypes=detached%2Csemi-detached%2Cterraced%2Cflat%2Cbungalow&maxDaysSinceAdded=7&mustHave=&dontShow=houseShare%2Cretirement%2Cstudent&furnishTypes=&keywords=&index=${index}`

const mapListings: (listings: Array<Listing>) => Array<Property> = (listings) => listings.map((listing) => ({
    id: listing.id.toString(),
    title: listing.propertyTypeFullDescription,
    description: listing.summary,
    address: listing.displayAddress,
    image: listing.propertyImages.mainImageSrc,
    prices: {
        monthly: listing.price.displayPrices[0].displayPrice,
        weekly: listing.price.displayPrices[1].displayPrice,
    },
    lastUpdated: listing.listingUpdate.listingUpdateDate.toString(),
    messageLink: `https://www.rightmove.co.uk${listing.contactUrl}`,
    url: `https://www.rightmove.co.uk${listing.propertyUrl}`
}))

const runSearch = async (page: Page, config: Config): Promise<Array<Listing>> => {

    // throw Error("shit happens")
    const fetchPage = (index: string) => {
        logger.info(`Going to ${generateSearchUrl(config, index)}`)
        return page.goto(generateSearchUrl(config, index))
            .then(() => page.waitForTimeout(2_000))
            .then(() => page.evaluate<Array<Listing>>('window.jsonModel.properties'))
            .then((properties) => page.evaluate<Pagination>('window.jsonModel.pagination').then((pagination) => ({
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
    fetchProperties: (config, browser) => {
        logger.info(`Fetching properties from ${config.name}`)
        return browser
            .newPage()
            .then((page) => runSearch(page, config))
            .then(mapListings)
    }
})
export default rightMoveAdapter
