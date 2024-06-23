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
        //for each candy type, create a pool of 10 tiles
        for (let i = 0; i < CONST.candyTypes.length; i++) {
            for (let j = 0; j < 5; j++) {
                let tile = new Tile({
                    scene: this.scene,
                    x: -1,
                    y: -1,
                    texture: CONST.candyTypes[i],
                })
                tile.setVisible(false)
                this.pool.push(tile)
            }
        }
    }

    static getInstance(scene: Phaser.Scene): TilePool {
        if (!TilePool.instance) {
            TilePool.instance = new TilePool(scene)
        }
        return TilePool.instance
    }

    getTile(x: number, y: number): Tile {
        if (this.pool.length > 0) {
          //pick random tile from the pool
          let randomIndex = Phaser.Math.RND.between(0, this.pool.length - 1)
          let tile = this.pool[randomIndex]
          this.pool.splice(randomIndex, 1)
          console.log(tile.x, tile.y)
            // let tile = this.pool.pop() as Tile
            tile.setPosition(
                x * CONST.tileWidth + CONST.tileWidth / 2,
                y * CONST.tileHeight + CONST.tileHeight / 2
            )

            console.log(tile.x, tile.y)
            tile.setVisible(true)
            return tile
        }

        let randomTileType: string =
            CONST.candyTypes[Phaser.Math.RND.between(0, CONST.candyTypes.length - 1)]

        // Return the created tile
        return new Tile({
            scene: this.scene,
            x: x * CONST.tileWidth + CONST.tileWidth / 2,
            y: y * CONST.tileHeight + CONST.tileHeight / 2,
            texture: randomTileType,
        })
    }

    returnTile(tile: Tile): void {
        tile.setPosition(-1, -1)
        tile.setVisible(false)
        this.pool.push(tile)
    }

    clear(): void {
        this.pool = []
    }

    getPool(): Tile[] {
        return this.pool
    }
}
