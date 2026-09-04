import type CWishlist from "@Content/Features/Store/Wishlist/CWishlist";
import Feature from "@Content/Modules/Context/Feature";
import GGDealsPrices from "@Content/Modules/Prices/GGDealsPrices";
import GGDealsPriceOverview from "@Content/Modules/Prices/GGDealsPriceOverview.svelte";
import Settings from "@Options/Data/Settings";
import type {TGGDealsPriceOverview} from "@Background/Modules/GGDeals/_types";

export default class FWishlistGGDealsPrices extends Feature<CWishlist> {

    private loader: GGDealsPrices|undefined;
    private cached: Map<number, TGGDealsPriceOverview|null> = new Map();
    private chunks: Array<number[]> = [];
    private promises: Map<number, Promise<void>> = new Map();

    private currentHoverNode: Element|null = null;
    private currentHoverAppid: number|null = null;
    private currentElement: GGDealsPriceOverview|null = null;

    override checkPrerequisites(): boolean {
        return Settings.showggdeals_onwishlist && Settings.ggdeals_api_key.trim().length > 0;
    }

    override apply(): void {
        this.loader = new GGDealsPrices(this.context.user);

        const ChunkSize = 40;
        const appids = this.context.wishlistData.map(({appid}) => appid);
        this.chunks = [];
        for (let i = 0; i < appids.length; i += ChunkSize) {
            this.chunks.push(appids.slice(i, i + ChunkSize));
        }

        document.body.addEventListener("mouseover", e => {
            const dom = this.context.dom;
            const node = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");

            if (this.currentHoverNode === node) {
                return;
            }
            this.currentHoverNode = node;

            if (!node) {
                this.currentHoverAppid = null;
                this.detachPrice();
                return;
            }

            const appid = dom.appid(dom.titleNode(node)!)!.number;
            if (appid === this.currentHoverAppid) {
                return;
            }

            this.currentHoverAppid = appid;
            this.attachPrice(node, appid);
        });
    }

    private async attachPrice(node: HTMLElement, appid: number): Promise<void> {
        if (!this.cached.has(appid)) {
            for (let i = 0; i < this.chunks.length; i++) {
                const chunk = this.chunks[i]!;
                if (chunk.includes(appid)) {
                    let promise: Promise<void>|undefined = this.promises.get(i);

                    if (!promise) {
                        promise = (async () => {
                            const {prices} = await this.loader!.load({apps: chunk});
                            for (const {id, data} of prices) {
                                this.cached.set(id, data);
                            }
                            for (const chunkAppid of chunk) {
                                if (!this.cached.has(chunkAppid)) {
                                    this.cached.set(chunkAppid, null);
                                }
                            }
                        })();
                        this.promises.set(i, promise);
                    }
                    await promise;
                    break;
                }
            }

            if (appid !== this.currentHoverAppid) {
                return;
            }
        }

        this.detachPrice();
        const data = this.cached.get(appid);

        if (data && this.currentHoverAppid === appid) {
            const margin = window.getComputedStyle(this.context.dom.gameNode(node)).marginBottom;
            const itadShown = Settings.showlowestprice_onwishlist;
            this.currentElement = new GGDealsPriceOverview({
                target: node,
                props: {
                    data,
                    marginTop: itadShown ? "0" : `-${margin}`,
                    marginBottom: margin
                }
            });
        }
    }

    private detachPrice(): void {
        this.currentElement?.$destroy();
        this.currentElement = null;
    }
}
