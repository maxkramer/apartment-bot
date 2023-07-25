import {Column} from "typeorm";
import {IsIn, IsPositive} from "class-validator";
import * as cc from 'currency-codes'

export default class Prices {
    @Column()
    @IsPositive()
    monthly: number

    @Column()
    @IsPositive()
    weekly: number

    @Column({length: 3})
    @IsIn(cc.codes())
    currency: string
}
