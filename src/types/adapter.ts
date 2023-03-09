import Config from "./config";
import Property from "./property";
import {BrowserContext} from "playwright-core";

type Adapter = {
    fetchProperties: (config: Config, browser: BrowserContext) => Promise<Array<Property>>
}

export default Adapter
