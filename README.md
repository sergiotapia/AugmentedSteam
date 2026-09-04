[![Banner](.github/banner.png)](https://augmentedsteam.com/)

[![Chrome users](https://img.shields.io/chrome-web-store/users/dnhpnfgdlenaccegplpojghhmaamnnfp?label=Chrome%20users&logo=googlechrome)](https://chrome.google.com/webstore/detail/augmented-steam/dnhpnfgdlenaccegplpojghhmaamnnfp)
[![Firefox users](https://img.shields.io/amo/users/augmented-steam?label=Firefox%20users&color=4c1&logo=firefoxbrowser)](https://addons.mozilla.org/firefox/addon/augmented-steam/)
[![Edge users](https://img.shields.io/badge/dynamic/json?label=Edge%20users&query=%24.activeInstallCount&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/dnpjkgmekpilchdgolfifobohlohlioc&logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/augmented-steam/dnpjkgmekpilchdgolfifobohlohlioc)

[![Discord](https://img.shields.io/discord/301903094080339968?label=Discord&logo=discord)](https://discord.gg/yn57q7f)

This is an **unofficial fork** of [Augmented Steam](https://github.com/IsThereAnyDeal/AugmentedSteam). It keeps the original IsThereAnyDeal authorized-store prices and adds **GG.deals** official + keyshop prices on Steam store pages.

It is not affiliated with IsThereAnyDeal or GG.deals. Load this instead of store Augmented Steam (do not run both).

### GG.deals prices

IsThereAnyDeal only tracks authorized stores, so Augmented Steam cannot show G2A / Eneba / Instant Gaming / etc. This fork calls the [GG.deals Prices API](https://gg.deals/api/prices/) and shows:

- Official current / historical low
- Keyshop current / historical low (optional)

**You need a free personal API key:**

1. Create an account at [gg.deals](https://gg.deals/)
2. Generate a key at [gg.deals/api](https://gg.deals/api/)
3. Paste it in the extension options → **Price** → GG.deals

The key stays in browser storage and is only sent to `api.gg.deals`. Keyshops can sell region-locked or ToS-risky keys; ITAD remains the safer authorized-store source.

### Load unpacked

```
npm install
npm run build chrome    # or: npm run build firefox
```

Chrome: `chrome://extensions` → Developer mode → Load unpacked → `dist/dev.chrome`  
Firefox: `about:debugging` → This Firefox → Load Temporary Add-on → `dist/dev.firefox/manifest.json`

---

## Development Setup

Run `npm install` to install the required packages.

### Building

**Development build:**
Run `npm run build firefox` or `npm run build chrome`

**Production build:**
Run `npm run build firefox -- --production` or `npm run build chrome -- --production`

> *Note:* Run `npm run build -- --help` to see all available build options

## License

Enhanced Steam is Copyright 2012-2018 Jason Shackles.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License v3 or newer as published by the Free Software Foundation.  A copy of the GNU General Public License v3 can be found in [LICENSE](LICENSE) or at https://www.gnu.org/licenses/gpl-3.0.html.
