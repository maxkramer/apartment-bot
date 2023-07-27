import randomUserAgent from "random-useragent";
import Pino from 'pino'
import path from 'path'
import {code} from "currency-codes";

export const JOB_CRONTAB = '0 */5 5-23 * * *'
export const DATABASE_NAME = 'apartments.db'
export const DEFAULT_CURRENCY_CODE = code('GBP')?.code || 'GBP'
export const DEFAULT_PAGE_TIMEOUT = 2_000
export const BROWSER_CONTEXT = {
    userAgent: randomUserAgent.getRandom(),
    locale: 'en_GB',
    hasTouch: true,
    deviceScaleFactor: 2,
    isMobile: true,
    timezoneId: 'GMT+1',
    viewport: {
        width: 562,
        height: 1218
    },
    screen: {
        width: 562,
        height: 1218
    }
}

export const logger = Pino({
    transport: {
        target: 'pino-pretty',
        options: process.env.NODE_ENV === 'production' ? {
            destination: path.resolve(__dirname + '/cron-job.log'),
            colorize: true,
            translateTime: "yyyy-mm-dd h:MM:ss TT Z",
        } : undefined,
    },
    base: undefined,
    formatters: {
        level: (label) => ({
            level: label
        })
    }
})
