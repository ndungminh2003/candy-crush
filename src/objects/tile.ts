import { ImageConstructor } from '../interfaces/image.interface'

export class Tile extends Phaser.GameObjects.Image {
    private isSelect: boolean = false
    private tweenSelected: Phaser.Tweens.Tween

    constructor(params: ImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)

        // set image settings
        this.init()
    }

    private init(): void {
        this.setOrigin(0.5, 0.5)
        this.setInteractive()
        this.scene.add.existing(this)

        this.tweenSelected = this.scene.add.tween({
            targets: this,
            angle: 360,
            yoyo: true,
            loop: -1,
        })

        this.tweenSelected.pause()
    }

    public getSelected(): void {
        if (!this.isSelect) {
            this.tweenSelected.play()
        }
        this.isSelect = true
    }

    public getDeselected(): void {
        if (this.isSelect) {
            this.tweenSelected.pause()
            this.angle = 0
            this.isSelect = false
        }
    }
}
