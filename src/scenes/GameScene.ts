import { stringifyError } from 'next/dist/shared/lib/utils'
import { CONST } from '../const/const'
import { Tile } from '../objects/Tile'
import { TileGrid } from '../objects/TileGrid'
import { TilePool } from '../objects/TilePool'

export class GameScene extends Phaser.Scene {
    // Variables
    private canMove: boolean
    private visited: boolean[][] = []
    // Grid with tiles
    private tileGrid: TileGrid

    // Selected Tiles
    private firstSelectedTile: Tile | undefined
    private secondSelectedTile: Tile | undefined
    private idleTimer: Phaser.Time.TimerEvent | undefined
    private hintTimer: Phaser.Time.TimerEvent | undefined

    private emitterFirstHint: Phaser.GameObjects.Particles.ParticleEmitter
    private emitterSecondHint: Phaser.GameObjects.Particles.ParticleEmitter

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        // Init variables
        this.canMove = true

        for (let i = 0; i < CONST.gridRows; i++) {
            this.visited[i] = []
            for (let j = 0; j < CONST.gridColumns; j++) {
                this.visited[i][j] = false
            }
        }

        // set background color
        this.cameras.main.setBackgroundColor(0x78aade)

        // Init grid with tiles
        this.tileGrid = new TileGrid(this)

        // Selected Tiles
        this.firstSelectedTile = undefined
        this.secondSelectedTile = undefined

        // Input
        this.input.on('gameobjectdown', this.tileDown, this)

        // Check if matches on the start

        this.checkMatches()

        this.resetIdleTimer()

