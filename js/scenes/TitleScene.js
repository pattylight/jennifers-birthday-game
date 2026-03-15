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

        // Sun
        this.add.image(w - 80, 60, 'sun').setScale(1.5);

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
            fontSize: '36px',
            fontFamily: 'Courier New, monospace',
            color: '#000000',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5).setAlpha(0.3);

        const title = this.add.text(w / 2, 60, "Jenny's\nFirst Cruise", {
            fontSize: '36px',
            fontFamily: 'Courier New, monospace',
            color: '#FFD700',
            align: 'center',
            stroke: '#8B4513',
            strokeThickness: 4,
            lineSpacing: 5
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(w / 2, 125, '~ ~ ~', {
            fontSize: '24px',
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
        const tapText = this.add.text(w / 2, h - 200, '» TAP TO PLAY «', {
            fontSize: '22px',
            fontFamily: 'Courier New, monospace',
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
            fontSize: '11px',
            fontFamily: 'Courier New, monospace',
            color: '#FFB6C1',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Click/tap to start
        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('TeslaScene');
            });
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
