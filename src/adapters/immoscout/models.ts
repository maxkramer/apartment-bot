export interface ResultList {
    paging: Paging
    searchId: string
    matchCountList: string
    resultlistEntries: ResultlistEntry[]
    description: Description2
}

export interface Paging {
    next?: string
    current: string
    pageNumber: number
    pageSize: number
    numberOfPages: number
    numberOfHits: number
    numberOfListings: number
    template: string
}

export interface ResultlistEntry {
    "@numberOfHits": string
    "@realEstateType": string
    resultlistEntry: ResultlistEntry2[]
}

export interface ResultlistEntry2 {
    "@id": string
    "@modification": string
    "@creation": string
    "@publishDate": Date
    realEstateId: number
    disabledGrouping: string
    "resultlist.realEstate": ResultlistRealEstate
    attributes: Attribute[]
    realEstateTags: RealEstateTags
    hasNewFlag: string
    liveVideoTourAvailable?: string
}

export interface ResultlistRealEstate {
    "@xsi.type": string
    "@id": string
    title: string
    address: Address
    companyWideCustomerId: string
    floorplan: string
    streamingVideo: string
    listingType: string
    showcasePlacementColor?: string
    privateOffer: string
    contactDetails: ContactDetails
    realtorCompanyName?: string
    realtorLogoForResultList?: RealtorLogoForResultList
    galleryAttachments?: GalleryAttachments
    spotlightListing: string
    price: Price
    livingSpace: number
    numberOfRooms: number
    energyPerformanceCertificate?: string
    energyEfficiencyClass?: string
    builtInKitchen: boolean
    balcony: boolean
    garden: boolean
    calculatedTotalRent: CalculatedTotalRent
    constructionYear?: number
    paywallListing?: PaywallListing
    virtualTourAvailable?: string
}

export interface Address {
    postcode: string
    city: string
    quarter: string
    description: Description
    street?: string
    houseNumber?: string
    wgs84Coordinate?: Wgs84Coordinate
    preciseHouseNumber?: string
}

export interface Description {
    text: string
}

export interface Wgs84Coordinate {
    latitude: number
    longitude: number
}

export interface ContactDetails {
    salutation: string
    firstname?: string
    lastname?: string
    phoneNumber?: string
    company?: string
    cellPhoneNumber?: string
    portraitUrl?: string
    portraitUrlForResultList?: PortraitUrlForResultList
}

export interface PortraitUrlForResultList {
    "@xsi.type": string
    "@xlink.href": string
    floorplan: string
    titlePicture: string
    urls: Url[]
}

export interface Url {
    url: Url2[]
}

export interface Url2 {
    "@scale": string
    "@href": string
}

export interface RealtorLogoForResultList {
    "@xsi.type": string
    floorplan: string
    titlePicture: string
    urls: Url3[]
}

export interface Url3 {
    url: Url4
}

export interface Url4 {
    "@scale": string
    "@href": string
}

export interface GalleryAttachments {
    attachment: Array<{
        floorplan: boolean,
        titlePicture: boolean,
        urls: Array<{
            url: {
                '@href': string
            }
        }>
    }>
}

export interface Price {
    value: number
    currency: string
    marketingType: string
    priceIntervalType: string
}

export interface CalculatedTotalRent {
    totalRent: TotalRent
    calculationMode: string
}

export interface TotalRent {
    value: number
    currency: string
    marketingType: string
    priceIntervalType: string
}

export interface PaywallListing {
    active: string
}

export interface Attribute {
    attribute: Attribute2[]
}

export interface Attribute2 {
    label: string
    value: any
}

export interface RealEstateTags {
    tag: any
}

export interface Description2 {
    text: string
}
