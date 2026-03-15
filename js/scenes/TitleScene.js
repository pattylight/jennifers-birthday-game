// TitleScene.js — Animated title screen with cruise ship, waves, and "Tap to Play"
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Sky gradient background
        this.add.image(w / 2, h / 2, 'bg_ocean').setDisplaySize(w, h);

        // Sun (tap to toggle debug menu)
        const sun = this.add.image(w - 80, 60, 'sun').setScale(1.5).setInteractive({ useHandCursor: true });
        this.debugVisible = false;
        this.debugLinks = [];

        // Clouds (parallax)
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.image(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(20, 120),
                'cloud'
            ).setScale(Phaser.Math.FloatBetween(0.5, 1.2)).setAlpha(0.8);
            this.clouds.push(cloud);
        }

        // Ocean waves (animated rectangles)
        this.waves = [];
        for (let i = 0; i < 3; i++) {
            const wave = this.add.rectangle(w / 2, h - 60 + i * 25, w + 100, 30, [0x1E90FF, 0x1565C0, 0x0D47A1][i]);
            wave.setAlpha(0.7 + i * 0.1);
            this.waves.push(wave);
        }

        // Cruise ship silhouette (simple rectangle composition)
        this.createCruiseShip(w / 2, h - 110);

        // Title text
        const titleShadow = this.add.text(w / 2 + 3, 63, "Jenny's\nFirst Cruise", {
            fontSize: '40px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#000000',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5).setAlpha(0.3);

        const title = this.add.text(w / 2, 60, "Jenny's\nFirst Cruise", {
            fontSize: '40px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700',
            align: 'center',
            stroke: '#8B4513',
            strokeThickness: 4,
            lineSpacing: 5
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(w / 2, 125, '~ ~ ~', {
            fontSize: '29px',
        }).setOrigin(0.5);

        // Espresso martini icon floating
        const martini = this.add.image(w / 2, 170, 'martini').setScale(1.5);
        this.tweens.add({
            targets: martini,
            y: 165,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // "Tap to Play" blinking text
        const tapText = this.add.text(w / 2, h - 240, '» TAP TO PLAY «', {
            fontSize: '26px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: tapText,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animate waves
        this.waves.forEach((wave, i) => {
            this.tweens.add({
                targets: wave,
                x: wave.x + 30,
                duration: 2000 + i * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Jennifer and Honey on the ship
        const jen = this.add.sprite(w / 2 + 30, h - 160, 'jennifer', 0).setScale(1.2);
        const honeySprite = this.add.sprite(w / 2 - 30, h - 145, 'honey', 0).setScale(1);

        // Honey bouncing
        this.tweens.add({
            targets: honeySprite,
            y: honeySprite.y - 5,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Credits text
        this.add.text(w / 2, h - 15, 'Made with love for Jennifer', {
            fontSize: '16px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFB6C1',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Click/tap to start (ignore if a debug link was clicked)
        this.debugClicked = false;
        this.startTriggered = false;
        this.input.on('pointerdown', () => {
            if (this.debugClicked || this.startTriggered) {
                this.debugClicked = false;
                return;
            }
            this.startTriggered = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('WakeUpScene');
            });
        });

        // === DEBUG: Scene select links (hidden by default, toggle with sun) ===
        const scenes = [
            ['WakeUp', 'WakeUpScene'],
            ['Tesla', 'TeslaScene'],
            ['Game', 'GameScene'],
            ['Memory', 'MemoryScene'],
            ['Shoo', 'ShooScene'],
            ['Club', 'NightClubScene'],
            ['Boss', 'BossScene'],
            ['Victory', 'VictoryScene'],
            ['Muster', 'MusterScene'],
        ];

        const debugBg = this.add.rectangle(w / 2, h - 45, 420, 70, 0x000000, 0.7)
            .setDepth(299).setVisible(false);
        this.debugLinks.push(debugBg);

        scenes.forEach((entry, i) => {
            const label = entry[0];
            const key = entry[1];
            const cols = 5;
            const bx = 60 + (i % cols) * 80;
            const by = h - 58 + Math.floor(i / cols) * 22;
            const link = this.add.text(bx, by, label, {
                fontSize: '12px',
                fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#00FFFF',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(300).setVisible(false);
            link.on('pointerdown', () => {
                this.debugClicked = true;
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.time.delayedCall(300, () => this.scene.start(key));
            });
            link.on('pointerover', () => link.setColor('#FFD700'));
            link.on('pointerout', () => link.setColor('#00FFFF'));
            this.debugLinks.push(link);
        });

        sun.on('pointerdown', () => {
            this.debugClicked = true;
            this.debugVisible = !this.debugVisible;
            this.debugLinks.forEach(obj => obj.setVisible(this.debugVisible));
        });

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createCruiseShip(x, y) {
        // Hull
        const hull = this.add.rectangle(x, y + 20, 280, 40, 0x2C3E50);
        // Deck
        const deck = this.add.rectangle(x, y, 260, 25, 0x8B6914);
        // Upper deck
        const upper = this.add.rectangle(x, y - 20, 200, 20, 0xECF0F1);
        // Windows
        for (let i = -4; i <= 4; i++) {
            this.add.rectangle(x + i * 22, y - 20, 10, 8, 0x3498DB);
        }
        // Funnel
        const funnel = this.add.rectangle(x + 40, y - 45, 20, 30, 0xE74C3C);
        const funnelTop = this.add.rectangle(x + 40, y - 62, 24, 6, 0x2C3E50);
        // Railing
        for (let i = -6; i <= 6; i++) {
            this.add.rectangle(x + i * 20, y - 10, 2, 12, 0xBDC3C7);
        }

        // Life preservers on hull
        this.add.image(x - 80, y + 15, 'life_preserver').setScale(0.8);
        this.add.image(x + 80, y + 15, 'life_preserver').setScale(0.8);
    }

    update() {
        // Move clouds
        this.clouds.forEach((cloud, i) => {
            cloud.x -= 0.2 + i * 0.1;
            if (cloud.x < -60) {
                cloud.x = this.cameras.main.width + 60;
                cloud.y = Phaser.Math.Between(20, 120);
            }
        });
    }
}
