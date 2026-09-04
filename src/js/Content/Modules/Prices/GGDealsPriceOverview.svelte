<svelte:options accessors />

<script lang="ts">
    import PriceWithAlt from "./PriceWithAlt.svelte";
    import type {TGGDealsPriceOverview, TGGDealsMoney} from "@Background/Modules/GGDeals/_types";
    import type {TPrice} from "@Background/Modules/AugmentedSteam/_types";
    import {
        __pricing_ggdeals,
        __pricing_historicalLow,
        __pricing_keyshopLow,
        __pricing_keyshops,
        __pricing_official,
        __pricing_officialLow
    } from "@Strings/_strings";
    import {L} from "@Core/Localization/Localization";
    import Settings from "@Options/Data/Settings";
    import external from "@Content/externalLink";

    export let data: TGGDealsPriceOverview;
    export let marginTop: string|undefined = undefined;
    export let marginBottom: string|undefined = undefined;

    function toPrice(money: TGGDealsMoney): TPrice {
        return {
            amount: money.amount,
            amountInt: money.amountInt,
            currency: money.currency
        };
    }

    const showOfficial = Settings.showggdeals_official;
    const showKeyshops = Settings.showggdeals_keyshops;

    const currentRetail = showOfficial ? data.currentRetail : null;
    const currentKeyshops = showKeyshops ? data.currentKeyshops : null;
    const historicalRetail = showOfficial ? data.historicalRetail : null;
    const historicalKeyshops = showKeyshops ? data.historicalKeyshops : null;

    const cheapestCurrent = (currentRetail && currentKeyshops)
        ? (currentKeyshops.amount < currentRetail.amount ? "keyshops" : "official")
        : (currentKeyshops ? "keyshops" : (currentRetail ? "official" : null));

    const hasRows = Boolean(currentRetail || currentKeyshops || historicalRetail || historicalKeyshops);
</script>


{#if hasRows}
<div class="ggdeals-pricing" style:margin-top={marginTop} style:margin-bottom={marginBottom}>
    {#if currentRetail}
        <a href={data.url} use:external>{L(__pricing_official)}</a>
        <span class="ggdeals-pricing__price" class:is-best={cheapestCurrent === "official"}>
            <PriceWithAlt price={toPrice(currentRetail)} />
        </span>
        <a href={data.url} class="ggdeals-pricing__main" use:external>{L(__pricing_ggdeals)}</a>
    {/if}

    {#if currentKeyshops}
        <a href={data.url} use:external>{L(__pricing_keyshops)}</a>
        <span class="ggdeals-pricing__price" class:is-best={cheapestCurrent === "keyshops"}>
            <PriceWithAlt price={toPrice(currentKeyshops)} />
        </span>
        <a href={data.url} class="ggdeals-pricing__main" use:external>{L(__pricing_ggdeals)}</a>
    {/if}

    {#if historicalRetail}
        <a href={data.url} use:external>{L(__pricing_officialLow)}</a>
        <span class="ggdeals-pricing__price">
            <PriceWithAlt price={toPrice(historicalRetail)} />
        </span>
        <div class="ggdeals-pricing__main">{L(__pricing_historicalLow)}</div>
    {/if}

    {#if historicalKeyshops}
        <a href={data.url} use:external>{L(__pricing_keyshopLow)}</a>
        <span class="ggdeals-pricing__price">
            <PriceWithAlt price={toPrice(historicalKeyshops)} />
        </span>
        <div class="ggdeals-pricing__main">{L(__pricing_historicalLow)}</div>
    {/if}
</div>
{/if}


<style>
    a {
        color: white;
        text-decoration: none;
    }
    a:hover {
        color: #66c0f4;
    }

    .ggdeals-pricing {
        padding: 5px 5px 5px 42px;
        height: auto !important;
        border-bottom: 0;
        font-size: 12px;
        color: #a8b2ba;
        background-image: url("extension://img/ggdeals.png");
        background-color: rgba(0, 0, 0, 0.2);
        background-repeat: no-repeat;
        background-position: 9px center;
        background-size: 24px;
        display: grid;
        grid-template-columns: min-content min-content auto;
        grid-column-gap: 10px;
        white-space: nowrap;
        line-height: 1.5;
        align-items: baseline;
    }
    .ggdeals-pricing__main {
        white-space: normal;
    }
    .ggdeals-pricing__price {
        font-size: 1.1em;
        color: #acdbf5;
        text-align: right;
    }
    .ggdeals-pricing__price.is-best {
        color: #a4d007;
        font-weight: 700;
    }
</style>
