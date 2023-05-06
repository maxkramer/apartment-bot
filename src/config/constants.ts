import randomUserAgent from "random-useragent";
import Pino from 'pino'
import path from 'path'

export const DATABASE_NAME = 'apartments.db'
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
        options: {
            destination: path.resolve('/var/log/london-apartment-bot/cron-job.log'),
            colorize: true,
            translateTime: "yyyy-mm-dd h:MM:ss TT Z",
        },
    },
    base: undefined,
    formatters: {
        level: (label) => {
            return {
                level: label
            }
        }
    }
})
