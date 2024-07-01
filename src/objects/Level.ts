export class Level {
    private static instance: Level
    private exp: number = 0
    private goal: number = 320

    constructor(scene: Phaser.Scene) {
        
    }

    public static getInstance(scene: Phaser.Scene): Level {
        if (!Level.instance) {
            Level.instance = new Level(scene)
        }
        return Level.instance
    }

    public resetExp(): void {
        this.exp = 0
    }

    public getExp(): number {
        return this.exp
    }

    public addExp(exp: number): void {
        this.exp += exp
    }

    public reachGoal() : Boolean {
        if (this.exp >= this.goal){
            return true
        }
        return false
    }

    update(time : number, deltal : number){
        this.reachGoal()
    }


}
