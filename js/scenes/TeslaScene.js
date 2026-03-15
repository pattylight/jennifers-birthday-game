// TeslaScene.js — Jennifer takes her 2025 White Tesla Model Y for a drive!
class TeslaScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TeslaScene' });
    }

    create() {
        const w = 800, h = 450;

        // Cleanup on scene shutdown
        this.events.on('shutdown', () => {
            this.removeTouchButtons();
            this.stopDrivingMusic();
        });

        // === SKY ===
        this.add.rectangle(w / 2, 45, w, 90, 0x87CEEB).setDepth(-10);
        this.add.rectangle(w / 2, 85, w, 10, 0xFFCC80, 0.3).setDepth(-9);

        // === CITY SKYLINE (scrolling) ===
        this.skyline = [];
        const buildColors = [0x455A64, 0x546E7A, 0x37474F, 0x607D8B, 0x78909C];
        for (let i = 0; i < 20; i++) {
            const bx = i * 75;
            const bh = 25 + Math.abs(Math.sin(i * 1.3)) * 55;
            const bw = 30 + (i % 3) * 15;
            const building = this.add.rectangle(bx, 90 - bh / 2 + 15, bw, bh, buildColors[i % 5], 0.5).setDepth(-8);
            this.skyline.push(building);
        }

        // Scrolling clouds
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.ellipse(
                Phaser.Math.Between(0, w * 2), Phaser.Math.Between(15, 60),
                Phaser.Math.Between(40, 70), Phaser.Math.Between(15, 25),
                0xFFFFFF, 0.4
            ).setDepth(-9);
            this.clouds.push(cloud);
        }

        // === GRASS STRIPS ===
        this.add.rectangle(w / 2, 132, w, 16, 0x4CAF50).setDepth(-1);
        this.add.rectangle(w / 2, h - 12, w, 24, 0x4CAF50).setDepth(-1);

        // === ROAD ===
        this.roadTop = 140;
        this.roadBottom = h - 24;
        const roadH = this.roadBottom - this.roadTop;
        this.add.rectangle(w / 2, this.roadTop + roadH / 2, w, roadH, 0x555555).setDepth(0);

        // Road edge lines
        this.add.rectangle(w / 2, this.roadTop, w, 4, 0xFFFFFF).setDepth(2);
        this.add.rectangle(w / 2, this.roadBottom, w, 4, 0xFFFFFF).setDepth(2);

        // 3 lanes
        const laneH = roadH / 3;
        this.laneY = [
            this.roadTop + laneH * 0.5,
            this.roadTop + laneH * 1.5,
            this.roadTop + laneH * 2.5
        ];
        this.currentLane = 1;

        // Dashed lane dividers (scrolling)
        this.laneMarkers = [];
        const divY1 = this.roadTop + laneH;
        const divY2 = this.roadTop + laneH * 2;
        for (let x = 0; x < w + 80; x += 80) {
            this.laneMarkers.push(
                this.add.rectangle(x, divY1, 40, 3, 0xFFFF00, 0.6).setDepth(1),
                this.add.rectangle(x, divY2, 40, 3, 0xFFFF00, 0.6).setDepth(1)
            );
        }

        // Road shoulder rumble strips
        for (let x = 0; x < w; x += 24) {
            this.add.rectangle(x, this.roadTop + 5, 10, 3, 0xDDDDDD, 0.25).setDepth(1);
            this.add.rectangle(x, this.roadBottom - 5, 10, 3, 0xDDDDDD, 0.25).setDepth(1);
        }

        // === TESLA ===
        this.tesla = this.add.image(140, this.laneY[1], 'tesla').setDepth(5);

        // "Model Y" label
        this.teslaLabel = this.add.text(140, this.laneY[1] + 26, 'MODEL Y', {
            fontSize: '13px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(7).setAlpha(0.6);

        // === GAME STATE ===
        this.speed = 200;
        this.distance = 0;
        this.targetDistance = 10000;
        this.lives = 3;
        this.isInvulnerable = false;
        this.obstacles = [];
        this.pickups = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 1400;
        this.gameStarted = false;
        this.gameOver = false;
        this.canSwitchLane = true;
        this.nearMissCount = 0;

        // === INPUT ===
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S
        });
        this.createTouchButtons();

        // === UI ===
        this.createUI();

        // === INTRO ===
        const intro1 = this.add.text(w / 2, h / 2 - 55, 'Patrick & Jennifer are LATE!', {
            fontSize: '26px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF4444', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(200);

        const intro2 = this.add.text(w / 2, h / 2 - 18, 'The cruise ship leaves in 10 minutes!', {
            fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(200);

        const intro3 = this.add.text(w / 2, h / 2 + 15, 'Floor it, Jennifer!!', {
            fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(200);

        const intro4 = this.add.text(w / 2, h / 2 + 50, 'UP / DOWN - Dodge obstacles!', {
            fontSize: '21px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#AAAAAA', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(200);

        this.tweens.add({
            targets: [intro1, intro2, intro3, intro4],
            alpha: 0, duration: 800, delay: 3200,
            onComplete: () => {
                intro1.destroy(); intro2.destroy(); intro3.destroy(); intro4.destroy();
                this.gameStarted = true;
            }
        });

        this.time.delayedCall(500, () => this.startDrivingMusic());
        this.cameras.main.fadeIn(500);
    }

    createTouchButtons() {
        const makeBtn = (label, extra) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.cssText = 'position:fixed;width:60px;height:60px;font-size:24px;border-radius:50%;border:3px solid rgba(255,255,255,0.5);background:rgba(68,187,255,0.4);color:white;z-index:9999;touch-action:manipulation;-webkit-tap-highlight-color:transparent;' + extra;
            document.body.appendChild(btn);
            return btn;
        };
        this.upBtn = makeBtn('UP', 'right:20px;top:28%;');
        this.downBtn = makeBtn('DN', 'right:20px;top:52%;');

        const bind = (btn, dir) => {
            const handler = (e) => { e.preventDefault(); this.switchLane(dir); };
            btn.addEventListener('touchstart', handler, { passive: false });
            btn.addEventListener('mousedown', handler);
        };
        bind(this.upBtn, -1);
        bind(this.downBtn, 1);
    }

    removeTouchButtons() {
        [this.upBtn, this.downBtn].forEach(btn => {
            if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
        });
        this.upBtn = null;
        this.downBtn = null;
    }

    switchLane(dir) {
        if (!this.canSwitchLane || this.gameOver || !this.gameStarted) return;
        const newLane = this.currentLane + dir;
        if (newLane < 0 || newLane > 2) return;

        this.currentLane = newLane;
        this.canSwitchLane = false;
        const targetY = this.laneY[this.currentLane];

        this.tweens.add({
            targets: this.tesla,
            y: targetY, duration: 180, ease: 'Power2',
            onComplete: () => { this.canSwitchLane = true; }
        });
        this.tweens.add({ targets: this.teslaLabel, y: targetY + 26, duration: 180, ease: 'Power2' });

        this.playLaneChangeSound();
    }

    createUI() {
        const w = 800;
        this.livesText = this.add.text(20, 12, '❤️❤️❤️', { fontSize: '24px' }).setDepth(100);

        // Progress bar
        this.add.rectangle(w / 2, 14, 204, 14, 0x333333).setDepth(99);
        this.add.rectangle(w / 2, 14, 208, 18).setDepth(98).setFillStyle(0, 0).setStrokeStyle(2, 0xFFFFFF);
        this.progressBar = this.add.rectangle(w / 2 - 100, 14, 0, 10, 0x44FF44).setOrigin(0, 0.5).setDepth(100);

        // Destination label
        this.add.text(w / 2 + 110, 14, 'PORT', { fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2 }).setOrigin(0, 0.5).setDepth(100);

        this.distText = this.add.text(w / 2, 30, '0m / 6000m', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        this.speedText = this.add.text(w - 15, 14, '60 mph', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#44FF44', stroke: '#000000', strokeThickness: 2
        }).setOrigin(1, 0.5).setDepth(100);
    }

    spawnObstacle() {
        const w = 800;
        const lane = Phaser.Math.Between(0, 2);
        const isCone = Math.random() < 0.4;
        const texture = isCone ? 'traffic_cone' : 'obstacle_car';

        const obs = this.add.image(w + 50, this.laneY[lane], texture).setDepth(4);
        obs.lane = lane;
        obs.hit = false;
        obs.nearMissed = false;
        this.obstacles.push(obs);

        // Double obstacle at higher distances
        if (this.distance > 800 && Math.random() < 0.3) {
            const lane2 = (lane + Phaser.Math.Between(1, 2)) % 3;
            const obs2 = this.add.image(w + 50, this.laneY[lane2],
                Math.random() < 0.5 ? 'traffic_cone' : 'obstacle_car').setDepth(4);
            obs2.lane = lane2;
            obs2.hit = false;
            obs2.nearMissed = false;
            this.obstacles.push(obs2);
        }

        // Charge pickup when missing lives
        if (this.lives < 3 && Math.random() < 0.15) {
            const pLane = Phaser.Math.Between(0, 2);
            const pickup = this.add.text(w + 40, this.laneY[pLane], '+HP', { fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#44FF44', stroke: '#000000', strokeThickness: 2 })
                .setOrigin(0.5).setDepth(6);
            pickup.lane = pLane;
            pickup.collected = false;
            this.pickups.push(pickup);
        }
    }

    hitObstacle() {
        if (this.isInvulnerable || this.gameOver) return;

        this.lives--;
        this.isInvulnerable = true;
        this.updateLivesDisplay();

        // Slow down on crash
        this.speed = Math.max(200, this.speed * 0.4);

        // Flash Tesla
        this.tweens.add({
            targets: [this.tesla],
            alpha: 0.3, duration: 100, yoyo: true, repeat: 5,
            onComplete: () => {
                if (this.tesla) this.tesla.alpha = 1;
                this.time.delayedCall(400, () => { this.isInvulnerable = false; });
            }
        });

        // Impact
        const boom = this.add.text(this.tesla.x + 35, this.tesla.y, 'CRASH!', { fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FF4444', stroke: '#000000', strokeThickness: 3 })
            .setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: boom, scaleX: 1.5, scaleY: 1.5, alpha: 0,
            duration: 400, onComplete: () => boom.destroy()
        });

        this.playHitSound();
        this.cameras.main.shake(200, 0.008);

        if (this.lives <= 0) this.triggerGameOver();
    }

    collectPickup(pickup) {
        if (pickup.collected) return;
        pickup.collected = true;

        if (this.lives < 3) {
            this.lives++;
            this.updateLivesDisplay();
        }

        const sparkle = this.add.text(pickup.x, pickup.y, '+1 HP', {
            fontSize: '21px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: sparkle, y: sparkle.y - 25, alpha: 0,
            duration: 600, onComplete: () => sparkle.destroy()
        });

        pickup.destroy();
        this.playPickupSound();
    }

    showNearMiss(x, y) {
        this.nearMissCount++;
        const texts = ['CLOSE!', 'WHEW!', 'NICE!', 'SMOOTH!'];
        const msg = this.add.text(x, y - 25, texts[this.nearMissCount % texts.length], {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#44FF44', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: msg, y: msg.y - 20, alpha: 0,
            duration: 500, onComplete: () => msg.destroy()
        });
    }

    updateLivesDisplay() {
        this.livesText.setText('❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives));
    }

    triggerGameOver() {
        this.gameOver = true;
        this.stopDrivingMusic();
        const w = 800, h = 450;

        this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6).setDepth(200);

        this.add.text(w / 2, h / 2 - 30, 'CRASH! Try again!', {
            fontSize: '34px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF4444', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(201);

        const retryBtn = this.add.text(w / 2, h / 2 + 30, '>> Retry <<', {
            fontSize: '26px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', backgroundColor: '#44AA44',
            padding: { x: 20, y: 8 }
        }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

        retryBtn.on('pointerdown', () => {
            this.removeTouchButtons();
            this.scene.restart();
        });
    }

    reachDestination() {
        if (this.gameOver) return;
        this.gameOver = true;
        this.stopDrivingMusic();

        const w = 800, h = 450;

        const text = this.add.text(w / 2, h / 2 - 10, 'We made it!!\nTime to board the cruise!', {
            fontSize: '24px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4,
            align: 'center', lineSpacing: 8
        }).setOrigin(0.5).setDepth(200).setScale(0.5);

        this.tweens.add({
            targets: text, scaleX: 1, scaleY: 1,
            duration: 500, ease: 'Back.easeOut'
        });

        this.playVictoryJingle();

        this.time.delayedCall(3500, () => {
            this.removeTouchButtons();
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('GameScene');
            });
        });
    }

    update(time, delta) {
        if (!this.gameStarted || this.gameOver) return;

        const dt = Math.min(delta / 1000, 0.05);

        // Keyboard input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.w)) {
            this.switchLane(-1);
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.cursors.s)) {
            this.switchLane(1);
        }

        // Distance & speed
        this.distance += this.speed * dt * 1.0;
        this.speed = Math.min(900, 400 + this.distance * 0.08);
        this.obstacleInterval = Math.max(400, 1000 - this.distance * 0.075);

        if (this.distance >= this.targetDistance) {
            this.reachDestination();
            return;
        }

        // UI updates
        const pct = Math.min(1, this.distance / this.targetDistance);
        this.progressBar.displayWidth = 200 * pct;
        this.distText.setText(Math.floor(this.distance) + 'm / ' + this.targetDistance + 'm');
        this.speedText.setText(Math.floor(40 + this.speed * 0.12) + ' mph');

        // Scroll lane markers
        this.laneMarkers.forEach(m => {
            m.x -= this.speed * dt;
            if (m.x < -40) m.x += 880;
        });

        // Scroll skyline
        this.skyline.forEach(b => {
            b.x -= this.speed * dt * 0.15;
            if (b.x < -60) b.x += 1500;
        });

        // Scroll clouds
        this.clouds.forEach(c => {
            c.x -= this.speed * dt * 0.08;
            if (c.x < -80) c.x += 1700;
        });

        // Spawn obstacles
        this.obstacleTimer += delta;
        if (this.obstacleTimer >= this.obstacleInterval) {
            this.obstacleTimer = 0;
            this.spawnObstacle();
        }

        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.speed * dt;

            // Collision
            if (!obs.hit && Math.abs(obs.x - this.tesla.x) < 32 && obs.lane === this.currentLane) {
                obs.hit = true;
                this.hitObstacle();
            }

            // Near miss detection
            if (!obs.hit && !obs.nearMissed && obs.x < this.tesla.x - 32 && obs.x > this.tesla.x - 55) {
                if (Math.abs(obs.lane - this.currentLane) === 1) {
                    this.showNearMiss(obs.x, obs.y);
                }
                obs.nearMissed = true;
            }

            // Remove off-screen
            if (obs.x < -80) {
                obs.destroy();
                this.obstacles.splice(i, 1);
            }
        }

        // Update pickups
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const p = this.pickups[i];
            if (p.collected || !p.active) { this.pickups.splice(i, 1); continue; }
            p.x -= this.speed * dt;
            if (Math.abs(p.x - this.tesla.x) < 28 && p.lane === this.currentLane) {
                this.collectPickup(p);
            }
            if (p.active && p.x < -50) { p.destroy(); this.pickups.splice(i, 1); }
        }

        // Tesla subtle bobbing
        this.tesla.angle = Math.sin(time * 0.004) * 1.2;
    }

    // === SOUND EFFECTS ===

    playLaneChangeSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.06);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
        } catch(e) {}
    }

    playHitSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.25);
        } catch(e) {}
    }

    playPickupSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            [523, 659, 784].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine'; osc.frequency.value = freq;
                const t = ctx.currentTime + i * 0.07;
                gain.gain.setValueAtTime(0.06, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
                osc.start(t); osc.stop(t + 0.15);
            });
        } catch(e) {}
    }

    playVictoryJingle() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            [523, 587, 659, 784, 880, 1047].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'square'; osc.frequency.value = freq;
                const t = ctx.currentTime + i * 0.12;
                gain.gain.setValueAtTime(0.04, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                osc.start(t); osc.stop(t + 0.2);
            });
        } catch(e) {}
    }

    startDrivingMusic() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            this.dMusicPlaying = true;
            this.dMusicOscs = [];
            this.dMusicTimers = [];

            const bpm = 140;
            const eighth = 60 / bpm / 2;

            // Upbeat driving melody
            const melody = [
                [330,2],[392,2],[440,1],[392,1],[330,2],[294,2],
                [262,2],[294,2],[330,2],[392,2],
                [440,2],[494,2],[523,1],[494,1],[440,2],[392,2],
                [330,2],[294,2],[262,4],
                [330,2],[392,2],[440,1],[392,1],[330,2],[294,2],
                [349,2],[330,2],[294,2],[262,2],
                [294,2],[330,2],[392,2],[440,2],
                [523,2],[494,2],[440,4],
            ];

            const bass = [
                [131,4],[165,4],[175,4],[131,4],
                [110,4],[131,4],[165,4],[131,4],
                [131,4],[165,4],[175,4],[131,4],
                [110,4],[131,4],[165,8],
            ];

            const melodyLen = melody.reduce((s, n) => s + n[1], 0);
            const loopDuration = melodyLen * eighth;

            const scheduleLoop = () => {
                if (!this.dMusicPlaying) return;
                const now = ctx.currentTime + 0.05;

                let t = now;
                melody.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'square'; osc.frequency.value = freq;
                        osc.connect(gain); gain.connect(ctx.destination);
                        gain.gain.setValueAtTime(0.03, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * eighth - 0.01);
                        osc.start(t); osc.stop(t + dur * eighth);
                        this.dMusicOscs.push(osc);
                    }
                    t += dur * eighth;
                });

                t = now;
                bass.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle'; osc.frequency.value = freq;
                        osc.connect(gain); gain.connect(ctx.destination);
                        gain.gain.setValueAtTime(0.04, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * eighth - 0.01);
                        osc.start(t); osc.stop(t + dur * eighth);
                        this.dMusicOscs.push(osc);
                    }
                    t += dur * eighth;
                });

                const timer = setTimeout(() => scheduleLoop(), (loopDuration - 0.1) * 1000);
                this.dMusicTimers.push(timer);
            };

            scheduleLoop();
        } catch(e) {}
    }

    stopDrivingMusic() {
        this.dMusicPlaying = false;
        if (this.dMusicTimers) { this.dMusicTimers.forEach(t => clearTimeout(t)); this.dMusicTimers = []; }
        if (this.dMusicOscs) { this.dMusicOscs.forEach(o => { try { o.stop(); } catch(e) {} }); this.dMusicOscs = []; }
    }
}
