import {DisplayPrice} from "./listing";

export const parseMoneyFromDisplayPrice = (price: DisplayPrice): number => {
    return parseInt(price.displayPrice.replaceAll(/\D/g, ''))
}
