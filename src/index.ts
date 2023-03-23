import {BROWSER_CONTEXT, logger} from "./config/constants"
import adapters from "./config/adapters"
import * as playwright from "playwright"
import * as dotenv from 'dotenv'
import {closeDatabase, db, loadDatabase, saveDatabase} from "./helpers/database"
import Cron from "croner";
import {postProperties} from "./slack";

const fetchAllProperties = async () => {
    const results = []
    const browser = await playwright.chromium.launch({
        headless: true,
    })
    const context = await browser.newContext(BROWSER_CONTEXT)

    for (const fetchProperties of adapters
        .filter((adapter) => adapter.enabled)
        .map((adapter) => adapter.adapter.fetchProperties(adapter.config, context)
            .then((properties) => ({properties, ...adapter}))
            .catch((ex) => logger.error(`Error fetching properties from ${adapter.config.name}`, ex))
        )) {

        const propertyResults = await fetchProperties
        if (propertyResults) {
            results.push(propertyResults)
        }
    }

    await context.close()
    await browser.close()
    return results
}

const main = async () => {
    dotenv.config()
    logger.info('Starting job')
    return loadDatabase
        .then(fetchAllProperties)
        .then((adapters) => Promise.resolve(adapters.map((adapter) => {
            const collection = db.getCollection(adapter.config.name) ?? db.addCollection(adapter.config.name)
            const existingApartments = new Set(collection.find({
                id: {
                    "$in": adapter.properties.map((apartment) => apartment.id)
                },
            }).map((apartment) => apartment.id))

            const duplicatesHashMap: Record<string, object> = {}
            const newApartments = adapter.properties.filter((apartment) => {
                if (duplicatesHashMap[apartment.id] === undefined) {
                    duplicatesHashMap[apartment.id] = {}
                    return !existingApartments.has(apartment.id)
                }
                return false
            })

            logger.info(`Found ${newApartments.length}/${adapter.properties.length} new apartments on ${adapter.config.name}`)

            collection.startTransaction()
            collection.insert(newApartments)
            collection.commit()

            return {newProperties: newApartments, adapter: adapter.config}
        })))
        .then((results) => saveDatabase().then(() => closeDatabase()).then(() => results))
        .then(postProperties)
        .then(() => logger.info("Completed job"))
}

Cron(
    '0 */5 5-23 * * *',
    {
        catch: true,
        unref: false,
    },
    main,
)
