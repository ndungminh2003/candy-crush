import { ImageConstructor } from '../interfaces/image.interface'

export class Tile extends Phaser.GameObjects.Image {
    private isSelect: boolean = false
    private tweenSelected: Phaser.Tweens.Tween
    private isCombine4: boolean = false
    private isCombine5: boolean = false

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

    public explode3(): void {
        const explode3 = this.scene.add.particles(this.x, this.y, 'flare', {
            lifespan: 4000,
            speed: { min: 250, max: 500 },
            scale: { start: 0.4, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false,
        })

        explode3.explode(15)
    }

    public enableCombine4(): void {
        this.isCombine4 = true

        // if (this.isCombine4) {
        //     this.scene.add
        //         .particles(this.x, this.y, 'flare', {
        //             frame: 'white',
        //             color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        //             colorEase: 'quad.out',
        //             lifespan: 1000,
        //             angle: { min: -100, max: -80 },
        //             scale: { start: 0.7, end: 0, ease: 'sine.out' },
        //             speed: 100,
        //             advance: 2000,
        //             blendMode: 'ADD',
        //         })
        //         .startFollow(this, -this.x, -this.y).setDepth(-1)
        // }

        this.particleCombine4 = this.scene.add
            .particles(this.x, this.y, 'flare', {
                color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
                colorEase: 'quad.out',
                lifespan: 1000,
                angle: { min: -100, max: -80 },
                scale: { start: 0.7, end: 0, ease: 'sine.out' },
                speed: 100,
                advance: 2000,
                blendMode: 'ADD',
            })
            .startFollow(this, -this.x, -this.y)
            .setDepth(-1)
    }

    public enableCombine5(): void {
        this.isCombine5 = true

        // if (this.isCombine5) {
        //     this.scene.add
        //         .particles(this.x, this.y, 'flare', {
        //             frame: 'white',
        //             color: [0xff69b4, 0x0000ff],
        //             colorEase: 'quad.out',
        //             lifespan: 1000,
        //             angle: { min: -100, max: -80 },
        //             scale: { start: 0.7, end: 0, ease: 'sine.out' },
        //             speed: 100,
        //             advance: 2000,
        //             blendMode: 'ADD',
        //         })
        //         .startFollow(this, -this.x, -this.y)
        //         .setDepth(-1)
        // }

        this.particleCombine4 = this.scene.add
            .particles(this.x, this.y, 'flare', {
                color: [0xff69b4, 0x0000ff],
                colorEase: 'quad.out',
                lifespan: 1000,
                angle: { min: -100, max: -80 },
                scale: { start: 0.7, end: 0, ease: 'sine.out' },
                speed: 100,
                advance: 2000,
                blendMode: 'ADD',
            })
            .startFollow(this, -this.x, -this.y)
            .setDepth(-1)
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
