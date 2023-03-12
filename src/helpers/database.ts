import loki from "lokijs";
import {DATABASE_NAME} from "../config/constants";

export const db = new loki(DATABASE_NAME, {
    persistenceMethod: 'fs',
})

export const loadDatabase: Promise<void> = new Promise((resolve) =>
    db.loadDatabase(undefined, () => resolve())
)

export const closeDatabase: Promise<void> = new Promise((resolve) =>
    db.close(() => resolve())
)
