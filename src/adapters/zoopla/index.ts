import Adapter from "../../types/adapter";
import Config from "../../types/config";
import {Listing} from "./listing";
import {Apartment} from "../../entity";
import {DEFAULT_CURRENCY_CODE, DEFAULT_PAGE_TIMEOUT, logger} from "../../config/constants";
import Prices from "../../entity/prices";
import {BASE_URL} from "./constants";
import {featureToKey, parsePublishedOn} from "./utils";

const generateSearchUrl = (config: Config) => `${BASE_URL}/to-rent/map/property/london/?beds_min=${config.minBeds}&price_frequency=per_month&price_max=${config.maxPrice}&price_min=${config.minPrice}&q=London&radius=0&results_sort=newest_listings&search_source=to-rent&is_retirement_home=false&is_shared_accommodation=false&hidePoly=false&available_from=3months${config.furnished ? '&furnished_state=furnished' : ''}&polyenc=${config.location}`
const mapListing: (listing: Listing, config: Config) => Apartment = (listing, config) => {
    const apartment = new Apartment()
    apartment.externalId = listing.listingId
    apartment.title = listing.title
    apartment.address = listing.address
    apartment.description = listing.features.map(({
                                                      content,
                                                      iconId
                                                  }) => `*${featureToKey(iconId)}*: ${content}`).join('. ')
    apartment.image = listing.image.src

    apartment.publishedOn = parsePublishedOn(listing.publishedOn)
    apartment.url = `${BASE_URL}${listing.listingUris.detail}`
    apartment.messageUrl = `${BASE_URL}${listing.listingUris.contact}`
    apartment.adapterName = config.name
    apartment.location = {
        type: 'Point',
        coordinates: [listing.pos.lng, listing.pos.lat]
    }

    const prices = new Prices()
    const monthlyPrice = parseInt(listing.shortPriceTitle.replace('£', ''))
    prices.monthly = monthlyPrice
    prices.weekly = monthlyPrice / 4
    prices.currency = DEFAULT_CURRENCY_CODE
    apartment.prices = prices

    return apartment
}

const zooplaAdapter: Adapter = ({
    fetchAll: (config, browser) => {
        logger.info(`Fetching apartments from ${config.name}`)
        return browser.newPage()
            .then((page) =>
                page.goto(generateSearchUrl(config))
                    .then(() => page.waitForTimeout(DEFAULT_PAGE_TIMEOUT))
                    .then(() => page.textContent('//*[@id="__NEXT_DATA__"]'))
                    .catch(async (ex) => {
                        logger.error(ex);
                        logger.info(await page.innerHTML('body'))
                    })
            ).then((response) => JSON.parse(response || '')
            ).then((obj) => obj.props.pageProps.initialProps.listings as Listing[])
            .then((listings) => listings.map((listing) => mapListing(listing, config)))
    }
})
export default zooplaAdapter
