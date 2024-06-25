import { Tile } from './Tile'
import { CONST } from '../const/const'

export class TilePool {
    private static instance: TilePool
    private pool: Tile[]
    private scene: Phaser.Scene

    private constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.init()
    }

    private init(): void {
        this.pool = []
    }

    public static getInstance(scene: Phaser.Scene): TilePool {
        if (!TilePool.instance) {
            TilePool.instance = new TilePool(scene)
        }
        return TilePool.instance
    }

    public getTile(x: number, y: number): Tile {

        console.log(this.pool.length)
        if (this.pool.length > 0) {
            console.log('pooled tile')
            let tile = this.pool.pop() as Tile
            tile.setVisible(true)
            tile.setTexture(
                CONST.candyTypes[Phaser.Math.RND.between(0, CONST.candyTypes.length - 1)]
            )
            tile.setPosition(
                x * CONST.tileWidth + CONST.tileWidth / 2,
                y * CONST.tileHeight + CONST.tileHeight / 2
            )
            console.log(tile)
            return tile
        }

        console.log('new tile')
        let randomTileType: string =
            CONST.candyTypes[Phaser.Math.RND.between(0, CONST.candyTypes.length - 1)]

        return new Tile({
            scene: this.scene,
            x: x * CONST.tileWidth + CONST.tileWidth / 2,
            y: y * CONST.tileHeight + CONST.tileHeight / 2,
            texture: randomTileType,
        })

        
    }

    public returnTile(tile: Tile): void {
        tile.setPosition(-1, -1)
        tile.setVisible(false)
        this.pool.push(tile)
    }

    public getPool(): Tile[] {
        return this.pool
    }

    public clear(): void {
        this.pool = []
    }
}
