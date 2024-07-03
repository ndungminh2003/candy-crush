import { TileGrid } from '../objects/TileGrid'

export class GameScene extends Phaser.Scene {
    // Grid with tiles
    private tileGrid: TileGrid

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        this.add.image(0, 0, 'bg').setDepth(-2)

        this.tileGrid = new TileGrid(this)
    }

    update(time: number, delta: number) {
        this.tileGrid.update(time, delta)
    }
}
