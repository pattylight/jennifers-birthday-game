// GameScene.js — Main platforming level on the cruise ship deck
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Level dimensions
        this.levelWidth = 4000;
        this.levelHeight = 380;

        // Score
        this.martinisCollected = 0;
        this.totalMartinis = 15;

        // Set world bounds
        this.physics.world.setBounds(0, 0, this.levelWidth, this.levelHeight);

        // Draw backgrounds
        this.createBackground();

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.createLevel();

        // Create martinis (collectibles)
        this.martinis = this.physics.add.group();
        this.placeMartinis();

        // Create decorations
        this.createDecorations();

        // Create enemies (creepy men to stomp!)
        this.enemies = this.physics.add.group();
        this.createEnemies();

        // Create moving platforms
        this.movingPlatformData = [];
        this.createMovingPlatforms();

        // Create Jennifer
        this.jennifer = new Jennifer(this, 100, 230);
        this.jennifer.setDepth(10);

        // Create Honey
        this.honey = new Honey(this, 60, 230);
        this.honey.setDepth(9);

        // Collisions
        this.physics.add.collider(this.jennifer, this.platforms);
        this.physics.add.collider(this.honey, this.platforms);
        this.physics.add.overlap(this.jennifer, this.martinis, this.collectMartini, null, this);

        // Enemy collisions
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.jennifer, this.enemies, this.handleEnemyCollision, null, this);

        // Camera follows Jennifer
        this.cameras.main.setBounds(0, 0, this.levelWidth, this.levelHeight);
        this.cameras.main.startFollow(this.jennifer, true, 0.1, 0.1);

        // Touch controls
        this.controls = new TouchControls(this);

        // UI
        this.createUI();

        // End zone
        this.endZone = this.add.rectangle(this.levelWidth - 80, this.levelHeight - 60, 60, 120, 0xFFD700, 0.3);
        this.physics.add.existing(this.endZone, true);
        this.physics.add.overlap(this.jennifer, this.endZone, this.reachEnd, null, this);

        // Arrow pointing to end
        this.endArrow = this.add.text(this.levelWidth - 80, this.levelHeight - 140, 'EXIT', {
            fontSize: '24px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#44FF44', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
        this.tweens.add({
            targets: this.endArrow,
            y: this.endArrow.y - 10,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Fade in
        this.cameras.main.fadeIn(500);

        // Start background music
        this.time.delayedCall(600, () => this.startMusic());

        // Story intro overlay
        const overlay = this.add.rectangle(400, 225, 800, 450, 0x000000, 0.7)
            .setScrollFactor(0).setDepth(200);

        const storyText1 = this.add.text(400, 160, 'We made it on board!', {
            fontSize: '31px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#44FF44', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        const storyText2 = this.add.text(400, 205, 'Time to relax with some', {
            fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        const storyText3 = this.add.text(400, 240, 'Espresso Martinis!', {
            fontSize: '26px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        const storyText4 = this.add.text(400, 285, 'Avoid the creepy men trying to hit on you!', {
            fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF6666', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        const hintText = this.add.text(400, 320, 'Tip: You can double jump!', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#88CCFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        this.tweens.add({
            targets: [overlay, storyText1, storyText2, storyText3, storyText4, hintText],
            alpha: 0, duration: 800, delay: 3500,
            onComplete: () => {
                overlay.destroy(); storyText1.destroy();
                storyText2.destroy(); storyText3.destroy(); storyText4.destroy();
                hintText.destroy();
            }
        });
    }

    createBackground() {
        // Sky + ocean background (tiled)
        for (let x = 0; x < this.levelWidth; x += 800) {
            this.add.image(x + 400, 225, 'bg_ocean').setScrollFactor(0.1).setDepth(-10);
        }

        // Sun
        this.add.image(700, 50, 'sun').setScrollFactor(0.05).setScale(1.2).setDepth(-9);

        // Parallax clouds
        this.clouds = [];
        for (let i = 0; i < 10; i++) {
            const cloud = this.add.image(
                Phaser.Math.Between(0, this.levelWidth),
                Phaser.Math.Between(20, 100),
                'cloud'
            ).setScrollFactor(0.15).setScale(Phaser.Math.FloatBetween(0.4, 1)).setAlpha(0.7).setDepth(-8);
            this.clouds.push(cloud);
        }

        // Ocean at the bottom
        this.add.rectangle(this.levelWidth / 2, this.levelHeight + 30, this.levelWidth, 80, 0x1565C0)
            .setDepth(-5);

        // ==========================
        // CRUISE SHIP SCENERY (background layer, scrollFactor 0.3-0.5)
        // ==========================
        const sf = 0.4; // background scroll factor
        const dep = -4; // behind platforms but in front of ocean

        // --- ZONE 1: Pool Area (x ~100-600) ---
        // Pool water
        this.add.rectangle(350, 200, 250, 50, 0x00CED1, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(350, 200, 240, 40, 0x40E0D0, 0.45).setScrollFactor(sf).setDepth(dep);
        // Pool edge tiles
        this.add.rectangle(350, 173, 260, 6, 0xECF0F1).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(350, 223, 260, 6, 0xECF0F1).setScrollFactor(sf).setDepth(dep);
        // Pool ladder
        this.add.rectangle(230, 190, 4, 30, 0xBDC3C7).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(238, 190, 4, 30, 0xBDC3C7).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(234, 180, 12, 3, 0xBDC3C7).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(234, 190, 12, 3, 0xBDC3C7).setScrollFactor(sf).setDepth(dep);
        // Lounge chairs by pool
        this.drawLoungeChair(140, 220, sf, dep);
        this.drawLoungeChair(520, 220, sf, dep);
        // Umbrella
        this.add.triangle(160, 190, 0, 20, 15, 0, 30, 20, 0xFF4444, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(175, 210, 3, 30, 0x8B4513, 0.6).setScrollFactor(sf).setDepth(dep);
        // Pool sign
        this.add.text(350, 155, 'POOL DECK', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);

        // --- ZONE 2: Water Slide (x ~700-1100) ---
        // Slide tower
        this.add.rectangle(800, 140, 40, 160, 0x2196F3, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(800, 55, 60, 15, 0x1976D2, 0.7).setScrollFactor(sf).setDepth(dep);
        // Slide tube (curved path using rectangles)
        for (let i = 0; i < 12; i++) {
            const sx = 800 + i * 25;
            const sy = 70 + Math.sin(i * 0.6) * 20 + i * 12;
            this.add.rectangle(sx, sy, 28, 14, i % 2 === 0 ? 0xFF6B8A : 0xFF4571, 0.6)
                .setScrollFactor(sf).setDepth(dep).setAngle(Math.sin(i * 0.6) * 15);
        }
        // Splash pool at bottom
        this.add.ellipse(1080, 210, 80, 30, 0x00CED1, 0.5).setScrollFactor(sf).setDepth(dep);
        // Splash particles
        this.add.circle(1065, 195, 3, 0x87CEEB, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.circle(1090, 190, 4, 0x87CEEB, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.circle(1075, 188, 3, 0x87CEEB, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.text(800, 38, 'WATER SLIDE', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#1565C0', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);

        // --- ZONE 3: Tiki Bar (x ~1200-1600) ---
        // Bar counter
        this.add.rectangle(1400, 200, 180, 10, 0x8B4513, 0.7).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(1400, 210, 180, 20, 0x6B4226, 0.6).setScrollFactor(sf).setDepth(dep);
        // Tiki hut roof (thatched triangle)
        this.add.triangle(1400, 145, 0, 40, 110, 0, 220, 40, 0xDEB887, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.triangle(1400, 147, 0, 40, 110, 0, 220, 40, 0xD2B48C, 0.4).setScrollFactor(sf).setDepth(dep);
        // Support poles
        this.add.rectangle(1310, 180, 6, 50, 0x8B4513, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(1490, 180, 6, 50, 0x8B4513, 0.6).setScrollFactor(sf).setDepth(dep);
        // Bar stools
        for (let i = 0; i < 4; i++) {
            this.add.circle(1340 + i * 40, 218, 6, 0x444444, 0.5).setScrollFactor(sf).setDepth(dep);
            this.add.rectangle(1340 + i * 40, 225, 3, 14, 0x666666, 0.5).setScrollFactor(sf).setDepth(dep);
        }
        // Bottles on shelf
        const bottleColors = [0xFF6B8A, 0x4169E1, 0x32CD32, 0xFFD700, 0xFF4500];
        bottleColors.forEach((col, i) => {
            this.add.rectangle(1330 + i * 30, 188, 6, 14, col, 0.5).setScrollFactor(sf).setDepth(dep);
        });
        // Tiki torches
        this.add.rectangle(1290, 165, 4, 40, 0x8B4513, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.circle(1290, 142, 6, 0xFF6600, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.circle(1290, 140, 4, 0xFFD700, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.text(1400, 130, 'TIKI BAR', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);

        // --- ZONE 4: Buffet (x ~1700-2100) ---
        // Long buffet table
        this.add.rectangle(1900, 200, 240, 8, 0xECF0F1, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(1900, 210, 240, 16, 0xBDC3C7, 0.5).setScrollFactor(sf).setDepth(dep);
        // Table legs
        this.add.rectangle(1790, 222, 4, 20, 0x999999, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(2010, 222, 4, 20, 0x999999, 0.5).setScrollFactor(sf).setDepth(dep);
        // Food trays
        const foodEmojis = ['P', 'C', 'S', 'M', 'F', 'R'];
        foodEmojis.forEach((emoji, i) => {
            this.add.text(1800 + i * 38, 190, emoji, {
                fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FFD700'
            }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);
        });
        // Sneeze guard (glass over food)
        this.add.rectangle(1900, 185, 220, 3, 0xFFFFFF, 0.25).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(1900, 170, 220, 3, 0xFFFFFF, 0.15).setScrollFactor(sf).setDepth(dep);
        // Heat lamps
        this.add.triangle(1830, 165, 0, 10, 8, 0, 16, 10, 0xDDDDDD, 0.4).setScrollFactor(sf).setDepth(dep);
        this.add.triangle(1970, 165, 0, 10, 8, 0, 16, 10, 0xDDDDDD, 0.4).setScrollFactor(sf).setDepth(dep);
        this.add.text(1900, 150, 'OCEAN BUFFET', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);

        // --- ZONE 5: Nightclub / Disco (x ~2200-2700) ---
        // Club building
        this.add.rectangle(2450, 160, 260, 100, 0x1a1a2e, 0.7).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(2450, 108, 270, 6, 0xFF69B4, 0.6).setScrollFactor(sf).setDepth(dep);
        // Disco ball
        this.add.circle(2450, 130, 10, 0xCCCCCC, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.circle(2448, 128, 3, 0xFFFFFF, 0.8).setScrollFactor(sf).setDepth(dep);
        // Colored lights
        const discoColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFF00FF, 0xFFFF00, 0x00FFFF];
        discoColors.forEach((col, i) => {
            const light = this.add.circle(2350 + i * 40, 115, 5, col, 0.5)
                .setScrollFactor(sf).setDepth(dep);
            this.tweens.add({
                targets: light,
                alpha: 0.15,
                duration: 300 + i * 100,
                yoyo: true,
                repeat: -1
            });
        });
        // DJ booth
        this.add.rectangle(2500, 185, 40, 30, 0x333333, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.text(2500, 182, 'DJ', { fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FF69B4' }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.6);
        // Dance floor (checkered)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 2; j++) {
                const col = (i + j) % 2 === 0 ? 0xFF69B4 : 0x4169E1;
                this.add.rectangle(2370 + i * 20, 200 + j * 15, 18, 13, col, 0.3)
                    .setScrollFactor(sf).setDepth(dep);
            }
        }
        // Speakers
        this.add.rectangle(2340, 150, 18, 25, 0x222222, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(2560, 150, 18, 25, 0x222222, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.text(2450, 95, 'CLUB OCEANA', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF69B4', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.8);

        // --- ZONE 6: Mini Golf (x ~2800-3200) ---
        // Green turf
        this.add.rectangle(3000, 210, 200, 30, 0x228B22, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.ellipse(3000, 195, 220, 10, 0x2E8B57, 0.3).setScrollFactor(sf).setDepth(dep);
        // Hole
        this.add.circle(3060, 205, 5, 0x111111, 0.6).setScrollFactor(sf).setDepth(dep);
        // Flag
        this.add.rectangle(3060, 192, 2, 20, 0xDDDDDD, 0.6).setScrollFactor(sf).setDepth(dep);
        this.add.triangle(3060, 182, 0, 0, 0, 10, 14, 5, 0xFF4444, 0.6).setScrollFactor(sf).setDepth(dep);
        // Windmill obstacle
        this.add.rectangle(2940, 180, 20, 40, 0xFF8C00, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.triangle(2940, 157, 0, 8, 8, 0, 16, 8, 0xFF4500, 0.5).setScrollFactor(sf).setDepth(dep);
        // Sand bunker
        this.add.ellipse(3050, 215, 40, 12, 0xF4D03F, 0.4).setScrollFactor(sf).setDepth(dep);
        this.add.text(3000, 165, 'MINI GOLF', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#228B22', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);

        // --- ZONE 7: Spa / Hot Tubs (x ~3300-3600) ---
        // Hot tub 1
        this.add.ellipse(3400, 205, 70, 35, 0x4169E1, 0.4).setScrollFactor(sf).setDepth(dep);
        this.add.ellipse(3400, 205, 60, 26, 0x5DADE2, 0.5).setScrollFactor(sf).setDepth(dep);
        // Steam/bubbles
        for (let i = 0; i < 5; i++) {
            const bub = this.add.circle(3385 + i * 8, 195 - i * 3, 2 + Math.random() * 2, 0xFFFFFF, 0.3)
                .setScrollFactor(sf).setDepth(dep);
            this.tweens.add({
                targets: bub,
                y: bub.y - 15,
                alpha: 0,
                duration: 1500 + i * 300,
                yoyo: false,
                repeat: -1
            });
        }
        // Hot tub 2
        this.add.ellipse(3520, 205, 60, 30, 0x4169E1, 0.4).setScrollFactor(sf).setDepth(dep);
        this.add.ellipse(3520, 205, 50, 22, 0x5DADE2, 0.5).setScrollFactor(sf).setDepth(dep);
        // Towels
        this.add.rectangle(3460, 218, 16, 8, 0xFFFFFF, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(3462, 216, 14, 4, 0xFF69B4, 0.4).setScrollFactor(sf).setDepth(dep);
        this.add.text(3450, 170, 'SPA & HOT TUB', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#4169E1', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);

        // --- ZONE 8: Captain's Bridge / Finish (x ~3700-3900) ---
        // Bridge structure
        this.add.rectangle(3800, 140, 120, 80, 0xECF0F1, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(3800, 98, 130, 6, 0x2C3E50, 0.6).setScrollFactor(sf).setDepth(dep);
        // Window
        this.add.rectangle(3800, 130, 80, 30, 0x85C1E9, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(3800, 130, 76, 26, 0xAED6F1, 0.4).setScrollFactor(sf).setDepth(dep);
        // Ship wheel
        this.add.circle(3800, 130, 8, 0x8B4513, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.circle(3800, 130, 4, 0xA0522D, 0.5).setScrollFactor(sf).setDepth(dep);
        // Radar dome
        this.add.ellipse(3830, 95, 20, 10, 0xBDC3C7, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.rectangle(3830, 88, 2, 20, 0xBDC3C7, 0.5).setScrollFactor(sf).setDepth(dep);
        // Antenna
        this.add.rectangle(3770, 80, 2, 30, 0xCCCCCC, 0.4).setScrollFactor(sf).setDepth(dep);
        this.add.circle(3770, 64, 3, 0xFF0000, 0.5).setScrollFactor(sf).setDepth(dep);
        this.add.text(3800, 85, 'BRIDGE', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#2C3E50', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(sf).setDepth(dep).setAlpha(0.7);

        // --- Distant ships on the ocean horizon ---
        this.drawDistantShip(200, 320, 0.08, dep - 1);
        this.drawDistantShip(600, 340, 0.06, dep - 1);
        this.drawDistantShip(1100, 310, 0.07, dep - 1);

        // --- Seagulls flying in the background ---
        for (let i = 0; i < 6; i++) {
            const gx = Phaser.Math.Between(100, this.levelWidth - 100);
            const gy = Phaser.Math.Between(40, 130);
            const gull = this.add.text(gx, gy, '~', {
                fontSize: '21px', fontFamily: 'serif', color: '#555555'
            }).setScrollFactor(0.12).setDepth(dep).setAlpha(0.4);
            this.tweens.add({
                targets: gull,
                x: gull.x + Phaser.Math.Between(50, 150),
                y: gull.y + Phaser.Math.Between(-10, 10),
                duration: Phaser.Math.Between(8000, 15000),
                yoyo: true,
                repeat: -1
            });
        }
    }

    drawLoungeChair(x, y, sf, dep) {
        // Simple side-view lounge chair
        this.add.rectangle(x, y, 30, 5, 0x2196F3, 0.5).setScrollFactor(sf).setDepth(dep); // seat
        this.add.rectangle(x - 12, y - 8, 8, 14, 0x2196F3, 0.5).setScrollFactor(sf).setDepth(dep); // back
        this.add.rectangle(x - 10, y + 6, 3, 8, 0x666666, 0.4).setScrollFactor(sf).setDepth(dep); // leg
        this.add.rectangle(x + 10, y + 6, 3, 8, 0x666666, 0.4).setScrollFactor(sf).setDepth(dep); // leg
    }

    drawDistantShip(x, y, sf, dep) {
        this.add.rectangle(x, y, 50, 12, 0x2C3E50, 0.25).setScrollFactor(sf).setDepth(dep); // hull
        this.add.rectangle(x, y - 10, 35, 8, 0xECF0F1, 0.2).setScrollFactor(sf).setDepth(dep); // upper
        this.add.rectangle(x + 8, y - 22, 6, 16, 0xBBBBBB, 0.2).setScrollFactor(sf).setDepth(dep); // funnel
    }

    createLevel() {
        // Main deck floor (continuous ground)
        for (let x = 0; x < this.levelWidth; x += 32) {
            const tile = this.platforms.create(x + 16, this.levelHeight - 16, 'deck_tile');
            tile.setDisplaySize(32, 32);
            tile.refreshBody();
        }
        // Second layer for thickness
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.add.rectangle(x + 16, this.levelHeight, 32, 16, 0x6B5210);
        }

        // Elevated platforms — cruise ship themed (deck chairs, tables, etc.)
        const platformLayout = [
            // x, y, width (in tiles), type
            { x: 250, y: 280, w: 3, type: 'deck' },
            { x: 400, y: 230, w: 4, type: 'deck' },
            { x: 600, y: 190, w: 3, type: 'deck' },
            { x: 800, y: 250, w: 5, type: 'deck' },
            { x: 1050, y: 190, w: 3, type: 'deck' },
            { x: 1200, y: 130, w: 4, type: 'deck' },
            { x: 1450, y: 210, w: 3, type: 'deck' },
            { x: 1600, y: 270, w: 4, type: 'deck' },
            { x: 1800, y: 170, w: 3, type: 'deck' },
            { x: 2000, y: 230, w: 5, type: 'deck' },
            { x: 2200, y: 130, w: 3, type: 'deck' },
            { x: 2400, y: 190, w: 4, type: 'deck' },
            { x: 2650, y: 250, w: 3, type: 'deck' },
            { x: 2850, y: 160, w: 4, type: 'deck' },
            { x: 3100, y: 210, w: 3, type: 'deck' },
            { x: 3300, y: 130, w: 4, type: 'deck' },
            { x: 3550, y: 230, w: 5, type: 'deck' },
            { x: 3750, y: 180, w: 3, type: 'deck' },
        ];

        platformLayout.forEach(p => {
            for (let i = 0; i < p.w; i++) {
                const tile = this.platforms.create(p.x + i * 32, p.y, 'deck_tile');
                tile.setDisplaySize(32, 32);
                tile.refreshBody();
            }
        });

        // Pool float platforms (bouncy!)
        const floatPositions = [
            { x: 550, y: 280 },
            { x: 1350, y: 240 },
            { x: 2100, y: 280 },
            { x: 2900, y: 280 },
            { x: 3650, y: 270 },
        ];

        floatPositions.forEach(fp => {
            const float = this.platforms.create(fp.x, fp.y, 'pool_float');
            float.setDisplaySize(64, 24);
            float.refreshBody();
        });
    }

    placeMartinis() {
        const martiniPositions = [
            { x: 280, y: 240 },
            { x: 430, y: 190 },
            { x: 600, y: 150 },
            { x: 800, y: 210 },
            { x: 1080, y: 150 },
            { x: 1250, y: 90 },
            { x: 1480, y: 170 },
            { x: 1700, y: 230 },
            { x: 1850, y: 130 },
            { x: 2050, y: 190 },
            { x: 2250, y: 90 },
            { x: 2500, y: 150 },
            { x: 2900, y: 120 },
            { x: 3350, y: 90 },
            { x: 3600, y: 190 },
        ];

        martiniPositions.forEach((pos, i) => {
            const martini = this.martinis.create(pos.x, pos.y, 'martini');
            martini.body.setAllowGravity(false);
            martini.setDepth(8);

            // Floating animation
            this.tweens.add({
                targets: martini,
                y: pos.y - 8,
                duration: 1000 + i * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    createDecorations() {
        // Life preservers on the walls
        const lpPositions = [200, 700, 1300, 1900, 2500, 3100, 3700];
        lpPositions.forEach(x => {
            this.add.image(x, this.levelHeight - 80, 'life_preserver')
                .setScale(1.2).setDepth(1).setAlpha(0.6);
        });

        // Deck chairs (simple rectangles as decoration)
        const chairPositions = [300, 900, 1500, 2300, 3000, 3500];
        chairPositions.forEach(x => {
            this.add.rectangle(x, this.levelHeight - 50, 20, 25, 0x2196F3)
                .setDepth(1).setAlpha(0.5);
            this.add.rectangle(x + 10, this.levelHeight - 38, 25, 6, 0x2196F3)
                .setDepth(1).setAlpha(0.5);
        });

        // Potted palm trees along the deck
        const palmPositions = [150, 650, 1100, 1700, 2350, 2950, 3450];
        palmPositions.forEach(x => {
            // Pot
            this.add.rectangle(x, this.levelHeight - 42, 16, 14, 0xCC5500).setDepth(1).setAlpha(0.6);
            // Trunk
            this.add.rectangle(x, this.levelHeight - 60, 4, 25, 0x8B6914).setDepth(1).setAlpha(0.6);
            // Leaves
            this.add.ellipse(x - 8, this.levelHeight - 72, 18, 8, 0x228B22, 0.5).setDepth(1);
            this.add.ellipse(x + 8, this.levelHeight - 72, 18, 8, 0x228B22, 0.5).setDepth(1);
            this.add.ellipse(x, this.levelHeight - 78, 12, 10, 0x2E8B57, 0.5).setDepth(1);
        });

        // Rope lights strung overhead (festive glow)
        for (let x = 100; x < this.levelWidth - 100; x += 60) {
            const bulbColor = [0xFFD700, 0xFF69B4, 0x87CEEB, 0xFF6B8A][Math.floor(x / 60) % 4];
            this.add.circle(x, this.levelHeight - 160, 3, bulbColor, 0.4).setDepth(2);
        }

        // Shuffleboard markings on some deck areas
        [500, 1800, 3200].forEach(x => {
            this.add.triangle(x, this.levelHeight - 40, 0, 20, 10, 0, 20, 20, 0xFFFFFF, 0.15).setDepth(0);
            this.add.rectangle(x + 25, this.levelHeight - 38, 30, 16, 0xFFFFFF, 0.08).setDepth(0);
        });
    }

    createEnemies() {
        const groundY = this.levelHeight - 60;
        const enemyPositions = [
            { x: 270, y: groundY, leftBound: 200, rightBound: 400 },
            { x: 550, y: groundY, leftBound: 450, rightBound: 700 },
            { x: 900, y: groundY, leftBound: 800, rightBound: 1050 },
            { x: 1250, y: groundY, leftBound: 1150, rightBound: 1400 },
            { x: 1650, y: groundY, leftBound: 1550, rightBound: 1800 },
            { x: 2050, y: groundY, leftBound: 1950, rightBound: 2200 },
            { x: 2450, y: groundY, leftBound: 2350, rightBound: 2600 },
            { x: 2900, y: groundY, leftBound: 2800, rightBound: 3050 },
            { x: 3350, y: groundY, leftBound: 3250, rightBound: 3500 },
        ];

        enemyPositions.forEach(ep => {
            const enemy = this.enemies.create(ep.x, ep.y, 'creepy_man');
            enemy.body.setAllowGravity(true);
            enemy.setDepth(8);
            enemy.body.setSize(28, 34).setOffset(2, 3);
            enemy.setData('leftBound', ep.leftBound);
            enemy.setData('rightBound', ep.rightBound);
            enemy.setData('speed', 45 + Math.random() * 20);
            enemy.setData('dir', 1);
        });
    }

    createMovingPlatforms() {
        const configs = [
            { x: 700, y: 220, tiles: 3, minX: 600, maxX: 850, speed: 40 },
            { x: 1700, y: 190, tiles: 3, minX: 1600, maxX: 1850, speed: 50 },
            { x: 2600, y: 200, tiles: 3, minX: 2500, maxX: 2750, speed: 45 },
            { x: 3400, y: 190, tiles: 3, minX: 3300, maxX: 3550, speed: 55 },
        ];

        configs.forEach(cfg => {
            const tiles = [];
            for (let i = 0; i < cfg.tiles; i++) {
                const tile = this.platforms.create(cfg.x + i * 32, cfg.y, 'deck_tile');
                tile.setDisplaySize(32, 32);
                tile.refreshBody();
                tile.setTint(0x44BBFF);
                tiles.push(tile);
            }

            // Arrow indicators
            const arrow = this.add.text(cfg.x + (cfg.tiles * 16), cfg.y - 20, '<->', {
                fontSize: '18px'
            }).setOrigin(0.5).setDepth(3).setAlpha(0.5);

            this.movingPlatformData.push({
                tiles: tiles,
                arrow: arrow,
                minX: cfg.minX,
                maxX: cfg.maxX,
                speed: cfg.speed,
                dir: 1,
                currentX: cfg.x
            });
        });
    }

    handleEnemyCollision(jennifer, enemy) {
        if (jennifer.body.velocity.y > 0 && jennifer.y < enemy.y - 8) {
            // Stomp!
            enemy.destroy();
            jennifer.setVelocityY(-300);

            // Squish effect
            const squish = this.add.text(enemy.x, enemy.y, 'POW!', { fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FF4444', stroke: '#000000', strokeThickness: 3 })
                .setOrigin(0.5).setDepth(20);
            this.tweens.add({
                targets: squish,
                y: squish.y - 30,
                alpha: 0,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 500,
                onComplete: () => squish.destroy()
            });

            // Stars scatter
            for (let i = 0; i < 5; i++) {
                const star = this.add.text(
                    enemy.x + Phaser.Math.Between(-15, 15),
                    enemy.y,
                    '*', { fontSize: '18px' }
                ).setDepth(20);
                this.tweens.add({
                    targets: star,
                    x: star.x + Phaser.Math.Between(-30, 30),
                    y: star.y - Phaser.Math.Between(15, 40),
                    alpha: 0,
                    duration: 600,
                    delay: i * 50,
                    onComplete: () => star.destroy()
                });
            }

            this.playStompSound();
        } else {
            jennifer.hurt();
        }
    }

    playStompSound() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.2);
        } catch(e) {}
    }

    collectMartini(jennifer, martini) {
        this.martinisCollected++;
        martini.disableBody(true, true);

        // Sparkle effect
        const sparkle = this.add.image(martini.x, martini.y, 'sparkle').setDepth(20);
        this.tweens.add({
            targets: sparkle,
            scaleX: 2.5,
            scaleY: 2.5,
            alpha: 0,
            duration: 400,
            onComplete: () => sparkle.destroy()
        });

        // Score popup
        const popup = this.add.text(martini.x, martini.y - 20, '+1', {
            fontSize: '22px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: popup,
            y: popup.y - 40,
            alpha: 0,
            duration: 800,
            onComplete: () => popup.destroy()
        });

        // Update UI
        this.scoreText.setText(this.martinisCollected + '/' + this.totalMartinis);

        // Collection sound
        this.playCollectSound();

        // Heart particles from Honey
        if (this.honey) {
            for (let i = 0; i < 3; i++) {
                const heart = this.add.image(this.honey.x, this.honey.y - 15, 'heart')
                    .setScale(0.8).setDepth(20);
                this.tweens.add({
                    targets: heart,
                    x: heart.x + Phaser.Math.Between(-20, 20),
                    y: heart.y - Phaser.Math.Between(15, 35),
                    alpha: 0,
                    duration: 600,
                    delay: i * 100,
                    onComplete: () => heart.destroy()
                });
            }
        }
    }

    playCollectSound() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            const notes = [523, 659, 784]; // C5, E5, G5
            notes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.2);
                osc.start(audioCtx.currentTime + i * 0.08);
                osc.stop(audioCtx.currentTime + i * 0.08 + 0.2);
            });
        } catch(e) {}
    }

    reachEnd() {
        if (this.reachedEnd) return;
        this.reachedEnd = true;

        // Store score
        this.registry.set('martinisCollected', this.martinisCollected);
        this.registry.set('totalMartinis', this.totalMartinis);

        // Stop music
        this.stopMusic();

        // Story outro
        const overlay = this.add.rectangle(400, 225, 800, 450, 0x000000, 0.7)
            .setScrollFactor(0).setDepth(200);
        const outroT1 = this.add.text(400, 190, 'Hurry up!', {
            fontSize: '29px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setScale(0.5);
        const outroT2 = this.add.text(400, 235, 'Our chocolate pairing class starts soon!', {
            fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);

        this.tweens.add({
            targets: outroT1, scaleX: 1, scaleY: 1,
            duration: 500, ease: 'Back.easeOut'
        });
        this.tweens.add({
            targets: outroT2, alpha: 1,
            duration: 500, delay: 800
        });

        // Transition to MemoryScene
        this.controls.hide();
        this.time.delayedCall(3500, () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.controls.destroy();
                this.scene.start('MemoryScene');
            });
        });
    }

    startMusic() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            this.musicPlaying = true;
            this.musicOscillators = [];
            this.musicTimers = [];

            const bpm = 140;
            const eighth = 60 / bpm / 2;

            // Fun 8-bit cruise melody (C major, bouncy tropical vibe)
            // [frequency, duration_in_eighths] — 0 = rest
            const melody = [
                // Bar 1: Upbeat opening riff
                [523,1],[659,1],[784,1],[880,1],[784,1],[659,1],[523,1],[0,1],
                // Bar 2: Call-and-response
                [698,1],[784,1],[880,1],[784,1],[698,1],[659,1],[587,1],[0,1],
                // Bar 3: Ascending excitement
                [523,1],[587,1],[659,1],[784,1],[880,1],[988,1],[1047,1],[988,1],
                // Bar 4: Resolution
                [880,1],[784,1],[698,1],[659,1],[523,2],[0,2],
                // Bar 5: Fun variation
                [784,1],[784,1],[0,1],[659,1],[659,1],[0,1],[523,1],[659,1],
                // Bar 6: Bouncy
                [784,1],[880,1],[784,1],[659,1],[698,1],[659,1],[587,1],[0,1],
                // Bar 7: Climax phrase
                [523,1],[659,1],[784,1],[1047,1],[880,1],[784,1],[659,1],[784,1],
                // Bar 8: Ending turnaround
                [880,1],[784,1],[659,1],[523,1],[587,1],[659,1],[523,2],
            ];

            // Bass line (lower octave, root movement)
            const bass = [
                [131,2],[131,2],[196,2],[196,2],
                [175,2],[175,2],[131,2],[131,2],
                [131,2],[147,2],[165,2],[196,2],
                [220,2],[196,2],[131,4],
                [196,2],[196,2],[165,2],[165,2],
                [175,2],[220,2],[175,2],[147,2],
                [131,2],[165,2],[196,2],[262,2],
                [220,2],[196,2],[165,2],[131,2],
            ];

            // Chord arpeggios (mid register, provides harmony)
            const chords = [
                [330,4],[392,4],[349,4],[392,4],
                [330,4],[294,4],[262,4],[330,4],
            ];

            const melodyLen = melody.reduce((s, n) => s + n[1], 0);
            const loopDuration = melodyLen * eighth;

            const scheduleLoop = () => {
                if (!this.musicPlaying) return;
                const now = audioCtx.currentTime + 0.05;

                // Melody voice (square wave)
                let t = now;
                melody.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'square';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.035, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * eighth - 0.01);
                        osc.start(t);
                        osc.stop(t + dur * eighth);
                        this.musicOscillators.push(osc);
                    }
                    t += dur * eighth;
                });

                // Bass voice (triangle wave — softer, warmer)
                t = now;
                bass.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.04, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * eighth - 0.01);
                        osc.start(t);
                        osc.stop(t + dur * eighth);
                        this.musicOscillators.push(osc);
                    }
                    t += dur * eighth;
                });

                // Chord pads (sine wave — gentle background harmony)
                t = now;
                chords.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'sine';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.02, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * eighth - 0.01);
                        osc.start(t);
                        osc.stop(t + dur * eighth);
                        this.musicOscillators.push(osc);
                    }
                    t += dur * eighth;
                });

                const timer = setTimeout(() => scheduleLoop(), (loopDuration - 0.1) * 1000);
                this.musicTimers.push(timer);
            };

            scheduleLoop();
        } catch(e) {}
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.musicTimers) {
            this.musicTimers.forEach(t => clearTimeout(t));
            this.musicTimers = [];
        }
        if (this.musicOscillators) {
            this.musicOscillators.forEach(osc => {
                try { osc.stop(); } catch(e) {}
            });
            this.musicOscillators = [];
        }
    }

    createUI() {
        // Martini icon in UI
        this.scoreIcon = this.add.image(30, 28, 'martini')
            .setScrollFactor(0).setDepth(100).setScale(1.2);

        // Martini counter text (just the numbers)
        this.scoreText = this.add.text(50, 20, '0/' + this.totalMartinis, {
            fontSize: '27px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(100);

        // "HONEY" label above the dog
        this.honeyLabel = this.add.text(0, 0, 'HONEY', {
            fontSize: '14px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);
    }

    update(time, delta) {
        // Update controls
        this.controls.update();

        // Pass input state to Jennifer
        const state = this.controls.getState();
        this.jennifer.inputState = state;
        this.jennifer.update();

        // Update Honey
        this.honey.update(this.jennifer);

        // Update Honey label position
        if (this.honeyLabel && this.honey) {
            this.honeyLabel.x = this.honey.x;
            this.honeyLabel.y = this.honey.y - 30;
        }

        // Move clouds slowly
        this.clouds.forEach((cloud, i) => {
            cloud.x -= 0.1 + i * 0.02;
            if (cloud.x < -100) {
                cloud.x = this.levelWidth + 100;
            }
        });

        // Update enemies (patrol AI)
        if (this.enemies) {
            this.enemies.getChildren().forEach(enemy => {
                if (!enemy.active) return;
                const dir = enemy.getData('dir');
                const speed = enemy.getData('speed');
                enemy.setVelocityX(speed * dir);
                enemy.setFlipX(dir < 0);

                if (enemy.x >= enemy.getData('rightBound')) {
                    enemy.setData('dir', -1);
                } else if (enemy.x <= enemy.getData('leftBound')) {
                    enemy.setData('dir', 1);
                }
            });
        }

        // Update moving platforms
        if (this.movingPlatformData) {
            this.movingPlatformData.forEach(mp => {
                mp.currentX += mp.speed * mp.dir * (delta / 1000);
                if (mp.currentX > mp.maxX) { mp.currentX = mp.maxX; mp.dir = -1; }
                if (mp.currentX < mp.minX) { mp.currentX = mp.minX; mp.dir = 1; }

                mp.tiles.forEach((tile, i) => {
                    tile.setPosition(mp.currentX + i * 32, tile.y);
                    tile.refreshBody();
                });
                mp.arrow.x = mp.currentX + (mp.tiles.length * 16);
            });
        }
    }
}
