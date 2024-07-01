import { Tile } from './Tile'

export enum PathType {
    NULL,
    CIRCLE,
    RECTANGLE,
    TRIANGLE,
}

export class ShapePath {
    private pathType: PathType
    private circle: Phaser.Geom.Circle
    private rectangle: Phaser.Geom.Rectangle
    private triangle: Phaser.Geom.Triangle
    private activeTweens: number
    private scene: Phaser.Scene
    private progress: number = 0

    constructor(scene: Phaser.Scene) {
        this.circle = new Phaser.Geom.Circle(250, 300, 200)
        this.rectangle = new Phaser.Geom.Rectangle(50, 100, 400, 400)
        this.triangle = new Phaser.Geom.Triangle(50, 500, 250, 200, 450, 500)
        this.scene = scene
        this.activeTweens = 0
    }

    public setPath(pathType: PathType) {
        this.pathType = pathType
    }

    public getPoints(tile: Tile[]): Phaser.Geom.Point[] {
        switch (this.pathType) {
            case PathType.CIRCLE:
                return this.circle.getPoints(tile.length)
            case PathType.RECTANGLE:
                return this.rectangle.getPoints(tile.length)
            case PathType.TRIANGLE:
                return this.triangle.getPoints(tile.length)
        }

        return []
    }

    public areTweensActive(): boolean {
        return this.activeTweens > 0
    }

    public setPositionsOnPath(tile: Tile[]) {
        let depth = 1
        let points = this.getPoints(tile)

        for (let i = 0; i < tile.length; i++) {
            tile[i].setDepth(depth + i * 0.001)
            this.activeTweens++
            this.scene.add.tween({
                targets: tile[i],
                x: points[i].x,
                y: points[i].y,
                ease: 'quad.out',
                duration: 500,
                onComplete: () => {
                    this.activeTweens--
                },
            })
        }
    }

    public update(tiles: Tile[], time: number, delta: number) {
        if (this.pathType === PathType.NULL) return

        this.progress += delta * 0.001
        this.progress = this.progress % 1

        const dt = 1 / tiles.length

        for (let i = 0; i < tiles.length; i++) {
            let progress = (this.progress + i * dt) % 1
            let point: Phaser.Geom.Point = new Phaser.Geom.Point() // Create a new Phaser.Geom.Point

            switch (this.pathType) {
                case PathType.CIRCLE:
                    point.setTo(this.circle.getPoint(progress).x, this.circle.getPoint(progress).y)
                    break
                case PathType.RECTANGLE:
                    point.setTo(
                        this.rectangle.getPoint(progress).x,
                        this.rectangle.getPoint(progress).y
                    )
                    break
                case PathType.TRIANGLE:
                    point.setTo(
                        this.triangle.getPoint(progress).x,
                        this.triangle.getPoint(progress).y
                    )
                    break
                default:
                    break
            }

            const targetX = point.x
            const targetY = point.y
            const currentX = tiles[i].x
            const currentY = tiles[i].y
            const distanceX = targetX - currentX
            const distanceY = targetY - currentY
            const accelerationX = distanceX * 0.02
            const accelerationY = distanceY * 0.02

            tiles[i].setPosition(currentX + accelerationX * delta, currentY + accelerationY * delta)
        }
    }
}
