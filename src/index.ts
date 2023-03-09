import {BROWSER_CONTEXT, DATABASE_NAME} from "./config/constants"
import loki from 'lokijs'
import {postProperties} from "./slack"
import adapters from "./config/adapters"
import * as playwright from "playwright"
import delay from "@slack/web-api/dist/helpers"
import * as dotenv from 'dotenv'

dotenv.config()

const db = new loki(DATABASE_NAME, {
    persistenceMethod: 'fs',
})
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

const loadDatabase: Promise<void> = new Promise((resolve) =>
    db.loadDatabase(undefined, () => resolve())
)

const closeDatabase: Promise<void> = new Promise((resolve) =>
    db.close(() => resolve())
)

const main = () => loadDatabase
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
    .then(() => delay(5_000))
    .then(() => process.exit(0))

main()
