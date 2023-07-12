import Adapter from "../../types/adapter";
import Config from "../../types/config";
import Property from "../../types/property";
import {Page} from "playwright";
import {Listing, Pagination} from "./listing";
import {logger} from "../../config/constants";

const generateSearchUrl = (config: Config, index: string) => `https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=USERDEFINEDAREA%5E%7B"polylines"%3A"sztyHhmh%40%60bAis%40p%7B%40odAz%5C%5C~_%40dy%40XsH~hBvz%40%7Cj%40veAgY%7Cr%40uq%40dJycC~pAgeA%7BYcxCi%40%7CGWyaAdYfhDx%7B%40wXuDycCc_A%7Dq%40gt%40sfAeoBm%5C%5ChAksExOmyAm_A%7DPyMgl%40%7Bu%40fMmeA%7BfAahArAky%40%7Ce%40ii%40fo%40e%5C%5C%60~%40nCvqB_c%40zN~Gnk%40~cAhN~K%7Bw%40jiA_FzPzp%40zNziAkj%40jnA_DpeA_%7BBfo%40nNgz%40kPu%5Esl%40heAho%40huHjWlqCl~%40ok%40"%7D&maxBedrooms=${config.minBeds + 2}&minBedrooms=${config.minBeds}&maxPrice=${config.maxPrice}&minPrice=${config.minPrice}&propertyTypes=detached%2Csemi-detached%2Cterraced%2Cflat%2Cbungalow&maxDaysSinceAdded=7&mustHave=&dontShow=houseShare%2Cretirement%2Cstudent${config.furnished ? '&furnishTypes=furnished%2CpartFurnished' : ''}&keywords=&index=${index}`

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
