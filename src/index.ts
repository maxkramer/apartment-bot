import {BROWSER_CONTEXT} from "./config/constants"
import adapters from "./config/adapters"
import * as playwright from "playwright"
import * as dotenv from 'dotenv'
import {postProperties} from "./slack"
import {closeDatabase, db, loadDatabase} from "./helpers/database"
import Cron from "croner"

const fetchAllProperties = async () => {
    const results = []
    const browser = await playwright.chromium.launch({
        headless: true,
    }).then((browser) => browser.newContext(BROWSER_CONTEXT))

    for (const fetchProperties of adapters
        .filter((adapter) => adapter.enabled)
        .map((adapter) => adapter.adapter.fetchProperties(adapter.config, browser)
            .then((properties) => ({properties, ...adapter}))
        )) {
        results.push(await fetchProperties)
    }

    await browser.close()
    return results
}

const main = () => {
    dotenv.config()
    console.log("Starting job")
    loadDatabase
        .then(fetchAllProperties)
        .then((adapters) => adapters.map((adapter) => {
            const collection = db.getCollection(adapter.config.name) || db.addCollection(adapter.config.name)
            const existingApartments = collection.find({
                id: {
                    "$in": adapter.properties.map((apartment) => apartment.id)
                },
            }).map((apartment) => apartment.id)

            const newApartments = adapter.properties.filter((apartment) => existingApartments.find((ap) => ap === apartment.id) === undefined)
            console.log(`Found ${newApartments.length} new apartments on ${adapter.config.name}`)

            collection.startTransaction()
            collection.insert(newApartments)
            collection.commit()
            db.save()

            return {newProperties: newApartments, adapter: adapter.config}
        }))
        .then(postProperties)
        .then(() => closeDatabase)
        .then(() => console.log("Completed job"))
}

Cron(
    '0 * 5-22 * * *',
    {catch: true},
    main
)
