import { Tile } from './Tile'
import { CONST } from '../const/const'
import { TilePool } from './TilePool'

const emit4Direction = [
    { y: -1, x: -1 },
    { y: -1, x: 0 },
    { y: -1, x: 1 },
    { y: 0, x: -1 },
    { y: 0, x: 0 },
    { y: 0, x: 1 },
    { y: 1, x: -1 },
    { y: 1, x: 0 },
    { y: 1, x: 1 },
]

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

        if (tile.getIsCombine4()) {
            this.emit4(tile)
            return
        } else if (tile.getIsCombine5()) {
            this.emit5(tile)
            return
        } else {
            this.emit3(tile)
            return
        }
    }

    public emit4(tile: Tile): void {
        if (tile === undefined) return

        let pos = this.getTilePos(this.tileGrid!, tile)

        this.emit3(tile)
        tile.disableCombine4()

        if (pos.x === -1 || pos.y === -1) return

        for (let i = 0; i < emit4Direction.length; i++) {
            let y = pos.y + emit4Direction[i].y
            let x = pos.x + emit4Direction[i].x

            if (y < 0 || y >= CONST.gridRows || x < 0 || x >= CONST.gridColumns) continue

            let tile = this.tileGrid![y][x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }
    }

    public emit5(tile: Tile): void {
        let pos = this.getTilePos(this.tileGrid!, tile)

        if (pos.x === -1 || pos.y === -1) return

        this.emit3(tile)
        tile.disableCombine5()

        // remove left
        for (let x = pos.x - 1; x >= 0; x--) {
            let tile = this.tileGrid![pos.y][x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }

        // remove right
        for (let x = pos.x + 1; x < CONST.gridColumns; x++) {
            let tile = this.tileGrid![pos.y][x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }

        // remove top
        for (let y = pos.y - 1; y >= 0; y--) {
            let tile = this.tileGrid![y][pos.x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }

        // remove bottom
        for (let y = pos.y + 1; y < CONST.gridRows; y++) {
            let tile = this.tileGrid![y][pos.x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }
    }

    public emit3(tile: Tile): void {
        if (tile === undefined) return

        let tilePos = this.getTilePos(this.tileGrid!, tile)

        tile.explode3()
        TilePool.getInstance(this.scene).returnTile(tile)
        this.tileGrid![tilePos.y][tilePos.x] = undefined
    }


}
