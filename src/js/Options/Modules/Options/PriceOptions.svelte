<script lang="ts">
    import {L} from "@Core/Localization/Localization";
    import {
        __options_ggdeals_apiKey,
        __options_ggdeals_apiKeyHelp,
        __options_ggdeals_apiKeyPlaceholder,
        __options_ggdeals_keyshopWarning,
        __options_ggdeals_region,
        __options_ggdeals_regionAuto,
        __options_ggdeals_show,
        __options_ggdeals_showKeyshops,
        __options_ggdeals_showOfficial,
        __options_ggdeals_showWishlist,
        __options_headers_ggdealsPriceInfo,
        __options_headers_itadPriceInfo,
        __options_lowestprice,
        __options_lowestpriceCoupon,
        __options_lowestpriceOnwishlist,
        __options_price_restorePriceCut,
        __options_regionalPrice,
    } from "@Strings/_strings";
    import {GGDealsRegions} from "@Background/Modules/GGDeals/_types";
    import Config from "config";
    import {type Writable, writable} from "svelte/store";
    import Settings from "../../Data/Settings";
    import Section from "./Components/Section.svelte";
    import Toggle from "./Components/Toggle.svelte";
    import RegionSelect from "./Settings/RegionSelect.svelte";
    import StoreList from "./Settings/StoreListSetting.svelte";
    import type {SettingsSchema} from "../../Data/_types";
    import OverridePriceSetting from "./Settings/OverridePriceSetting.svelte";
    import OptionGroup from "./Components/OptionGroup.svelte";
    import Select from "./Components/Select.svelte";

    let settings: Writable<SettingsSchema> = writable(Settings);

    const regionOptions: Array<[string, string]> = [
        ["auto", L(__options_ggdeals_regionAuto)],
        ...GGDealsRegions.map(region => <[string, string]>[region, region.toUpperCase()])
    ];
</script>


<Section>
    <OptionGroup>
        <Toggle bind:value={$settings.restore_price_cut}>{L(__options_price_restorePriceCut)}</Toggle>
    </OptionGroup>
</Section>

<Section title={L(__options_headers_itadPriceInfo)}>
    <OptionGroup>
        <Toggle bind:value={$settings.showlowestprice}>{L(__options_lowestprice)}</Toggle>
        <Toggle bind:value={$settings.showlowestprice_onwishlist}>{L(__options_lowestpriceOnwishlist)}</Toggle>
    </OptionGroup>

    <OptionGroup>
        <Toggle bind:value={$settings.showlowestpricecoupon}>{L(__options_lowestpriceCoupon)}</Toggle>
    </OptionGroup>

    <OptionGroup>
        <StoreList {settings} />
    </OptionGroup>

    <OptionGroup>
        <OverridePriceSetting {settings} />
    </OptionGroup>
</Section>

<Section title={L(__options_headers_ggdealsPriceInfo)}>
    <OptionGroup>
        <Toggle bind:value={$settings.showggdeals}>{L(__options_ggdeals_show)}</Toggle>
        <Toggle bind:value={$settings.showggdeals_onwishlist}>{L(__options_ggdeals_showWishlist)}</Toggle>
    </OptionGroup>

    <OptionGroup>
        <Toggle bind:value={$settings.showggdeals_official}>{L(__options_ggdeals_showOfficial)}</Toggle>
        <Toggle bind:value={$settings.showggdeals_keyshops}>{L(__options_ggdeals_showKeyshops)}</Toggle>
    </OptionGroup>

    <OptionGroup>
        <p class="help">{L(__options_ggdeals_keyshopWarning)}</p>
    </OptionGroup>

    <OptionGroup>
        <label class="api-key">
            <span class="label">{L(__options_ggdeals_apiKey)}</span>
            <input class="inpt"
                   type="text"
                   spellcheck="false"
                   autocomplete="off"
                   placeholder={L(__options_ggdeals_apiKeyPlaceholder)}
                   bind:value={$settings.ggdeals_api_key} />
        </label>
        <p class="help">
            <a href={Config.GGDealsApiDocs} target="_blank" rel="noopener">gg.deals/api</a>
            — {L(__options_ggdeals_apiKeyHelp)}
        </p>
    </OptionGroup>

    <OptionGroup>
        <Select label={L(__options_ggdeals_region)} bind:value={$settings.ggdeals_region} options={regionOptions} />
    </OptionGroup>
</Section>

<Section title={L(__options_regionalPrice)}>
    <RegionSelect {settings} />
</Section>


<style>
    .help {
        margin: 4px 10px 0;
        font-size: 0.9em;
        color: var(--text-color);
        line-height: 1.4;
        max-width: 52em;
    }
    .api-key {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 5px 10px;
    }
    .api-key .inpt {
        width: 100%;
        max-width: 420px;
    }
    a {
        color: #66c0f4;
    }
</style>
