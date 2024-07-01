import { ImageConstructor } from '../interfaces/image.interface'
import { CONST } from '../const/const'

export class Tile extends Phaser.GameObjects.Image {
    private isSelect: boolean = false
    private tweenSelected: Phaser.Tweens.Tween
    private isCombine4: boolean = false
    private isCombine5: boolean = false
    private point : number
    private isActive : boolean
   

    private particleCombine4: Phaser.GameObjects.Particles.ParticleEmitter
    private particleCombine5: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(params: ImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)

        // set image settings
        this.init()
    }

    private init(): void {
        this.setOrigin(0.5, 0.5)
        this.setInteractive()
        this.scene.add.existing(this)
        
        this.isActive = true

        this.tweenSelected = this.scene.add.tween({
            targets: this,
            angle: 360,
            yoyo: true,
            loop: -1,
        })

        this.point = 2

        this.tweenSelected.pause()

        this.particleCombine4 = this.scene.add
            .particles(this.x, this.y, 'flare', {
                color: [0x8a2be2, 0x9400d3, 0x9932cc, 0x4b0082],
                colorEase: 'quad.out',
                lifespan: 1500,
                angle: { min: -120, max: -60 },
                scale: { start: 0.9, end: 0, ease: 'expo.out' },
                speed: { min: 150, max: 200 },
                quantity: 5,
                frequency: 100,
                blendMode: 'ADD',
                emitting: false,
            })
            .startFollow(this, -this.x, -this.y)
            .setDepth(-1)

        this.particleCombine5 = this.scene.add
            .particles(this.x, this.y, 'flare', {
                color: [0x00ff00, 0x32cd32, 0x98fb98, 0xadff2f],
                colorEase: 'quad.out',
                lifespan: 1500,
                angle: { min: -120, max: -60 },
                scale: { start: 0.9, end: 0, ease: 'expo.out' },
                speed: { min: 150, max: 200 },
                quantity: 5,
                frequency: 100,
                blendMode: 'ADD',
                emitting: false,
            })
            .startFollow(this, -this.x, -this.y)
            .setDepth(-1)
    }

    public getPoint() : number {
        return this.point
    }

    public setIsActive (value : boolean) : void {
        this.isActive = value
    }

    public getIsActive() : Boolean {
        return this.isActive
    }

    public getSelected(): void {
        if (!this.isSelect && this.isActive) {
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

    public explode3(): void {
        const explode3 = this.scene.add.particles(this.x, this.y, 'flare', {
            speed: { min: -50, max: 50 },
            lifespan: 600,
            blendMode: 'ADD',
            scale: { start: 0.2, end: 0 },
            gravityY: 50,
            alpha: { start: 1, end: 0 },
            emitZone: {
                source: new Phaser.Geom.Rectangle(
                    -CONST.tileWidth / 2,
                    -CONST.tileHeight / 2,
                    64,
                    72
                ),
                type: 'edge',
                quantity: 30,
                total: 120,
            },
        })

        explode3.explode(30)
    }

    public enableCombine4(): void {
        this.isCombine4 = true
        this.particleCombine4.start()
    }

    public enableCombine5(): void {
        this.isCombine5 = true
        this.particleCombine5.start()
    }

    public disableCombine4(): void {
        this.isCombine4 = false
        if (this.particleCombine4) {
            this.particleCombine4.stop()
        }
    }

    public disableCombine5(): void {
        this.isCombine5 = false
        if (this.particleCombine5) {
            this.particleCombine5.stop()
        }
    }

    public getParticleCombine4(): Phaser.GameObjects.Particles.ParticleEmitter {
        return this.particleCombine4
    }

    public getParticleCombine5(): Phaser.GameObjects.Particles.ParticleEmitter {
        return this.particleCombine5
    }

    public getIsCombine4(): boolean {
        return this.isCombine4
    }

    public getIsCombine5(): boolean {
        return this.isCombine5
    }
}
