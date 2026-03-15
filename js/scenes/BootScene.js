// BootScene.js - Loads/generates all assets then transitions to Title
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Show loading text
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const bg = this.add.rectangle(w / 2, h / 2, w, h, 0x1a1a2e);
        const loadingText = this.add.text(w / 2, h / 2 - 30, 'Loading...', {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            color: '#FFD700'
        }).setOrigin(0.5);

        const subText = this.add.text(w / 2, h / 2 + 10, 'Preparing the cruise ship...', {
            fontSize: '14px',
            fontFamily: 'Courier New, monospace',
            color: '#87CEEB'
        }).setOrigin(0.5);
    }

    create() {
        // Generate all pixel art sprites programmatically (only on first boot)
        if (!this.textures.exists('jennifer')) {
            SpriteGen.registerAll(this);
        }

        // Create Jennifer animations
        if (!this.anims.exists('jennifer_idle')) {
            this.anims.create({
                key: 'jennifer_idle',
                frames: [{ key: 'jennifer', frame: 0 }],
                frameRate: 1,
                repeat: -1
            });

            this.anims.create({
                key: 'jennifer_run',
                frames: this.anims.generateFrameNumbers('jennifer', { start: 1, end: 4 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'jennifer_jump',
                frames: [{ key: 'jennifer', frame: 5 }],
                frameRate: 1,
                repeat: 0
            });

            // Create Honey animations
            this.anims.create({
                key: 'honey_idle',
                frames: [{ key: 'honey', frame: 0 }],
                frameRate: 1,
                repeat: -1
            });

            this.anims.create({
                key: 'honey_run',
                frames: this.anims.generateFrameNumbers('honey', { start: 0, end: 2 }),
                frameRate: 8,
                repeat: -1
            });
        }

        // Short delay so loading screen is visible
        this.time.delayedCall(500, () => {
            this.scene.start('TitleScene');
        });
    }
}
