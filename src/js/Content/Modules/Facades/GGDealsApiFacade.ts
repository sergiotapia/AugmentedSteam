import Background from "@Core/Background";
import {EAction} from "@Background/EAction";
import type {TFetchGGDealsPricesResponse} from "@Background/Modules/GGDeals/_types";

export default class GGDealsApiFacade {

    static fetchPrices(
        country: string,
        apps: number[],
        subs: number[],
        bundles: number[]
    ): Promise<TFetchGGDealsPricesResponse> {
        return Background.send(EAction.GGDeals_Prices, {country, apps, subs, bundles});
    }
}
