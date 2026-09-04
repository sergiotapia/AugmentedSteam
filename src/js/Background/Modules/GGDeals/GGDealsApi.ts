import Api from "../Api";
import Config from "config";
import IndexedDB from "@Background/Db/IndexedDB";
import Settings from "@Options/Data/Settings";
import {EAction} from "@Background/EAction";
import Errors from "@Core/Errors/Errors";
import TimeUtils from "@Core/Utils/TimeUtils";
import {Unrecognized} from "@Background/background";
import type MessageHandlerInterface from "@Background/MessageHandlerInterface";
import type {Tabs} from "webextension-polyfill";
import {resolveGGDealsRegion} from "./GGDealsRegion";
import type {
    TFetchGGDealsPricesResponse,
    TGGDealsApiGame,
    TGGDealsApiResponse,
    TGGDealsError,
    TGGDealsIdType,
    TGGDealsMoney,
    TGGDealsPriceOverview,
    TGGDealsRegion
} from "./_types";

const CacheTTL = 60 * 60;
const MaxIdsPerRequest = 100;

const Endpoints: Record<TGGDealsIdType, string> = {
    app: "v1/prices/by-steam-app-id/",
    sub: "v1/prices/by-steam-sub-id/",
    bundle: "v1/prices/by-steam-bundle-id/"
};

export default class GGDealsApi extends Api implements MessageHandlerInterface {

    constructor() {
        super(Config.GGDealsApiHost);
    }

    private parseMoney(value: string|null|undefined, currency: string): TGGDealsMoney|null {
        if (value === null || value === undefined || value === "") {
            return null;
        }
        const amount = Number.parseFloat(value);
        if (!Number.isFinite(amount)) {
            return null;
        }
        return {
            amount,
            amountInt: Math.round(amount * 100),
            currency
        };
    }

    private toOverview(game: TGGDealsApiGame): TGGDealsPriceOverview {
        const currency = game.prices.currency || "USD";
        return {
            title: game.title,
            url: game.url,
            currentRetail: this.parseMoney(game.prices.currentRetail, currency),
            currentKeyshops: this.parseMoney(game.prices.currentKeyshops, currency),
            historicalRetail: this.parseMoney(game.prices.historicalRetail, currency),
            historicalKeyshops: this.parseMoney(game.prices.historicalKeyshops, currency)
        };
    }

    private classifyHttpError(code: number): TGGDealsError {
        if (code === 400 || code === 401 || code === 403) {
            return "invalid_key";
        }
        if (code === 429) {
            return "rate_limit";
        }
        return "unknown";
    }

    private async readCache(
        type: TGGDealsIdType,
        ids: number[],
        region: TGGDealsRegion,
        result: Record<string, TGGDealsPriceOverview|null>
    ): Promise<number[]> {
        const missing: number[] = [];
        for (const id of ids) {
            const gameId = `${type}/${id}`;
            const cached = await IndexedDB.get("ggdealsPrices", `${gameId}/${region}`);
            if (cached && !TimeUtils.isInPast(cached.expiry)) {
                result[gameId] = cached.data;
            } else {
                missing.push(id);
            }
        }
        return missing;
    }

    private async fetchType(
        apiKey: string,
        region: TGGDealsRegion,
        type: TGGDealsIdType,
        ids: number[],
        result: Record<string, TGGDealsPriceOverview|null>
    ): Promise<void> {
        if (ids.length === 0) {
            return;
        }

        for (let i = 0; i < ids.length; i += MaxIdsPerRequest) {
            const chunk = ids.slice(i, i + MaxIdsPerRequest);
            const url = this.getUrl(Endpoints[type], {
                ids: chunk.join(","),
                key: apiKey,
                region
            });

            const response = await this.fetchJson<TGGDealsApiResponse>(url);
            const expiry = TimeUtils.now() + CacheTTL;
            const toStore: Array<[string, {data: TGGDealsPriceOverview|null, expiry: number}]> = [];

            for (const id of chunk) {
                const gameId = `${type}/${id}`;
                const raw = response.data?.[String(id)] ?? null;
                const data = raw ? this.toOverview(raw) : null;
                result[gameId] = data;
                toStore.push([`${gameId}/${region}`, {data, expiry}]);
            }

            await IndexedDB.putMany("ggdealsPrices", toStore);
        }
    }

    private async fetchPrices(
        country: string,
        apps: number[],
        subs: number[],
        bundles: number[]
    ): Promise<TFetchGGDealsPricesResponse> {
        const apiKey = Settings.ggdeals_api_key.trim();
        if (!apiKey) {
            return {prices: {}, error: "no_key"};
        }

        const region = resolveGGDealsRegion(country, Settings.ggdeals_region);
        const prices: Record<string, TGGDealsPriceOverview|null> = {};

        const missingApps = await this.readCache("app", apps, region, prices);
        const missingSubs = await this.readCache("sub", subs, region, prices);
        const missingBundles = await this.readCache("bundle", bundles, region, prices);

        try {
            await this.fetchType(apiKey, region, "app", missingApps, prices);
            await this.fetchType(apiKey, region, "sub", missingSubs, prices);
            await this.fetchType(apiKey, region, "bundle", missingBundles, prices);
        } catch (err) {
            if (err instanceof Errors.HTTPError) {
                return {prices, error: this.classifyHttpError(err.code)};
            }
            return {prices, error: "unknown"};
        }

        return {prices};
    }

    handle(message: any, _tab: Tabs.Tab|undefined): typeof Unrecognized|Promise<any> {
        switch (message.action) {
            case EAction.GGDeals_Prices: {
                const {country, apps, subs, bundles} = message.params;
                return this.fetchPrices(country, apps, subs, bundles);
            }
        }

        return Unrecognized;
    }
}
