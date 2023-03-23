import Adapter from "../../types/adapter";
import Config from "../../types/config";
import {Listing} from "./listing";
import Property from "../../types/property";
import {logger} from "../../config/constants";

const generateSearchUrl = (config: Config) => `https://www.zoopla.co.uk/to-rent/map/property/london/?beds_min=1&price_frequency=per_month&price_max=${config.maxPrice}&price_min=${config.minPrice}&q=London&radius=0&results_sort=newest_listings&search_source=to-rent&is_retirement_home=false&is_shared_accommodation=false&hidePoly=false&polyenc=gmcyH%60ei%40swJdbDuiDypBixGivHlD_yPliFcfDhxEmjFx%5BvEfjAz_Bnk%40x%60GfhBjeGvmCvn%40gAfgBra%40x%7DF`
const featureToName = (feature: string) => {
    if (feature === 'bed') {
        return 'Bedrooms'
    } else if (feature === 'bath') {
        return 'Bathrooms'
    } else if (feature === 'chair') {
        return 'Living Rooms'
    }
    return feature
}

const mapListing: (listing: Listing) => Property = (listing: Listing) => {
    return {
        id: listing.listingId,
        title: listing.title,
        address: listing.address,
        description: listing.features.map(({content, iconId}) => `*${featureToName(iconId)}*: ${content}`).join('. '),
        image: listing.image.src,
        prices: {
            monthly: listing.shortPriceTitle,
            weekly: `€${(parseInt(listing.shortPriceTitle.replace('£', '')) / 4).toFixed(0)}`,
        },
        lastUpdated: listing.publishedOn.trim() === '' ? undefined : listing.publishedOn.trim(),
        url: `https://zoopla.co.uk${listing.listingUris.detail}`,
        messageLink: `https://zoopla.co.uk${listing.listingUris.contact}`
    }
}

const zooplaAdapter: Adapter = ({
    fetchProperties: (config, browser) => {
        logger.info(`Fetching properties from ${config.name}`)
        return browser.newPage()
            .then((page) =>
                page.goto(generateSearchUrl(config))
                    .then(() => page.waitForTimeout(2_000))
                    .then(() => page.textContent('//*[@id="__NEXT_DATA__"]'))
                    .catch(async (ex) => {
                        logger.error(ex);
                        logger.info(await page.innerHTML('body'))
                    })
            ).then((response) => JSON.parse(response!)
            ).then((obj) => obj.props.pageProps.initialProps.listings as Listing[])
            .then((listings) => listings.map(mapListing))
    }
})
export default zooplaAdapter
