export type Listing = {
    i: number;
    id: number;
    letAgreed: boolean;
    title: string;
    description: string;
    imageUrl: string;
    details?: string[];
    distance: number;
    commuteTime: number;
    rentPerMonth: number;
    rentPerWeek: number;
    lastUpdated: string;
    isNew: boolean;
}
