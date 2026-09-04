export type TGGDealsIdType = "app"|"sub"|"bundle";

export type TGGDealsError = "no_key"|"invalid_key"|"rate_limit"|"unknown";

export interface TGGDealsMoney {
    amount: number,
    amountInt: number,
    currency: string
}

export interface TGGDealsPriceOverview {
    title: string,
    url: string,
    currentRetail: TGGDealsMoney|null,
    currentKeyshops: TGGDealsMoney|null,
    historicalRetail: TGGDealsMoney|null,
    historicalKeyshops: TGGDealsMoney|null
}

export interface TFetchGGDealsPricesResponse {
    prices: Record<string, TGGDealsPriceOverview|null>,
    error?: TGGDealsError
}

export const GGDealsRegions = [
    "au", "be", "br", "ca", "ch", "de", "dk", "es", "eu", "fi",
    "fr", "gb", "ie", "it", "nl", "no", "pl", "se", "us"
] as const;

export type TGGDealsRegion = typeof GGDealsRegions[number];

interface TGGDealsApiPrices {
    currentRetail: string|null,
    currentKeyshops: string|null,
    historicalRetail: string|null,
    historicalKeyshops: string|null,
    currency: string
}

export interface TGGDealsApiGame {
    title: string,
    url: string,
    prices: TGGDealsApiPrices
}

export interface TGGDealsApiResponse {
    success: boolean,
    data?: Record<string, TGGDealsApiGame|null>
}
