import { BootScene } from './scenes/boot-scene'
import { GameScene } from './scenes/game-scene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Candy crush',
    url: 'https://github.com/digitsensitive/phaser3-typescript',
    version: '0.0.1',
    width: 520,
    height: 700,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [BootScene, GameScene],
    backgroundColor: '#de3412',
    render: { pixelArt: false, antialias: true },
    scale: {
        mode: Phaser.Scale.FIT, // Phaser.Scale.NONE, Phaser.Scale.FIT, Phaser.Scale.ENVELOP, Phaser.Scale.RESIZE
        autoCenter: Phaser.Scale.CENTER_BOTH, // Phaser.Scale.CENTER_BOTH, Phaser.Scale.CENTER_HORIZONTALLY, Phaser.Scale.CENTER_VERTICALLY
    },
}
