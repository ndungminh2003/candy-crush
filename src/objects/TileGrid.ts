import { Tile } from './Tile'
import { CONST } from '../const/const'
import { TilePool } from './TilePool'
import { ParticleManager } from '../manager/ParticleManager'
import { ShapePath, PathType } from './ShapePath'
import { Level } from './Level'

const emit4Direction = [
    { y: -1, x: -1 },
    { y: -1, x: 0 },
    { y: -1, x: 1 },
    { y: 0, x: -1 },
    { y: 0, x: 0 },
    { y: 0, x: 1 },
    { y: 1, x: -1 },
    { y: 1, x: 0 },
    { y: 1, x: 1 },
]

export class TileGrid extends Phaser.GameObjects.Container {
    private tileGrid: Array<Array<Tile | undefined>> | undefined
    private idleTween: Phaser.Tweens.Tween | undefined

    private canMove: boolean
    private visited: boolean[][] = []

    private firstSelectedTile: Tile | undefined
    private secondSelectedTile: Tile | undefined

    private idleTimer: Phaser.Time.TimerEvent | undefined
    private hintTimer: Phaser.Time.TimerEvent | undefined

    private emitterFirstHint: Phaser.GameObjects.Particles.ParticleEmitter
    private emitterSecondHint: Phaser.GameObjects.Particles.ParticleEmitter
    private shapePath: ShapePath
    private isNext: Boolean = false


    private tileArr: Tile[]

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

        this.canMove = true

        this.shapePath = new ShapePath(this.scene)

        for (let i = 0; i < CONST.gridRows; i++) {
            this.visited[i] = []
            for (let j = 0; j < CONST.gridColumns; j++) {
                this.visited[i][j] = false
            }
        }
        this.firstSelectedTile = undefined
        this.secondSelectedTile = undefined

        // Input
        this.scene.input.on('gameobjectdown', this.tileDown, this)

        // Check if matches on the start

        this.checkMatches()

        this.resetIdleTimer()

