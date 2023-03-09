import openRentAdapter from "../adapters/openrent";
import OpenRent from "./openRent";
import zooplaAdapter from "../adapters/zoopla";
import Zoopla from "./zoopla";

const adapters = [{
    adapter: openRentAdapter,
    config: OpenRent,
    enabled: true
}, {
    adapter: zooplaAdapter,
    config: Zoopla,
    enabled: true
}]

export default adapters
