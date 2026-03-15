// Phaser 3 Game Configuration
const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 450,
    pixelArt: true,
    backgroundColor: '#87CEEB',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [BootScene, TitleScene, TeslaScene, GameScene, MemoryScene, ShooScene, BossScene, VictoryScene, MusterScene],
    input: {
        activePointers: 3
    }
};

// Launch the game
const game = new Phaser.Game(gameConfig);
