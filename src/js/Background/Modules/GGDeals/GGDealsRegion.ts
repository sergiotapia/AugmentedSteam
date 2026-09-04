import {GGDealsRegions, type TGGDealsRegion} from "./_types";

const EuFallback = new Set([
    "at", "bg", "hr", "cy", "cz", "ee", "gr", "hu", "lv", "lt",
    "lu", "mt", "pt", "ro", "sk", "si", "is", "li"
]);

function isGGDealsRegion(value: string): value is TGGDealsRegion {
    return (GGDealsRegions as readonly string[]).includes(value);
}

export function resolveGGDealsRegion(steamCountry: string|null|undefined, override: string): TGGDealsRegion {
    if (override && override !== "auto") {
        const region = override.toLowerCase();
        if (isGGDealsRegion(region)) {
            return region;
        }
    }

    const country = (steamCountry ?? "US").toLowerCase();
    if (isGGDealsRegion(country)) {
        return country;
    }
    if (EuFallback.has(country)) {
        return "eu";
    }
    return "us";
}
