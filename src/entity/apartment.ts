import {Column, CreateDateColumn, Entity, Index, Point, PrimaryGeneratedColumn} from "typeorm";
import {IsUrl} from "class-validator";
import Prices from "./prices";

@Index(["adapterName", "externalId"], {unique: true})
@Entity()
export default class Apartment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Index()
    @Column()
    externalId: string

    @Column("text")
    title: string

    @Column("text")
    description: string

    @Column("text")
    address: string

    @Column("point", {
        // https://github.com/typeorm/typeorm/issues/2896#issuecomment-428320387
        transformer: {
            from: v => v,
            to: v => v ? v.coordinates.join(',') : undefined
        }
    })
    location: Point

    @Column(() => Prices)
    prices: Prices

    @Column()
    image?: string

    @Column()
    @IsUrl()
    url: string

    @Column()
    @IsUrl()
    messageUrl: string

    @Column({length: 20})
    adapterName: string

    @CreateDateColumn()
    createdAt: Date

    @Column()
    publishedOn?: Date
}
