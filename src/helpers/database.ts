import loki from "lokijs";
import {DATABASE_NAME, logger} from "../config/constants";

export const db = new loki(DATABASE_NAME, {
    persistenceMethod: 'fs',
})

export const loadDatabase: Promise<void> = new Promise((resolve) =>
    db.loadDatabase(undefined, () => resolve())
)

export const closeDatabase = (): Promise<void> => new Promise((resolve) =>
    db.close(() => resolve())
)

export const saveDatabase = (): Promise<void> => new Promise((resolve) => {
    logger.info('Persisting changes')
    db.save(() => resolve())
})
