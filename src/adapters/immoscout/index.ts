import Adapter from "../../types/adapter";
import {Apartment} from "../../entity";
import {Page} from "playwright";
import {Paging, ResultlistEntry2} from "./models";
import {logger} from "../../config/constants";
import Prices from "../../entity/prices";
import {BASE_URL} from "./constants";
import Config from "../../types/config";
import * as crypto from 'crypto'
import * as fs from "fs";
import fetch from 'node-fetch'

const imageUrlSeparator = '/ORIG/'
const parseImageUrl = (listing: ResultlistEntry2) => {
    const imageUrl = listing['resultlist.realEstate'].galleryAttachments?.attachment[0].urls[0].url["@href"]
    if (!imageUrl) {
        return undefined
    }

    const location = imageUrl.indexOf(imageUrlSeparator)
    if (location === -1) {
        return imageUrl.replace('%WIDTH%', '500').replace('%HEIGHT%', '500')
    }

    return imageUrl.split(imageUrlSeparator)[0]
}

const descriptionFromListing = (listing: ResultlistEntry2) => {
    const {balcony, builtInKitchen} = listing["resultlist.realEstate"]
    const livingSpace = listing.attributes[0].attribute.find((attr) => attr.label === 'Wohnfläche')?.value
    const numberOfRooms = listing.attributes[0].attribute.find((attr) => attr.label === 'Zimmer')?.value

    return `Size: ${livingSpace}. Rooms: ${numberOfRooms}. Balcony: ${balcony}. Kitchen: ${builtInKitchen}`
}

const mapListing = (listing: ResultlistEntry2, adapterName: string): Apartment => {
    const apartment = new Apartment()
    apartment.externalId = listing["@id"]
    apartment.title = listing["resultlist.realEstate"].title
    apartment.address = listing['resultlist.realEstate'].address.description.text
    apartment.description = descriptionFromListing(listing)
    apartment.image = parseImageUrl(listing)
    apartment.publishedOn = listing["@publishDate"]
    apartment.url = `${BASE_URL}/expose/${listing["@id"]}`
    apartment.messageUrl = `${BASE_URL}/expose/${listing["@id"]}#/basicContact/email`
    apartment.adapterName = adapterName
    apartment.location = {
        type: 'Point',
        coordinates: [listing['resultlist.realEstate'].address?.wgs84Coordinate?.latitude ?? 0, listing['resultlist.realEstate'].address?.wgs84Coordinate?.longitude ?? 0]
    }

    const prices = new Prices()
    prices.monthly = listing["resultlist.realEstate"].price.value
    prices.weekly = listing["resultlist.realEstate"].price.value / 4
    prices.currency = '€'
    apartment.prices = prices

    return apartment
}

const runSearch = async (config: Config, page: Page): Promise<Array<ResultlistEntry2>> => {
    const fetchPage = (url: string) => fetch(
        "https://api.zyte.com/v1/extract", {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.ZYTE_API_KEY}:`).toString('base64')}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate'
            },
            body: JSON.stringify({
                url,
                browserHtml: true
            })
        }
    )
        .then((response) => response.json())
        .then((response) => {
            const filePath = `/tmp/${crypto.createHash('sha1').update(url).digest('hex')}.html`
            logger.info(`Writing response to ${filePath}`)

            const parsedResponse = response as { browserHtml: string }
            fs.writeFileSync(filePath, parsedResponse.browserHtml)
            logger.info(`Going to ${filePath}`)
            return page.goto(`file://${filePath}`)
        })
        .then(() => page.evaluate<Array<ResultlistEntry2>>('window.IS24.resultList.resultListModel.searchResponseModel[\'resultlist.resultlist\'].resultlistEntries[0].resultlistEntry'))
        .then((properties) => page.evaluate<Paging>('window.IS24.resultList.resultListModel.searchResponseModel[\'resultlist.resultlist\'].paging')
            .then((pagination) => ({
                pagination,
                properties
            })))
        .catch((error) => page.innerHTML('html')
            .then(console.log)
            .then(() => error)
        )

    const initialSearchUrl = `${BASE_URL}/${config.location}`
    logger.info(`Going to ${initialSearchUrl}`)
    const firstPage = await fetchPage(initialSearchUrl)
    const allListings = [...firstPage.properties]

    let nextPageUrl = firstPage.pagination.next
    while (!!nextPageUrl) {
        logger.info(`Going to ${nextPageUrl}`)
        const nextPage = await fetchPage(nextPageUrl)
        nextPageUrl = nextPage.pagination.next
        allListings.push(...nextPage.properties)
    }

    return Promise.resolve(allListings)
}

const immoScoutAdapter: Adapter = ({
    fetchAll: async (config, browser) => {
        logger.info(`Fetching apartments from ${config.name}`)
        const page = await browser
            .newPage();
        const listings = await runSearch(config, page);
        return listings.map((listing) => mapListing(listing, config.name));
    }
})
export default immoScoutAdapter
