/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Branch {
    __typename: string;
    name?: any;
    branchDetailsUri?: any;
    phone?: any;
    logoUrl?: any;
}

export interface Feature {
    __typename: string;
    content: number;
    iconId: string;
}

export interface ResponsiveImgList {
    __typename: string;
    width: number;
    src: string;
}

export interface Image {
    __typename: string;
    src: string;
    caption: string;
    responsiveImgList: ResponsiveImgList[];
}

export interface ListingUris {
    __typename: string;
    contact: string;
    detail: string;
}

export interface Pos {
    lat: number;
    lng: number;
}

export interface Listing {
    __typename: string;
    numberOfVideos: number;
    numberOfImages: number;
    numberOfFloorPlans: number;
    numberOfViews: number;
    listingId: string;
    title: string;
    publishedOnLabel: string;
    publishedOn: string;
    availableFrom: string;
    priceDrop?: any;
    isPremium: boolean;
    highlights: any[];
    otherPropertyImages: any[];
    branch: Branch;
    features: Feature[];
    image: Image;
    transports: any[];
    flag?: any;
    priceTitle: string;
    shortPriceTitle: string;
    price: string;
    address: string;
    tags: any[];
    listingUris: ListingUris;
    listingType: string;
    underOffer: boolean;
    availableFromLabel: string;
    isFavourite: boolean;
    pos: Pos;
}


