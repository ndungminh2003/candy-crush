export class ParticleManager {
    private static instance: ParticleManager
    private scene: Phaser.Scene
    private confetti: Phaser.GameObjects.Particles.ParticleEmitter

    public static getInstance(scene: Phaser.Scene): ParticleManager {
        if (!ParticleManager.instance) {
            ParticleManager.instance = new ParticleManager(scene)
        }
        return ParticleManager.instance
    }

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.confetti = this.scene.add
            .particles(0, window.innerHeight - 300, 'confetti', {
                frame: [
                    '1.png',
                    '2.png',
                    '3.png',
                    '4.png',
                    '5.png',
                    '6.png',
                    '7.png',
                    '8.png',
                    '9.png',
                    '10.png',
                ],
                alpha: { min: 0.8, max: 1 },
                lifespan: 3000,
                angle: { min: -60, max: -30 },
                scale: { start: 0.3, end: 0 },
                speed: {
                    onEmit: (particle) => {
                        let num = -particle!.angle * 2 - 800
                        return Phaser.Math.RND.between(num - 200, num + 200)
                    },
                },
                rotate: {
                    onEmit: () => Phaser.Math.RND.between(0, 360),
                    onUpdate: (_particle: any, _key: any, t: number, value: number) =>
                        value + t * 4,
                },
                accelerationX: {
                    onEmit: () => -1000,
                    onUpdate: (particle: { velocityX: number }) =>
                        particle.velocityX >= 100 ? -1000 : 0,
                },
                accelerationY: {
                    onEmit: () => 1200,
                    onUpdate: (particle: { velocityY: number }) =>
                        particle.velocityY <= -100 ? 1200 : 0,
                },
                quantity: 1,
                gravityY: 600,
            })
            .setDepth(100)
    }

    public startConfetti(): void {
        this.confetti.explode(50) // Explode 50 particles
    }
}
