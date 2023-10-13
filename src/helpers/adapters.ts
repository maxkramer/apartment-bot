import zooplaAdapter from "../adapters/zoopla";
import Zoopla from "../config/zoopla";
import rightMoveAdapter from "../adapters/rightMove";
import RightMove from "../config/rightMove";
import ImmoScout from "../config/immoscout";
import immoScoutAdapter from "../adapters/immoscout";

const adapters = [{
    adapter: zooplaAdapter,
    config: Zoopla,
}, {
    adapter: rightMoveAdapter,
    config: RightMove,
}, {
    adapter: immoScoutAdapter,
    config: ImmoScout
}]

const enabledAdapters = adapters.filter((adapter) => adapter.config.enabled)
export default enabledAdapters
