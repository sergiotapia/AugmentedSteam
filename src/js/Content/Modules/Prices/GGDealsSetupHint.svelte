<script lang="ts">
    import {L} from "@Core/Localization/Localization";
    import {__options_ggdeals_setupHint, __thewordoptions} from "@Strings/_strings";
    import ExtensionResources from "@Core/ExtensionResources";
    import external from "@Content/externalLink";

    const optionsUrl = ExtensionResources.getURL("html/options.html") + "#price";
</script>


<div class="ggdeals-pricing ggdeals-pricing--hint">
    <span>{L(__options_ggdeals_setupHint)}</span>
    <a href={optionsUrl} use:external>{L(__thewordoptions)}</a>
</div>


<style>
    .ggdeals-pricing {
        padding: 5px 5px 5px 42px;
        font-size: 12px;
        color: #a8b2ba;
        background-image: url("extension://img/ggdeals.png");
        background-color: rgba(0, 0, 0, 0.2);
        background-repeat: no-repeat;
        background-position: 9px center;
        background-size: 24px;
        display: flex;
        gap: 8px;
        align-items: center;
        line-height: 1.5;
    }
    a {
        color: #66c0f4;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
