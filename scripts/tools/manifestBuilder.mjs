import manifest from "./manifest.mjs";

export default class ManifestBuilder {

    constructor() {
        this._manifest = structuredClone(manifest);
    }

    version(version) {
        this._manifest.version = version;
    }

    contentScript(script) {
        let {matches, excludes, js, css, run_at, world} = script;

        if (!Array.isArray(matches) || matches.length === 0) {
            return;
        }

        if (!this._manifest.content_scripts) {
            this._manifest.content_scripts = [];
        }

        this._manifest.content_scripts.push({
            matches: script.matches,
            exclude_matches: excludes && Array.isArray(excludes) && excludes.length > 0
                ? excludes
                : undefined,
            js: js && Array.isArray(js) && js.length > 0
                ? js
                : undefined,
            css: css && Array.isArray(css) && css.length > 0
                ? css
                : undefined,
            run_at,
            world
        })
    }

    build(options) {
        let {dev, browser} = options;

        // Fork: do not reuse the official Chrome signing key so this can be loaded
        // unpacked next to (or instead of) store Augmented Steam.

        if (browser === "chrome" || browser === "edge") {
            this._manifest.permissions.push("offscreen");
            this._manifest.background.service_worker = "js/background.js";
        }

        if (browser === "firefox") {
            this._manifest.browser_specific_settings = {
                gecko: {
                    id: "{7e4a2c91-0b5d-4f18-9c3a-a6d8e21b4c77}",
                    strict_min_version: "140.0",
                    data_collection_permissions: {
                        required: ["none"],
                        optional: [
                            "websiteContent"
                        ]
                    }
                }
            };

            this._manifest.background.scripts = ["js/background.js"];
        }

        return this._manifest;
    }
}
