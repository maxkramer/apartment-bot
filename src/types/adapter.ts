import Config from "./config";
import {Apartment} from "../entity";
import {BrowserContext} from "playwright-core";

type Adapter = {
    fetchAll: (config: Config, browser: BrowserContext) => Promise<Array<Apartment>>
}

export default Adapter