        this.resetHintTimer()
        this.clearHint()
    }

    public update(time: number, dental: number) {
        if (Level.getInstance(this.scene).reachGoal() && this.isNext) {
            this.resetHintTimer()
            this.shapePath.update(this.tileArr, time, dental)
        }
    }

    private resetTileGrid(): void {
        Level.getInstance(this.scene).resetExp()
        this.shapePath.setPath(0)
        this.isNext = false

        console.log(this.shapePath.areTweensActive())

        // Ensure no active tweens before resetting the tile grid
        if (this.shapePath.areTweensActive()) {
            this.scene.time.delayedCall(100, () => this.resetTileGrid())
            return
        }

        for (let y = 0; y < CONST.gridRows; y++) {
            for (let x = 0; x < CONST.gridColumns; x++) {
                // this.tileGrid![y][x]!.setIsActive(true);

                this.scene.add.tween({
                    targets: this.tileGrid![y][x],
                    x: x * CONST.tileWidth + CONST.tileWidth / 2,
                    y: y * CONST.tileHeight + CONST.tileHeight / 2,
                    ease: 'expo.inout',
                    duration: 500,
                })
            }
        }
    }

    public getTileToShuffer(): void {
        this.scene.time.removeAllEvents()

        if (this.emitterFirstHint && this.emitterSecondHint) {
            this.emitterFirstHint.stop()
            this.emitterSecondHint.stop()
        }

        this.tileArr = []

        for (let y = 0; y < CONST.gridRows; y++) {
            for (let x = 0; x < CONST.gridColumns; x++) {
                const tile = this.tileGrid![y][x]
                // this.tileGrid![y][x]!.setIsActive(false );
                if (tile) {
                    if (tile.getIsCombine4()) {
                        tile.disableCombine4()
                        console.log('disable combine 4')
                    } else {
                        tile.disableCombine5()
                    }
                    this.tileArr.push(tile)
                }
            }
        }

        this.shuffleArray(this.tileArr)
    }

    // Fisher-Yates shuffle algorithm
    private shuffleArray(array: Tile[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
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
        if (this.idleTween) return

        let i = 0

        for (let y = 0; y < CONST.gridRows; y++) {
            let row = this.tileGrid![y]
            for (let x = 0; x < CONST.gridColumns; x++) {
                let tile = row[x]
                if (tile === undefined) continue

                this.idleTween = this.scene.tweens.add({
                    targets: tile,
                    scale: 0.6,
                    ease: 'sine.inout',
                    duration: 300,
                    delay: i * 50,
                    repeat: 2,
                    yoyo: true,
                    repeatDelay: 200,
                })

                i++
                if (i % 8 === 0) {
                    i = 0
                }
            }
        }
    }

    public stopIdleAnimation(): void {
        if (this.idleTween) {
            this.idleTween.stop()
            this.idleTween = undefined
        }
    }

    private getTilePos(tileGrid: (Tile | undefined)[][], tile: Tile): any {
        let pos = { x: -1, y: -1 }

        //Find the position of a specific tile in the grid
        for (let y = 0; y < tileGrid.length; y++) {
            for (let x = 0; x < tileGrid[y].length; x++) {
                //There is a match at this position so return the grid coords
                if (tile === tileGrid[y][x]) {
                    pos.x = x
                    pos.y = y
                    break
                }
            }
        }

        return pos
    }

    public handleExplode(tile: Tile): void {
        if (tile === undefined) return

        if (tile.getIsCombine4()) {
            this.emit4(tile)
            return
        } else if (tile.getIsCombine5()) {
            this.emit5(tile)
            return
        } else {
            this.emit3(tile)
            return
        }
    }

    public emit4(tile: Tile): void {
        if (tile === undefined) return

        let pos = this.getTilePos(this.tileGrid!, tile)

        this.emit3(tile)
        tile.disableCombine4()

        if (pos.x === -1 || pos.y === -1) return

        for (let i = 0; i < emit4Direction.length; i++) {
            let y = pos.y + emit4Direction[i].y
            let x = pos.x + emit4Direction[i].x

            if (y < 0 || y >= CONST.gridRows || x < 0 || x >= CONST.gridColumns) continue

            let tile = this.tileGrid![y][x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }
    }

    public emit5(tile: Tile): void {
        let pos = this.getTilePos(this.tileGrid!, tile)

        if (pos.x === -1 || pos.y === -1) return

        this.emit3(tile)
        tile.disableCombine5()

        // remove left
        for (let x = pos.x - 1; x >= 0; x--) {
            let tile = this.tileGrid![pos.y][x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }

        // remove right
        for (let x = pos.x + 1; x < CONST.gridColumns; x++) {
            let tile = this.tileGrid![pos.y][x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }

        // remove top
        for (let y = pos.y - 1; y >= 0; y--) {
            let tile = this.tileGrid![y][pos.x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }

        // remove bottom
        for (let y = pos.y + 1; y < CONST.gridRows; y++) {
            let tile = this.tileGrid![y][pos.x] as Tile
            if (tile === undefined) continue

            this.handleExplode(tile)
        }
    }

    public emit3(tile: Tile): void {
        if (tile === undefined) return

        let tilePos = this.getTilePos(this.tileGrid!, tile)

        Level.getInstance(this.scene).addExp(tile.getPoint())
        tile.explode3()
        TilePool.getInstance(this.scene).returnTile(tile)
        this.tileGrid![tilePos.y][tilePos.x] = undefined
    }

    /**
     * This function gets called, as soon as a tile has been pressed or clicked.
     * It will check, if a move can be done at first.
     * Then it will check if a tile was already selected before or not (if -> else)
     * @param pointer
     * @param gameobject
     * @param event
     */
    private tileDown(pointer: any, gameobject: any, event: any): void {
        this.resetIdleTimer()

        if (this.canMove) {
            if (!this.firstSelectedTile) {
                this.firstSelectedTile = gameobject
                this.firstSelectedTile!.getSelected()
                console.log('pick')
            } else {
                this.secondSelectedTile = gameobject
                if (this.firstSelectedTile === this.secondSelectedTile) {
                    this.firstSelectedTile.getDeselected()
                    console.log('unpick')
                    this.firstSelectedTile = undefined
                    this.secondSelectedTile = undefined
                    return
                }
                // Check if the two selected tiles are adjacent
                let dx =
                    Math.abs(this.firstSelectedTile.x - this.secondSelectedTile!.x) /
                    CONST.tileWidth
                let dy =
                    Math.abs(this.firstSelectedTile.y - this.secondSelectedTile!.y) /
                    CONST.tileHeight

                // Check if the selected tiles are both in range to make a move
                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    this.canMove = false
                    this.firstSelectedTile.getDeselected()
                    this.swapTiles()
                } else {
                    this.firstSelectedTile.getDeselected()
                    this.firstSelectedTile = this.secondSelectedTile
                    this.firstSelectedTile!.getSelected()
                    this.secondSelectedTile = undefined
                }
            }
        }
    }

    private resetIdleTimer(): void {
        if (this.idleTimer) {
            this.idleTimer.remove(false)
        }

        this.idleTimer = this.scene.time.addEvent({
            delay: 10000,
            callback: () => this.playIdleAnimation(),
            callbackScope: this,
            loop: true,
        })
    }

    /**
     * This function will take care of the swapping of the two selected tiles.
     * It will only work, if two tiles have been selected.
     */
    private swapTiles(): void {
        if (this.firstSelectedTile && this.secondSelectedTile) {
            // Get the position of the two tiles
            // x = 0, y = 0 is the top left corner
            let firstTilePosition = {
                x: this.firstSelectedTile.x - CONST.tileWidth / 2,
                y: this.firstSelectedTile.y - CONST.tileHeight / 2,
            }

            // x1 = 0, y1 = 72 is the position of the second tile

            let secondTilePosition = {
                x: this.secondSelectedTile.x - CONST.tileWidth / 2,
                y: this.secondSelectedTile.y - CONST.tileHeight / 2,
            }

            // Swap them in our grid with the tiles
            this.tileGrid![firstTilePosition.y / CONST.tileHeight][
                firstTilePosition.x / CONST.tileWidth
            ] = this.secondSelectedTile

            this.tileGrid![secondTilePosition.y / CONST.tileHeight][
                secondTilePosition.x / CONST.tileWidth
            ] = this.firstSelectedTile

            // Move them on the screen with tweens
            this.scene.add.tween({
                targets: this.firstSelectedTile,
                x: this.secondSelectedTile.x,
                y: this.secondSelectedTile.y,
                ease: 'Linear',
                duration: 400,
                repeat: 0,
                yoyo: false,
            })

            this.scene.add.tween({
                targets: this.secondSelectedTile,
                x: this.firstSelectedTile.x,
                y: this.firstSelectedTile.y,
                ease: 'Linear',
                duration: 400,
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    this.checkMatches()
                },
            })

            this.firstSelectedTile =
                this.tileGrid![firstTilePosition.y / CONST.tileHeight][
                    firstTilePosition.x / CONST.tileWidth
                ]
            this.secondSelectedTile =
                this.tileGrid![secondTilePosition.y / CONST.tileHeight][
                    secondTilePosition.x / CONST.tileWidth
                ]
        }
    }

    private mergeMatch(matches: any): void {
        let totalTweens = 0
        let tweensAdded = false

        for (let i = 0; i < matches.length; i++) {
            const tempArr = matches[i]

            if (tempArr.length === 4) {
                const posX = tempArr[0].x
                const posY = tempArr[0].y

                let isTile4 = false
                for (let j = 0; j < tempArr.length; j++) {
                    if (tempArr[j].getIsCombine4() || tempArr[j].getIsCombine5()) {
                        isTile4 = true
                    }
                }

                for (let j = 1; j < tempArr.length; j++) {
                    const tile = tempArr[j]
                    const tilePos = this.getTilePos(this.tileGrid!, tile)

                    totalTweens++
                    tweensAdded = true
                    this.scene.add.tween({
                        targets: tile,
                        x: posX,
                        y: posY,
                        ease: 'Linear',
                        duration: 300,
                        onComplete: () => {
                            TilePool.getInstance(this.scene).returnTile(tile)
                            this.tileGrid![tilePos.y][tilePos.x] = undefined
                            totalTweens--
                            if (totalTweens === 0) {
                                this.removeTileGroup(matches, this.resetTile.bind(this))
                            }
                        },
                    })
                }

                if (isTile4) {
                    tempArr[0].enableCombine5()
                } else {
                    tempArr[0].enableCombine4()
                }
            } else if (tempArr.length >= 5) {
                const posX = tempArr[0].x
                const posY = tempArr[0].y

                for (let j = 1; j < tempArr.length; j++) {
                    const tile = tempArr[j]
                    const tilePos = this.getTilePos(this.tileGrid!, tile)

                    totalTweens++
                    tweensAdded = true
                    this.scene.add.tween({
                        targets: tile,
                        x: posX,
                        y: posY,
                        ease: 'Linear',
                        duration: 300,
                        onComplete: () => {
                            TilePool.getInstance(this.scene).returnTile(tile)
                            this.tileGrid![tilePos.y][tilePos.x] = undefined

                            totalTweens--
                            if (totalTweens === 0) {
                                this.removeTileGroup(matches, this.resetTile.bind(this))
                            }
                        },
                    })
                }
                tempArr[0].enableCombine5()
            }
        }

        if (!tweensAdded) {
            this.removeTileGroup(matches, this.resetTile.bind(this))
        }
    }

    private checkMatches(): void {
        let matches = this.getMatches(this.tileGrid!)

        if (matches.length > 0) {
            this.mergeMatch(matches)
        } else {
            this.swapTiles()
            this.tileUp()

            this.scene.time.delayedCall(400, () => {
                this.canMove = true
            })
            
            if (Level.getInstance(this.scene).reachGoal()) {
                this.shapePath.setPath(Phaser.Math.RND.between(1, 3))
                this.getTileToShuffer()
                this.shapePath.setPositionsOnPath(this.tileArr)
                this.isNext = true
                ParticleManager.getInstance(this.scene).startConfetti()

                this.scene.time.delayedCall(5000, () => {
                    this.resetTileGrid()
                })
            }
        }

        this.clearHint()
        this.resetHintTimer()
    }

    private resetTile(): void {
        let totalTweens = 0
        let tweensAdded = false

        // Move existing tiles down
        for (let y = this.tileGrid!.length - 1; y > 0; y--) {
            for (let x = this.tileGrid![y].length - 1; x >= 0; x--) {
                if (this.tileGrid![y][x] === undefined) {
                    let foundTile = false
                    for (let k = y - 1; k >= 0; k--) {
                        if (this.tileGrid![k][x] !== undefined) {
                            const tempTile = this.tileGrid![k][x]
                            this.tileGrid![y][x] = tempTile
                            this.tileGrid![k][x] = undefined

                            totalTweens++
                            tweensAdded = true
                            this.scene.add.tween({
                                targets: tempTile,
                                y: CONST.tileHeight * y + CONST.tileHeight / 2,
                                ease: 'Cubic.easeOut',
                                duration: 500,
                                onComplete: () => {
                                    totalTweens--
                                    if (totalTweens === 0) {
                                        this.tileUp()
                                        this.checkMatches()
                                    }
                                },
                            })

                            foundTile = true
                            break
                        }
                    }
                    if (foundTile) {
                        x = this.tileGrid![y].length
                    }
                }
            }
        }

        // Add new tiles
        for (let y = this.tileGrid!.length - 1; y >= 0; y--) {
            for (let x = 0; x < this.tileGrid![y].length; x++) {
                if (this.tileGrid![y][x] === undefined) {
                    const tile = TilePool.getInstance(this.scene).getTile(x, y)
                    tile.y = -(
                        CONST.tileHeight * (this.tileGrid!.length - y) +
                        CONST.tileHeight / 2
                    )

                    totalTweens++
                    tweensAdded = true
                    this.scene.add.tween({
                        targets: tile,
                        y: CONST.tileHeight * y + CONST.tileHeight / 2,
                        ease: 'Cubic.easeOut',
                        duration: 500,
                        alpha: { start: 0, to: 1 },
                        onComplete: () => {
                            totalTweens--
                            if (totalTweens === 0) {
                                this.tileUp()
                                this.checkMatches()
                            }
                        },
                    })

                    this.tileGrid![y][x] = tile
                }
            }
        }

        if (!tweensAdded) {
            this.canMove = true
            this.tileUp()
            this.checkMatches()
        }
    }

    private tileUp(): void {
        // Reset active tiles
        this.firstSelectedTile = undefined
        this.secondSelectedTile = undefined
    }

    private removeTileGroup(matches: any, callback: () => void): void {
        // get only match3 in matches

        const match3 = matches.filter((match: any) => match.length === 3)

        for (let i = 0; i < match3.length; i++) {
            const tempArr = match3[i]

            for (let j = 0; j < tempArr.length; j++) {
                const tile = tempArr[j]
                const tilePos = this.getTilePos(this.tileGrid!, tile)

                if (tilePos.x !== -1 && tilePos.y !== -1) {
                    this.handleExplode(tile)
                }
            }
        }

        // Call the callback after removing the tile group
        callback()
    }

    private getMatches(tileGrid: (Tile | undefined)[][]): Tile[][] {
        let matches: Tile[][] = []
        let groups: Tile[] = []

        for (let i = 0; i < CONST.gridRows; i++) {
            for (let j = 0; j < CONST.gridColumns; j++) {
                this.visited[i][j] = false
            }
        }

        for (let y = 0; y < tileGrid.length; y++) {
            let tempArray = tileGrid[y]

            for (let x = 0; x < tempArray.length; x++) {
                // Check for horizontal matches
                if (!tempArray[x] || this.visited[y][x]) continue
                let groups = []
                groups.push(tempArray[x]!)
                this.visited[y][x] = true

                let tempArrayRight = []
                let tempArrayRightPositions = []

                for (let k = x + 1; k < tempArray.length; k++) {
                    if (
                        tempArray[k] &&
                        tempArray[x]!.texture.key === tempArray[k]!.texture.key &&
                        !this.visited[y][k]
                    ) {
                        tempArrayRight.push(tempArray[k]!)
                        tempArrayRightPositions.push({ x: k, y: y })
                        this.visited[y][k] = true
                    } else {
                        break
                    }
                }

                let tempArrayLeft = []
                let tempArrayLeftPositions = []

                for (let k = x - 1; k >= 0; k--) {
                    if (
                        tempArray[k] &&
                        tempArray[x]!.texture.key === tempArray[k]!.texture.key &&
                        !this.visited[y][k]
                    ) {
                        tempArrayLeft.push(tempArray[k]!)
                        tempArrayLeftPositions.push({ x: k, y: y })
                        this.visited[y][k] = true
                    } else {
                        break
                    }
                }

                // Check vertical matches
                let tempArrayDown = []
                let tempArrayDownPositions = []

                for (let k = y + 1; k < tileGrid.length; k++) {
                    if (
                        tileGrid[k][x] &&
                        tileGrid[y][x]!.texture.key === tileGrid[k][x]!.texture.key &&
                        !this.visited[k][x]
                    ) {
                        tempArrayDown.push(tileGrid[k][x]!)
                        tempArrayDownPositions.push({ x: x, y: k })
                        this.visited[k][x] = true
                    } else {
                        break
                    }
                }

                let tempArrayUp = []
                let tempArrayUpPositions = []

                for (let k = y - 1; k >= 0; k--) {
                    if (
                        tileGrid[k][x] &&
                        tileGrid[y][x]!.texture.key === tileGrid[k][x]!.texture.key &&
                        !this.visited[k][x]
                    ) {
                        tempArrayUp.push(tileGrid[k][x]!)
                        tempArrayUpPositions.push({ x: x, y: k })
                        this.visited[k][x] = true
                    } else {
                        break
                    }
                }

                if (
                    tempArrayRight.length + tempArrayLeft.length >= 2 &&
                    tempArrayDown.length + tempArrayUp.length >= 2
                ) {
                    groups.push(...tempArrayRight)
                    groups.push(...tempArrayLeft)
                    groups.push(...tempArrayDown)
                    groups.push(...tempArrayUp)

                    matches.push(groups)
                } else {
                    // assign all group tempArray visited to false
                    this.visited[y][x] = false

                    tempArrayRightPositions.forEach((pos) => {
                        this.visited[pos.y][pos.x] = false
                    })

                    tempArrayLeftPositions.forEach((pos) => {
                        this.visited[pos.y][pos.x] = false
                    })

                    tempArrayDownPositions.forEach((pos) => {
                        this.visited[pos.y][pos.x] = false
                    })

                    tempArrayUpPositions.forEach((pos) => {
                        this.visited[pos.y][pos.x] = false
                    })
                }
            }
        }

        // check horizontal matches
        for (let y = 0; y < tileGrid.length; y++) {
            let tempArray = tileGrid[y]
            for (let x = 0; x < tempArray.length; x++) {
                if (!tempArray[x] || this.visited[y][x]) continue
                groups = []
                groups.push(tempArray[x]!)
                this.visited[y][x] = true

                let tempArrayRight = []
                for (let k = x + 1; k < tempArray.length; k++) {
                    if (
                        tempArray[k] &&
                        tempArray[x]!.texture.key === tempArray[k]!.texture.key &&
                        !this.visited[y][k]
                    ) {
                        tempArrayRight.push(tempArray[k]!)
                        this.visited[y][k] = true
                    } else {
                        break
                    }
                }

                if (tempArrayRight.length >= 2) {
                    groups.push(...tempArrayRight)

                    matches.push(groups)
                } else {
                    // assign all group tempArray visited to false
                    this.visited[y][x] = false
                    for (let k = 0; k < tempArrayRight.length; k++) {
                        let tilePos = this.getTilePos(this.tileGrid!, tempArrayRight[k])
                        this.visited[tilePos.y][tilePos.x] = false
                    }
                }
            }
        }

        // check vertical matches
        for (let y = 0; y < tileGrid.length; y++) {
            let tempArray = tileGrid[y]
            for (let x = 0; x < tempArray.length; x++) {
                if (!tempArray[x] || this.visited[y][x]) continue
                groups = []
                groups.push(tempArray[x]!)
                this.visited[y][x] = true
                let tempArrayDown = []
                for (let k = y + 1; k < tileGrid.length; k++) {
                    if (
                        tileGrid[k][x] &&
                        tileGrid[y][x]!.texture.key === tileGrid[k][x]!.texture.key &&
                        !this.visited[k][x]
                    ) {
                        tempArrayDown.push(tileGrid[k][x]!)
                        this.visited[k][x] = true
                    } else {
                        break
                    }
                }

                if (tempArrayDown.length >= 2) {
                    groups.push(...tempArrayDown)
                    matches.push(groups)
                } else {
                    // assign all group tempArray visited to false
                    this.visited[y][x] = false
                    for (let k = 0; k < tempArrayDown.length; k++) {
                        let tilePos = this.getTilePos(this.tileGrid!, tempArrayDown[k])
                        this.visited[tilePos.y][tilePos.x] = false
                    }
                }
            }
        }

        return matches
    }

    private getPossibleMatches(): any[] {
        let possibleMatches = []

        // Create a copy of the tile grid
        let tileGridCopy = this.copyTileGrid(this.tileGrid as Tile[][])

        for (let y = 0; y < CONST.gridRows; y++) {
            for (let x = 0; x < CONST.gridColumns; x++) {
                // Check horizontal matches
                if (x < CONST.gridColumns - 1) {
                    this.swapTiles1(tileGridCopy, x, y, x + 1, y)
                    if (this.checkMatch(tileGridCopy)) {
                        possibleMatches.push([{ x1: x, y1: y, x2: x + 1, y2: y }])
                    }
                    this.swapTiles1(tileGridCopy, x, y, x + 1, y) // Swap back
                }

                // Check vertical matches
                if (y < CONST.gridRows - 1) {
                    this.swapTiles1(tileGridCopy, x, y, x, y + 1)
                    if (this.checkMatch(tileGridCopy)) {
                        possibleMatches.push([{ x1: x, y1: y, x2: x, y2: y + 1 }])
                    }
                    this.swapTiles1(tileGridCopy, x, y, x, y + 1) // Swap back
                }
            }
        }

        // return one element of the array possibleMatch

        let randomIndex = Math.floor(Math.random() * possibleMatches.length)

        return possibleMatches[randomIndex]
    }

    // Function to create a deep copy of the tile grid
    private copyTileGrid(tileGrid: Tile[][]): Tile[][] {
        return tileGrid.map((row) => row.slice())
    }

    // Function to swap tiles in the given grid
    private swapTiles1(tileGrid: Tile[][], x1: number, y1: number, x2: number, y2: number): void {
        let temp = tileGrid[y1][x1]
        tileGrid[y1][x1] = tileGrid[y2][x2]
        tileGrid[y2][x2] = temp
    }

    // Function to check if there's a match on the board
    private checkMatch(tileGrid: Tile[][]): boolean {
        let matches = this.getMatches(tileGrid)
        return matches.length > 0
    }

    private resetHintTimer(): void {
        if (this.hintTimer) {
            this.hintTimer.remove(false)
        }

        this.hintTimer = this.scene.time.addEvent({
            delay: 5000, // 5 seconds
            callback: () => this.showHint(),
            callbackScope: this,
            loop: false,
        })
    }

    private showHint(): void {
        const hint = this.getPossibleMatches()
        if (hint) {
            // Clear any existing hint graphics or particles
            this.clearHint()

            // Get the bounds of the tiles to create the emit zones
            const emitZone1 = {
                type: 'edge',
                source: new Phaser.Geom.Rectangle(
                    hint[0].x1 * CONST.tileWidth,
                    hint[0].y1 * CONST.tileHeight,
                    CONST.tileWidth,
                    CONST.tileHeight
                ),
                quantity: 42,
            }

            const emitZone2 = {
                type: 'edge',
                source: new Phaser.Geom.Rectangle(
                    hint[0].x2 * CONST.tileWidth,
                    hint[0].y2 * CONST.tileHeight,
                    CONST.tileWidth,
                    CONST.tileHeight
                ),
                quantity: 42,
            }

            // Create the first particle emitter for the first hint
            this.emitterFirstHint = this.scene.add.particles(0, 0, 'flare', {
                color: [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x8a2be2],
                speed: 20,
                lifespan: 250,
                quantity: 2,
                scale: { start: 0.2, end: 0 },
                advance: 2000,
                emitZone: emitZone1,
            })

            // Create the second particle emitter for the second hint
            this.emitterSecondHint = this.scene.add.particles(0, 0, 'flare', {
                color: [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x8a2be2],
                speed: 20,
                lifespan: 250,
                quantity: 2,
                scale: { start: 0.2, end: 0 },
                advance: 2000,
                emitZone: emitZone2,
            })
        }
    }

    private clearHint(): void {
        if (this.emitterFirstHint) {
            this.emitterFirstHint.stop()
        }
        if (this.emitterSecondHint) {
            this.emitterSecondHint.stop()
        }
    }
}
