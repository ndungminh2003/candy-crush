import { Tile } from './Tile'
import { CONST } from '../const/const'
import { TilePool } from './TilePool'

export class TileGrid extends Phaser.GameObjects.Container {
    private tileGrid: Array<Array<Tile | undefined>> | undefined
    private idleTween: Phaser.Tweens.Tween | undefined

    constructor(scene: Phaser.Scene) {
        super(scene)

        this.init()
    }

    private init(): void {
        // initialize the grid
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

    public playIdleAnimation(): void {
        if (this.idleTween) return // Prevent multiple tweens

        let i = 0

        let children = this.tileGrid!.flat().filter((tile) => tile !== undefined) as Tile[]

        children.forEach((child) => {
            this.scene.tweens.add({
                targets: child,
                scale: 1.2,
                ease: 'sine.inout',
                duration: 300,
                delay: i * 50,
                repeat: 0,
                yoyo: true,
                repeatDelay: 500,
            })

            i++
            if (i % 12 === 0) {
                i = 0
            }
        })
    }

    public stopIdleAnimation(): void {
        if (this.idleTween) {
            this.idleTween.stop()
            this.idleTween = undefined
        }
    }

    private getTilePos(tileGrid: (Tile | undefined)[][], tile: Tile): any {
        let pos = { x: -1, y: -1 }

        //Find the position of a specific tile in the grid
        for (let y = 0; y < tileGrid.length; y++) {
            for (let x = 0; x < tileGrid[y].length; x++) {
                //There is a match at this position so return the grid coords
                if (tile === tileGrid[y][x]) {
                    pos.x = x
                    pos.y = y
                    break
                }
            }
        }

        return pos
    }

    public handleExplode(tile: Tile): void {
        if (tile === undefined) return

        this.emit3(tile)
    }

    public emit4(tile: Tile): void {
        let pos = this.getTilePos(this.tileGrid!, tile)

        //Explode the tile
        tile.enableCombine4()

        //Remove the tile from the grid
        this.tileGrid![pos.y][pos.x] = undefined
    }

    public emit5(tile: Tile): void {}

    public emit3(tile: Tile): void {
        let tilePos = this.getTilePos(this.tileGrid!, tile)

        tile.explode3()
        TilePool.getInstance(this.scene).returnTile(tile)
        this.tileGrid![tilePos.y][tilePos.x] = undefined
    }
}
