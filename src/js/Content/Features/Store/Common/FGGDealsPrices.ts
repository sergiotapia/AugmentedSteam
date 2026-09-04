import GGDealsPriceOverview from "@Content/Modules/Prices/GGDealsPriceOverview.svelte";
import GGDealsSetupHint from "@Content/Modules/Prices/GGDealsSetupHint.svelte";
import type CBundle from "@Content/Features/Store/Bundle/CBundle";
import Settings from "@Options/Data/Settings";
import Feature from "@Content/Modules/Context/Feature";
import GGDealsPrices from "@Content/Modules/Prices/GGDealsPrices";
import type {TGGDealsPriceOverview} from "@Background/Modules/GGDeals/_types";
import type CSub from "@Content/Features/Store/Sub/CSub";
import type CApp from "@Content/Features/Store/App/CApp";

export default class FGGDealsPrices extends Feature<CApp|CSub|CBundle> {

    override checkPrerequisites(): boolean {
        return Settings.showggdeals;
    }

    private insertPrices(type: "app"|"sub"|"bundle", id: number, data: TGGDealsPriceOverview): void {
        if (!Settings.showggdeals_official && !Settings.showggdeals_keyshops) {
            return;
        }
        if (!data.currentRetail && !data.currentKeyshops && !data.historicalRetail && !data.historicalKeyshops) {
            return;
        }
        if (!Settings.showggdeals_official && !data.currentKeyshops && !data.historicalKeyshops) {
            return;
        }
        if (!Settings.showggdeals_keyshops && !data.currentRetail && !data.historicalRetail) {
            return;
        }

        let anchor: HTMLElement|null = null;

        if (type === "sub") {
            const inputEl = document.querySelector(`input[name=subid][value="${id}"]`);
            if (inputEl) {
                anchor = inputEl.closest(".game_area_purchase_game_wrapper")
                    || inputEl.closest(".game_area_purchase_game");
            }
        } else if (type === "bundle") {
            anchor = document.querySelector(`.game_area_purchase_game_wrapper[data-ds-bundleid="${id}"]`)
                || document.querySelector(`.game_area_purchase_game[data-ds-bundleid="${id}"]`);
        }

        if (anchor) {
            new GGDealsPriceOverview({
                target: anchor.parentElement!,
                anchor,
                props: {data}
            });
        }
    }

    private insertHint(): void {
        const anchor = document.querySelector<HTMLElement>("#game_area_purchase .game_area_purchase_game_wrapper")
            ?? document.querySelector<HTMLElement>("#game_area_purchase .game_area_purchase_game")
            ?? document.querySelector<HTMLElement>(".game_area_purchase_game_wrapper")
            ?? document.querySelector<HTMLElement>(".game_area_purchase_game");

        if (!anchor?.parentElement) {
            return;
        }

        new GGDealsSetupHint({
            target: anchor.parentElement,
            anchor
        });
    }

    override async apply(): Promise<void> {
        const prices = new GGDealsPrices(this.context.user);

        const subs: number[] = this.context.getAllSubids().map(Number);
        const bundles: number[] = [];
        for (const node of document.querySelectorAll<HTMLElement>("[data-ds-bundleid]")) {
            bundles.push(Number(node.dataset.dsBundleid));
        }

        if (subs.length === 0 && bundles.length === 0) {
            return;
        }

        try {
            const {prices: rows, error} = await prices.load({
                subs,
                bundles
            });

            if (error === "no_key") {
                this.insertHint();
                return;
            }

            for (const {type, id, data} of rows) {
                this.insertPrices(type, id, data);
            }
        } catch (err) {
            this.logError(err, "Failed to load GG.deals prices");
        }
    }
}
