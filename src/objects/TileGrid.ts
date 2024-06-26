import { Tile } from './Tile'
import { CONST } from '../const/const'

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

        let children = this.tileGrid!.flat().filter(tile => tile !== undefined) as Tile[]

        children.forEach(child => {
            this.scene.tweens.add({
                targets: child,
                scale: 1.2,
                ease: 'sine.inout',
                duration: 300,
                delay: i * 50,
                repeat: 0,
                yoyo: true,
                repeatDelay: 500
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



}
