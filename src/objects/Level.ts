export class Level {
    private static instance: Level
    private level: number
    private exp: number = 0

    constructor(scene: Phaser.Scene) {
        this.level = 1
    }

    public static getInstance(scene: Phaser.Scene): Level {
        if (!Level.instance) {
            Level.instance = new Level(scene)
        }
        return Level.instance
    }

    public levelUp(): void {
        this.level++
    }

    public getLevel(): number {
        return this.level
    }

    public getExp(): number {
        return this.exp
    }

    public addExp(exp: number): void {
        this.exp += exp
        if (this.exp >= 100 * this.level) {
            this.levelUp()
            this.exp = 0
        }
    }

}
