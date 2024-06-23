import { Tile } from './Tile'
import { CONST } from '../const/const'


export class TileGrid extends Phaser.GameObjects.Container {
    private tileGrid: Array<Array<Tile | undefined>> | undefined


    constructor(scene: Phaser.Scene) {
        super(scene)

        this.init()
    }

    private init(): void {

        // initialize the gird
        this.tileGrid = []
        for (let y = 0; y < CONST.gridRows; y++) {
            this.tileGrid[y] = []
            for (let x = 0; x < CONST.gridColumns; x++) {
                this.tileGrid[y][x] = this.addTile(x, y)
            }
        }
    }

    public addTile(x: number, y: number): Tile {
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

    public getTileGrid(): Array<Array<Tile | undefined>> | undefined {
        return this.tileGrid
    }
}
