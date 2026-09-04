import GGDealsApiFacade from "../Facades/GGDealsApiFacade";
import type {TGGDealsIdType, TGGDealsPriceOverview, TGGDealsError} from "@Background/Modules/GGDeals/_types";
import type UserInterface from "@Core/User/UserInterface";

interface TResponse {
    prices: {
        type: TGGDealsIdType,
        id: number,
        data: TGGDealsPriceOverview
    }[],
    error?: TGGDealsError
}

export default class GGDealsPrices {

    constructor(
        private readonly user: UserInterface
    ) {}

    async load(params: {apps?: number[], subs?: number[], bundles?: number[]}): Promise<TResponse> {
        const response = await GGDealsApiFacade.fetchPrices(
            this.user.storeCountry ?? "US",
            params.apps ?? [],
            params.subs ?? [],
            params.bundles ?? []
        );

        const result: TResponse = {
            prices: [],
            error: response.error
        };

        for (const [gameId, data] of Object.entries(response.prices)) {
            if (!data) {
                continue;
            }
            const [type, id] = <[TGGDealsIdType, string]>gameId.split("/");
            result.prices.push({type, id: Number(id), data});
        }

        return result;
    }
}
