import zooplaAdapter from "../adapters/zoopla";
import Zoopla from "../config/zoopla";
import rightMoveAdapter from "../adapters/rightMove";
import RightMove from "../config/rightMove";

const adapters = [{
    adapter: zooplaAdapter,
    config: Zoopla,
}, {
    adapter: rightMoveAdapter,
    config: RightMove,
}]

const enabledAdapters = adapters.filter((adapter) => adapter.config.enabled)
export default enabledAdapters
