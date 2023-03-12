import openRentAdapter from "../adapters/openrent";
import OpenRent from "./openRent";
import zooplaAdapter from "../adapters/zoopla";
import Zoopla from "./zoopla";
import rightMoveAdapter from "../adapters/rightMove";
import RightMove from "./rightMove";

const adapters = [{
    adapter: openRentAdapter,
    config: OpenRent,
    enabled: false
}, {
    adapter: zooplaAdapter,
    config: Zoopla,
    enabled: false
}, {
    adapter: rightMoveAdapter,
    config: RightMove,
    enabled: true
}]

export default adapters