        this.resetHintTimer()
        this.clearHint()
    }

    private resetIdleTimer(): void {
        if (this.idleTimer) {
            this.idleTimer.remove(false)
        }

        this.idleTimer = this.time.addEvent({
            delay: 10000,
            callback: () => this.playIdleAnimation(),
            callbackScope: this,
            loop: true,
        })
    }

    private playIdleAnimation(): void {
        this.tileGrid.playIdleAnimation()
    }

    private stopIdleAnimation(): void {
        this.tileGrid.stopIdleAnimation()
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
        this.stopIdleAnimation()
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

        const confetti = this.add.particles(0, window.innerHeight / 2, 'confetti', {
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
            x: 20,  // Spread the particles across the width of the screen
            y: { min: window.innerHeight - 200, max: window.innerHeight - 300 },
            alpha: { start: 0.75, end: 1 },
            lifespan: 3000,
            angle: { min: 260, max: 280 },  // Adjusted to shoot upwards
            speed: { min: 500, max: 600 },
            scale: { start: 0.2, end: 0 },
            gravityY: 250,  // Negative value to counteract the downward pull and push the particles upwards
        });
        

        console.log(confetti)
        confetti.explode(40)
        
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
            this.tileGrid.getTileGrid()![firstTilePosition.y / CONST.tileHeight][
                firstTilePosition.x / CONST.tileWidth
            ] = this.secondSelectedTile

            this.tileGrid.getTileGrid()![secondTilePosition.y / CONST.tileHeight][
                secondTilePosition.x / CONST.tileWidth
            ] = this.firstSelectedTile

            // Move them on the screen with tweens
            this.add.tween({
                targets: this.firstSelectedTile,
                x: this.secondSelectedTile.x,
                y: this.secondSelectedTile.y,
                ease: 'Linear',
                duration: 400,
                repeat: 0,
                yoyo: false,
            })

            this.add.tween({
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
                this.tileGrid.getTileGrid()![firstTilePosition.y / CONST.tileHeight][
                    firstTilePosition.x / CONST.tileWidth
                ]
            this.secondSelectedTile =
                this.tileGrid.getTileGrid()![secondTilePosition.y / CONST.tileHeight][
                    secondTilePosition.x / CONST.tileWidth
                ]
        }
    }

    private mergeMatch(matches: any, p0: () => void): void {
        let hasTween = false

        for (var i = 0; i < matches.length; i++) {
            var tempArr = matches[i]

            if (tempArr.length === 4) {
                const posX = tempArr[0].x
                const posY = tempArr[0].y

                let isTile4 = false
                for (let i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].getIsCombine4()) {
                        isTile4 = true
                    }
                }

                for (let j = 1; j < tempArr.length; j++) {
                    const tile = tempArr[j]
                    let tilePos = this.getTilePos(this.tileGrid.getTileGrid()!, tile)

                    hasTween = true
                    this.add.tween({
                        targets: tile,
                        x: posX,
                        y: posY,
                        ease: 'Linear',
                        duration: 200,
                        onComplete: () => {
                            TilePool.getInstance(this).returnTile(tile)
                            this.tileGrid.getTileGrid()![tilePos.y][tilePos.x] = undefined
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
                    let tilePos = this.getTilePos(this.tileGrid.getTileGrid()!, tile)

                    hasTween = true
                    this.add.tween({
                        targets: tile,
                        x: posX,
                        y: posY,
                        ease: 'Linear',
                        duration: 200,
                        onComplete: () => {
                            TilePool.getInstance(this).returnTile(tile)
                            this.tileGrid.getTileGrid()![tilePos.y][tilePos.x] = undefined
                        },
                    })
                }
                tempArr[0].enableCombine5()
            }
        }

        if (hasTween) {
            // Delay the callback if there's a tween
            this.time.delayedCall(200, p0, undefined, this)
        } else {
            // Call the callback immediately if no tween
            p0()
        }
    }

    private checkMatches(): void {
        //Call the getMatches function to check for spots where there is
        //a run of three or more tiles in a row
        let matches = this.getMatches(this.tileGrid.getTileGrid()!)

        

        //If there are matches, remove them
        if (matches.length > 0) {
            this.mergeMatch(matches, () => {
                this.removeTileGroup(matches, () =>
                    this.time.delayedCall(300, () => {
                        this.resetTile(() => {
                            this.time.delayedCall(300, () => {
                                this.tileUp()
                                this.checkMatches()
                            })
                        })
                    })
                )
            })
        } else {
            // No match so just swap the tiles back to their original position and reset
            this.swapTiles()
            this.tileUp()

            this.canMove = true
        }

        this.clearHint()
        this.resetHintTimer()

        // console.log(this.tileGrid.getTileGrid()!)
    }

    private async resetTile(p0: () => void): Promise<void> {
        // Loop through each column starting from the bottom row
        for (let y = this.tileGrid.getTileGrid()!.length - 1; y > 0; y--) {
            // Loop through each tile in the column from right to left
            for (let x = this.tileGrid.getTileGrid()![y].length - 1; x >= 0; x--) {
                // If this space is blank, find the first non-undefined tile above it
                if (this.tileGrid.getTileGrid()![y][x] === undefined) {
                    let foundTile = false
                    for (let k = y - 1; k >= 0; k--) {
                        if (this.tileGrid.getTileGrid()![k][x] !== undefined) {
                            let tempTile = this.tileGrid.getTileGrid()![k][x]
                            this.tileGrid.getTileGrid()![y][x] = tempTile
                            this.tileGrid.getTileGrid()![k][x] = undefined

                            this.add.tween({
                                targets: tempTile,
                                y: CONST.tileHeight * y + CONST.tileHeight / 2,
                                ease: 'Bounce.easeOut',
                                duration: 300,
                                repeat: 0,
                                yoyo: false,
                                autoDestroy: true,
                            })

                            foundTile = true
                            break
                        }
                    }
                    // If a tile was moved, restart checking from the bottom again
                    if (foundTile) {
                        x = this.tileGrid.getTileGrid()![y].length
                    }
                }
            }
        }

        // Iterate through each row of the grid from bottom to top
        for (let y = this.tileGrid.getTileGrid()!.length - 1; y >= 0; y--) {
            // Iterate through each column in the current row
            for (let x = 0; x < this.tileGrid.getTileGrid()![y].length; x++) {
                // Check if the current position in the grid is undefined (empty)
                if (this.tileGrid.getTileGrid()![y][x] === undefined) {
                    // Get a new tile from the tile pool
                    let tile = TilePool.getInstance(this).getTile(x, y)
                    // Position the tile above the top of the grid (off-screen)
                    tile.y = -(
                        CONST.tileHeight * (this.tileGrid.getTileGrid()!.length - y) +
                        CONST.tileHeight / 2
                    )

                    // Animate the tile to move into its correct position
                    this.add.tween({
                        targets: tile,
                        y: CONST.tileHeight * y + CONST.tileHeight / 2,
                        ease: 'Bounce.easeOut',
                        duration: 300,
                        repeat: 0,
                        yoyo: false,
                    })

                    // Update the grid with the new tile
                    this.tileGrid.getTileGrid()![y][x] = tile
                }
            }
        }

        p0()
    }

    private tileUp(): void {
        // Reset active tiles
        this.firstSelectedTile = undefined
        this.secondSelectedTile = undefined
    }

    private removeTileGroup(matches: any, p0: () => void): void {
        // get only match3 in matches
        let match3 = matches.filter((match: any) => match.length === 3)

        for (var i = 0; i < match3.length; i++) {
            var tempArr = match3[i]

            for (let j = 0; j < tempArr.length; j++) {
                let tile = tempArr[j]
                let tilePos = this.getTilePos(this.tileGrid.getTileGrid()!, tile)

                if (tilePos.x !== -1 && tilePos.y !== -1) {
                    this.tileGrid.handleExplode(tile)
                }
            }
        }

        this.time.delayedCall(100, p0, undefined, this)
        p0()
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
                        let tilePos = this.getTilePos(
                            this.tileGrid.getTileGrid()!,
                            tempArrayRight[k]
                        )
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
                        let tilePos = this.getTilePos(
                            this.tileGrid.getTileGrid()!,
                            tempArrayDown[k]
                        )
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
        let tileGridCopy = this.copyTileGrid(this.tileGrid.getTileGrid()! as Tile[][])

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

        this.hintTimer = this.time.addEvent({
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
            this.emitterFirstHint = this.add.particles(0, 0, 'flare', {
                color: [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x8a2be2],
                speed: 20,
                lifespan: 250,
                quantity: 2,
                scale: { start: 0.2, end: 0 },
                advance: 2000,
                emitZone: emitZone1,
            })

            // Create the second particle emitter for the second hint
            this.emitterSecondHint = this.add.particles(0, 0, 'flare', {
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
