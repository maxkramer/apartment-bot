import {DisplayPrice} from "./models";

export const parseMoneyFromDisplayPrice = (price: DisplayPrice): number => {
    return parseInt(price.displayPrice.replaceAll(/\D/g, ''))
}
