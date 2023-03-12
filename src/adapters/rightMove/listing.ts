/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Image {
    srcUrl: string;
    url: string;
    caption?: any;
}

export interface PropertyImages {
    images: Image[];
    mainImageSrc: string;
    mainMapImageSrc: string;
}

export interface ListingUpdate {
    listingUpdateReason: string;
    listingUpdateDate: Date;
}

export interface DisplayPrice {
    displayPrice: string;
    displayPriceQualifier: string;
}

export interface Price {
    amount: number;
    frequency: string;
    currencyCode: string;
    displayPrices: DisplayPrice[];
}

export interface Customer {
    branchId: number;
    brandPlusLogoURI: string;
    contactTelephone: string;
    branchDisplayName: string;
    branchName: string;
    brandTradingName: string;
    branchLandingPageUrl: string;
    development: boolean;
    showReducedProperties: boolean;
    commercial: boolean;
    showOnMap: boolean;
    enhancedListing: boolean;
    developmentContent?: any;
    buildToRent: boolean;
    buildToRentBenefits: any[];
    brandPlusLogoUrl: string;
}

export interface ProductLabel {
    productLabelText: string;
    spotlightLabel: boolean;
}

export interface LozengeModel {
    matchingLozenges: any[];
}

export interface Listing {
    id: number;
    bedrooms: number;
    bathrooms: number;
    numberOfImages: number;
    numberOfFloorplans: number;
    numberOfVirtualTours: number;
    summary: string;
    displayAddress: string;
    countryCode: string;
    location: Location;
    propertyImages: PropertyImages;
    propertySubType: string;
    listingUpdate: ListingUpdate;
    premiumListing: boolean;
    featuredProperty: boolean;
    price: Price;
    customer: Customer;
    distance?: any;
    transactionType: string;
    productLabel: ProductLabel;
    commercial: boolean;
    development: boolean;
    residential: boolean;
    students: boolean;
    auction: boolean;
    feesApply: boolean;
    feesApplyText?: any;
    displaySize: string;
    showOnMap: boolean;
    propertyUrl: string;
    contactUrl: string;
    staticMapUrl?: any;
    channel: string;
    firstVisibleDate: Date;
    keywords: any[];
    keywordMatchType: string;
    saved: boolean;
    hidden: boolean;
    onlineViewingsAvailable: boolean;
    lozengeModel: LozengeModel;
    hasBrandPlus: boolean;
    displayStatus: string;
    enquiredTimestamp?: any;
    isRecent: boolean;
    enhancedListing: boolean;
    formattedBranchName: string;
    formattedDistance: string;
    heading: string;
    propertyTypeFullDescription: string;
    addedOrReduced: string;
}

export interface Pagination {
    total: number
    first: number
    last: number
    next: number
    page: number

    options: Array<{
        value: string,
        description: string
    }>
}
