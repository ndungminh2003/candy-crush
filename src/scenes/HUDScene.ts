import { Level } from '../objects/Level'

export class HUDScene extends Phaser.Scene {
    private progressBar: Phaser.GameObjects.Graphics
    private progressBox: Phaser.GameObjects.Graphics
    private progressValue: number
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private scoreText: Phaser.GameObjects.Text
    private targetText: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'HUDScene' })
    }

    create(): void {
        // Progress box with rounded corners
        this.progressBox = this.add.graphics()
        this.progressBox.fillStyle(0xFF4500, 0.8)
        this.progressBox.fillRect(600, 100, 320, 40) // Rounded corners

        // Progress bar
        this.progressBar = this.add.graphics()
        this.progressValue = 0

        // Score text
        this.scoreText = this.add.text(600, 70, 'Score: 0', { fontFamily: 'Verdana', fontSize: '20px', color: '#ffffff' })

        // Target text
        this.targetText = this.add.text(600, 45, 'Target: 320', { fontFamily: 'Verdana', fontSize: '20px', color: '#ffffff' })

        // Create particle emitter
        this.emitter = this.add.particles(0, 0, 'flare', {
            speed: { min: -100, max: 100 },
            color: [ 0x7f7f7f , 0x6f6f6f , 0x8f8f8f , 0x5f5f5f, 0x707070 ],
            scale: { start: 0.1, end: 0 },
            blendMode: 'ADD',
            lifespan: 600,
            emitZone: {
                source: new Phaser.Geom.Rectangle(0, -18, 1, 40),
                type: 'edge',
                quantity: 20,
            },
        })

        this.updateProgressBar(this.progressValue)
    }

    updateProgressBar(value: number): void {
        this.add.tween({
            targets: this,
            progressValue: value,
            ease: 'Linear',
            duration: 200,
            onUpdate: () => {
                this.progressBar.clear()
                this.progressBar.fillStyle(0xFFA500, 1)
                this.progressBar.fillRect(600, 100, this.progressValue, 40) // Rounded corners

                // Update particle emitter position to the right side of the progress bar
                const progressBarRightEdge = 600 + this.progressValue
                this.emitter.setPosition(progressBarRightEdge, 120)

                // Update score text
                this.scoreText.setText(`Score: ${Level.getInstance(this).getExp()}`)

                // Update target text (assuming a fixed target value for demonstration)
                const targetScore = 320
                this.targetText.setText(`Target: ${targetScore}`)
            },
        })
    }

    setProgress(value: number): void {
        this.updateProgressBar(value)
    }

    update(time: number, delta: number): void {
        Level.getInstance(this).update(time, delta)
        this.setProgress(Level.getInstance(this).getExp())
    }
}
