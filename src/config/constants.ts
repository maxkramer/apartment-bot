import randomUserAgent from "random-useragent";

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
