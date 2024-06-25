import { Vector } from 'matter'
import { CONST } from '../const/const'
import { Tile } from '../objects/Tile'
import { TileGrid } from '../objects/TileGrid'
import { TilePool } from '../objects/TilePool'

export class GameScene extends Phaser.Scene {
    // Variables
    private canMove: boolean

    // Grid with tiles
    private tileGrid: TileGrid

    // Selected Tiles
    private firstSelectedTile: Tile | undefined
    private secondSelectedTile: Tile | undefined
    private idleTimer: Phaser.Time.TimerEvent | undefined

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        // Init variables
        this.canMove = true

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


    private checkMatches(): void {
        //Call the getMatches function to check for spots where there is
        //a run of three or more tiles in a row
        let matches = this.getMatches(this.tileGrid.getTileGrid()!)

        //If there are matches, remove them
        if (matches.length > 0) {
            this.removeTileGroup(matches, () =>
                this.time.delayedCall(200, () => {
                    this.time.delayedCall(300, () => {
                        this.resetTile(() => {
                            this.fillTile(() =>
                                this.time.delayedCall(300, () => {
                                    this.tileUp(() => {
                                        this.checkMatches()
                                    })
                                })
                            )
                        })
                    })
                })
            )
    
        } else {
            // No match so just swap the tiles back to their original position and reset
            this.swapTiles()
            this.tileUp(() => {
                this.canMove = true
            })
        }
    }

    private resetTile(p0: () => void): void {
        // Loop through each column starting from the bottom row
        console.log('reset')
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
                                ease: 'Linear',
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
        p0()
    }

    private fillTile(p0: () => Phaser.Time.TimerEvent): void {
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

                    console.log('x: ' + x + ' y: ' + y + ' tile.y: ' + tile.y)

                    // Animate the tile to move into its correct position
                    this.add.tween({
                        targets: tile,
                        y: CONST.tileHeight * y + CONST.tileHeight / 2,
                        ease: 'Linear',
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

    private tileUp(p0: () => void): void {
        // Reset active tiles
        this.firstSelectedTile = undefined
        this.secondSelectedTile = undefined
        p0()
    }

    private removeTileGroup(matches: any, p0: () => Phaser.Time.TimerEvent): void {
        // Loop through all the matches and remove the associated tiles

        for (var i = 0; i < matches.length; i++) {
            var tempArr = matches[i]

            if (tempArr.length === 4) {
                const centerX = tempArr[0].x
                const centerY = tempArr[0].y

                for (let i = 1; i < tempArr.length; i++) {
                    const tile = tempArr[i]
                    let tilePos = this.getTilePos(this.tileGrid.getTileGrid()!, tile)
                    this.add.tween({
                        targets: tempArr[i],
                        x: centerX,
                        y: centerY,
                        ease: 'Linear',
                        duration: 200,
                        onComplete: () => {
                            TilePool.getInstance(this).returnTile(tile)
                            this.tileGrid.getTileGrid()![tilePos.y][tilePos.x] = undefined
                        },
                    })
                }
            } else {
                for (var j = 0; j < tempArr.length; j++) {
                    let tile = tempArr[j]
                    //Find where this tile lives in the theoretical grid
                    let tilePos = this.getTilePos(this.tileGrid.getTileGrid()!, tile)

                    // Remove the tile from the theoretical grid
                    if (tilePos.x !== -1 && tilePos.y !== -1) {
                        tile.explode3()
                        TilePool.getInstance(this).returnTile(tile)
                        this.tileGrid.getTileGrid()![tilePos.y][tilePos.x] = undefined
                    }
                }
            }
        }
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

        // Check for horizontal matches
        for (let y = 0; y < tileGrid.length; y++) {
            let tempArray = tileGrid[y]
            groups = []
            for (let x = 0; x < tempArray.length; x++) {
                if (x < tempArray.length - 2) {
                    if (tileGrid[y][x] && tileGrid[y][x + 1] && tileGrid[y][x + 2]) {
                        if (
                            tileGrid[y][x]!.texture.key === tileGrid[y][x + 1]!.texture.key &&
                            tileGrid[y][x + 1]!.texture.key === tileGrid[y][x + 2]!.texture.key
                        ) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[y][x]!) == -1) {
                                    matches.push(groups)
                                    groups = []
                                }
                            }

                            if (groups.indexOf(tileGrid[y][x]!) == -1) {
                                groups.push(tileGrid[y][x]!)
                            }

                            if (groups.indexOf(tileGrid[y][x + 1]!) == -1) {
                                groups.push(tileGrid[y][x + 1]!)
                            }

                            if (groups.indexOf(tileGrid[y][x + 2]!) == -1) {
                                groups.push(tileGrid[y][x + 2]!)
                            }
                        }
                    }
                }
            }

            if (groups.length > 0) {
                matches.push(groups)
            }
        }

        //Check for vertical matches
        for (let j = 0; j < tileGrid.length; j++) {
            var tempArr = tileGrid[j]
            groups = []
            for (let i = 0; i < tempArr.length; i++) {
                if (i < tempArr.length - 2)
                    if (tileGrid[i][j] && tileGrid[i + 1][j] && tileGrid[i + 2][j]) {
                        if (
                            tileGrid[i][j]!.texture.key === tileGrid[i + 1][j]!.texture.key &&
                            tileGrid[i + 1][j]!.texture.key === tileGrid[i + 2][j]!.texture.key
                        ) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[i][j]!) == -1) {
                                    matches.push(groups)
                                    groups = []
                                }
                            }

                            if (groups.indexOf(tileGrid[i][j]!) == -1) {
                                groups.push(tileGrid[i][j]!)
                            }
                            if (groups.indexOf(tileGrid[i + 1][j]!) == -1) {
                                groups.push(tileGrid[i + 1][j]!)
                            }
                            if (groups.indexOf(tileGrid[i + 2][j]!) == -1) {
                                groups.push(tileGrid[i + 2][j]!)
                            }
                        }
                    }
            }
            if (groups.length > 0) matches.push(groups)
        }

        return matches
    }
}
