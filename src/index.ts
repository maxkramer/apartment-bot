import {BROWSER_CONTEXT, logger} from "./config/constants"
import enabledAdapters from "./helpers/adapters"
import {chromium} from "playwright-extra"
import stealth from 'puppeteer-extra-plugin-stealth'
import 'reflect-metadata'
import {AppDataSource} from "./data-source";
import {Apartment} from "./entity";
import {In} from "typeorm";
import {postAll} from "./slack";

const fetchAllApartments = async () => {
    const results = []
    const browser = await chromium.use(stealth()).launch({headless: true})
    const context = await browser.newContext(BROWSER_CONTEXT)

    const fetchFunctions = enabledAdapters
        .map((adapter) => adapter.adapter.fetchAll(adapter.config, context)
            .then((apartments) => ({apartments, ...adapter}))
            .catch((ex) => {
                logger.error(`Error fetching apartments from ${adapter.config.name}`)
                logger.error(ex)
            })
        )

    for (const fetchAll of fetchFunctions) {
        const propertyResults = await fetchAll
        if (propertyResults) {
            results.push(propertyResults)
        }
    }

    await context.close()
    await browser.close()
    return results
}

const main = async () => {
    logger.info('Starting job')

    const dataSource = await AppDataSource.initialize()
    const apartmentRepository = dataSource.getRepository(Apartment)

    await apartmentRepository.count()

    const all = await fetchAllApartments()
    for (const {config, apartments} of all) {
        const seenApartments = await apartmentRepository.find({
            where: {
                externalId: In(apartments.map((apartment) => apartment.externalId)),
                adapterName: config.name
            },
            select: {
                externalId: true
            }
        })

        const seenExternalIds = seenApartments.map((apartment) => apartment.externalId)
        const duplicatesHashMap: Record<string, object> = {}
        const newApartments = apartments.filter((apartment) => {
            if (duplicatesHashMap[apartment.externalId] === undefined) {
                duplicatesHashMap[apartment.externalId] = {}
                return !seenExternalIds.includes(apartment.externalId)
            }
            return false
        })

        logger.info(`Found ${newApartments.length}/${apartments.length} new apartments on ${config.name}`)

        if (newApartments.length > 0) {
            const savedApartments = await apartmentRepository.save(newApartments)
            await postAll({apartments: savedApartments, adapter: config})
        }
    }

    await dataSource.destroy()
    logger.info("Completed job")
}

main()

//
// Cron(
//     JOB_CRONTAB,
//     {
//         catch: true,
//         unref: false,
//     },
//     main,
// )
