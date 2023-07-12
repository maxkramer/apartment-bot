import openRentAdapter from "../adapters/openrent";
import OpenRent from "../config/openRent";
import zooplaAdapter from "../adapters/zoopla";
import Zoopla from "../config/zoopla";
import rightMoveAdapter from "../adapters/rightMove";
import RightMove from "../config/rightMove";

const adapters = [{
    adapter: openRentAdapter,
    config: OpenRent,
}, {
    adapter: zooplaAdapter,
    config: Zoopla,
}, {
    adapter: rightMoveAdapter,
    config: RightMove,
}]

export default adapters
