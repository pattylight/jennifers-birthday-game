// ShooScene.js — Girls are approaching your boyfriend! Shoo them away, Jennifer!
class ShooScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShooScene' });
    }

    create() {
        const w = 800, h = 450;

        this.events.on('shutdown', () => this.stopMusic());

        // === CRUISE SHIP POOL PARTY BACKGROUND ===
        // Sky
        this.add.rectangle(w / 2, 60, w, 120, 0x87CEEB).setDepth(-10);
        this.add.image(w - 60, 30, 'sun').setScale(0.8).setDepth(-9);
        // Pool deck
        this.add.rectangle(w / 2, h / 2 + 40, w, h - 80, 0xD2B48C).setDepth(-5);
        // Pool in background
        this.add.rectangle(w / 2, 150, 300, 70, 0x40E0D0, 0.5).setDepth(-4);
        this.add.rectangle(w / 2, 150, 290, 60, 0x5DE0D0, 0.4).setDepth(-4);
        this.add.text(w / 2, 125, 'POOL DECK PARTY', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#1565C0', strokeThickness: 2
        }).setOrigin(0.5).setDepth(-3).setAlpha(0.7);

        // String lights
        for (let x = 30; x < w; x += 45) {
            const col = [0xFFD700, 0xFF69B4, 0x87CEEB, 0xFF6B8A][Math.floor(x / 45) % 4];
            this.add.circle(x, 115, 3, col, 0.5).setDepth(-3);
        }

        // Floor
        for (let x = 0; x < w; x += 32) {
            this.add.rectangle(x + 16, h - 16, 32, 32, 0xA08060).setDepth(0);
            this.add.rectangle(x + 16, h - 16, 30, 30, 0xB8976A, 0.5).setDepth(0);
        }

        // === BOYFRIEND — center, looking jacked ===
        this.boyfriend = this.add.image(w / 2, h - 75, 'boyfriend').setDepth(5).setScale(1.2);

        // Flexing animation
        this.tweens.add({
            targets: this.boyfriend,
            scaleX: 1.25, scaleY: 1.15,
            duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // Label
        this.bfLabel = this.add.text(w / 2, h - 118, 'PATRICK', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#44FF44', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(10);

        // Heart eyes circle around boyfriend
        this.bfHearts = [];
        for (let i = 0; i < 3; i++) {
            const heart = this.add.text(0, 0, '❤️', { fontSize: '18px' }).setDepth(4).setAlpha(0.4);
            this.bfHearts.push({ obj: heart, angle: i * (Math.PI * 2 / 3) });
        }

        // === JENNIFER — controllable ===
        this.jennifer = new Jennifer(this, w / 2 - 60, h - 60);
        this.jennifer.setDepth(8);

        // Simple floor collider
        this.platforms = this.physics.add.staticGroup();
        const floor = this.platforms.create(w / 2, h, 'deck_tile');
        floor.setDisplaySize(w, 32).refreshBody();
        this.physics.add.collider(this.jennifer, this.platforms);

        // Touch controls — LEFT / RIGHT only for this scene
        this.controls = new TouchControls(this);

        // === GAME STATE ===
        this.girls = [];
        this.shooCount = 0;
        this.jealousyMeter = 0;
        this.maxJealousy = 5;
        this.wave = 0;
        this.totalWaves = 5;
        this.waveTimer = 0;
        this.waveInterval = 3800;
        this.girlSpeed = 40;
        this.gameOver = false;
        this.gameWon = false;
        this.spawnedWaves = 0;
        this.wavePending = false;
        this.waveSpawning = false;

        // === UI ===
        this.createUI();

        // === STORY INTRO ===
        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.75)
            .setDepth(199);

        // Patrick sprite walks in
        const patrickSprite = this.add.image(w / 2, h / 2 + 20, 'boyfriend')
            .setScale(1.0).setDepth(200);

        const intro1 = this.add.text(w / 2, h / 2 - 65, 'Patrick says:', {
            fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#88CCFF', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(200);

        const intro2 = this.add.text(w / 2, h / 2 - 38, '"BRB, I\'m gonna grab us some towels!"', {
            fontSize: '23px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(200);

        // After 2s, Patrick walks off and girls warning appears
        this.time.delayedCall(2200, () => {
            this.tweens.add({
                targets: patrickSprite,
                x: w + 60, duration: 800, ease: 'Power2',
                onComplete: () => patrickSprite.destroy()
            });
            this.tweens.add({
                targets: [intro1, intro2],
                alpha: 0, duration: 400
            });

            this.time.delayedCall(900, () => {
                const warn1 = this.add.text(w / 2, h / 2 - 50, 'Oh no!!', {
                    fontSize: '31px', fontFamily: 'Arial Black, Arial, sans-serif',
                    color: '#FF4444', stroke: '#000000', strokeThickness: 5
                }).setOrigin(0.5).setDepth(200);

                const warn2 = this.add.text(w / 2, h / 2 - 10, 'All these girls are approaching Patrick!', {
                    fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
                    color: '#FFD700', stroke: '#000000', strokeThickness: 4
                }).setOrigin(0.5).setDepth(200);

                const warn3 = this.add.text(w / 2, h / 2 + 22, '\u{1F449} Run into them to SHOO them away! \u{1F448}', {
                    fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
                    color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5).setDepth(200);

                this.tweens.add({
                    targets: [overlay, warn1, warn2, warn3],
                    alpha: 0, duration: 800, delay: 2500,
                    onComplete: () => {
                        overlay.destroy(); intro1.destroy(); intro2.destroy();
                        warn1.destroy(); warn2.destroy(); warn3.destroy();
                        this.gameStarted = true;
                        this.spawnWave();
                    }
                });
            });
        });

        this.gameStarted = false;
        this.time.delayedCall(500, () => this.startMusic());
        this.cameras.main.fadeIn(500);
    }

    createUI() {
        const w = 800;

        // Jealousy meter
        this.add.text(20, 12, 'Jealousy:', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF69B4', stroke: '#000000', strokeThickness: 2
        }).setDepth(100);

        this.jealousyBg = this.add.rectangle(165, 17, 104, 14, 0x333333).setDepth(99);
        this.jealousyBar = this.add.rectangle(114, 17, 0, 10, 0xFF69B4).setOrigin(0, 0.5).setDepth(100);

        // Wave counter
        this.waveText = this.add.text(w - 20, 12, 'Wave: 0/' + this.totalWaves, {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(1, 0).setDepth(100);

        // Shoo counter
        this.shooText = this.add.text(w / 2, 12, '\u{1F44B} Shooed: 0', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5, 0).setDepth(100);
    }

    spawnWave() {
        if (this.gameOver || this.gameWon) return;

        this.spawnedWaves++;
        this.wave = this.spawnedWaves;
        this.waveText.setText('Wave: ' + this.wave + '/' + this.totalWaves);
        this.waveSpawning = true;

        // Increase difficulty each wave
        const girlCount = Math.min(2 + this.wave, 6);
        this.girlSpeed = 35 + this.wave * 8;

        const waveText = this.add.text(400, 200, '\u{1F49C} Wave ' + this.wave + '! \u{1F49C}', {
            fontSize: '27px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF69B4', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(150);
        this.tweens.add({
            targets: waveText, alpha: 0, y: 180,
            duration: 1000, onComplete: () => waveText.destroy()
        });

        for (let i = 0; i < girlCount; i++) {
            this.time.delayedCall(i * 600, () => {
                if (this.gameOver || this.gameWon) return;
                this.spawnGirl();
                if (i === girlCount - 1) this.waveSpawning = false;
            });
        }
    }

    spawnGirl() {
        const w = 800, h = 450;
        const fromLeft = Math.random() < 0.5;
        const x = fromLeft ? -30 : w + 30;
        const yVariation = Phaser.Math.Between(h - 85, h - 55);

        const girl = this.add.image(x, yVariation, 'approach_girl').setDepth(6);
        girl.setFlipX(!fromLeft);

        // Speed varies per girl
        const speed = this.girlSpeed + Phaser.Math.Between(-8, 12);
        const dir = fromLeft ? 1 : -1;

        // Thought bubble
        const thought = this.add.text(x, yVariation - 35, '❤️', {
            fontSize: '21px'
        }).setOrigin(0.5).setDepth(7);
        this.tweens.add({
            targets: thought, y: thought.y - 5,
            duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        const girlObj = {
            sprite: girl, thought: thought,
            speed: speed, dir: dir,
            shooed: false, reached: false
        };

        this.girls.push(girlObj);
    }

    shooGirl(girlObj) {
        if (girlObj.shooed || girlObj.reached) return;
        girlObj.shooed = true;
        this.shooCount++;
        this.shooText.setText('\u{1F44B} Shooed: ' + this.shooCount);

        const girl = girlObj.sprite;

        // Jennifer says "SHOO!"
        const shooTexts = ['SHOO! \u{1F44B}', 'BACK OFF! \u{1F624}', 'HE\'S MINE! \u{1F48D}', 'BYE! \u{1F44B}', 'GIRL, NO! \u{1F645}', 'EXCUSE ME?! \u{1F612}'];
        const shoo = this.add.text(this.jennifer.x, this.jennifer.y - 30,
            shooTexts[Phaser.Math.Between(0, shooTexts.length - 1)], {
                fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FF4444', stroke: '#000000', strokeThickness: 3
            }
        ).setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: shoo, y: shoo.y - 30, alpha: 0,
            duration: 800, onComplete: () => shoo.destroy()
        });

        // Girl runs away scared
        const fleeDir = girlObj.dir * -1;
        girl.setFlipX(fleeDir > 0);

        this.tweens.add({
            targets: girl,
            x: girl.x + fleeDir * 250,
            alpha: 0, duration: 600,
            onComplete: () => girl.destroy()
        });

        // Destroy thought bubble
        if (girlObj.thought) {
            this.tweens.add({
                targets: girlObj.thought, alpha: 0, duration: 200,
                onComplete: () => girlObj.thought.destroy()
            });
        }

        // Scared emoji
        const scared = this.add.text(girl.x, girl.y - 20, 'EEK!', { fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FFFF00', stroke: '#000000', strokeThickness: 2 })
            .setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: scared, y: scared.y - 25, alpha: 0, scaleX: 1.3, scaleY: 1.3,
            duration: 500, onComplete: () => scared.destroy()
        });

        this.playShooSound();
    }

    girlReachedBoyfriend(girlObj) {
        if (girlObj.reached || girlObj.shooed) return;
        girlObj.reached = true;

        this.jealousyMeter++;
        this.updateJealousyBar();

        const girl = girlObj.sprite;

        // Girl flirts
        const flirt = this.add.text(girl.x, girl.y - 30, 'xo', { fontSize: '21px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FF69B4', stroke: '#000000', strokeThickness: 2 })
            .setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: flirt, y: flirt.y - 20, alpha: 0,
            duration: 700, onComplete: () => flirt.destroy()
        });

        // Jennifer gets angry
        const angry = this.add.text(this.jennifer.x, this.jennifer.y - 25, 'GRR!', { fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif', color: '#FF4444', stroke: '#000000', strokeThickness: 2 })
            .setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: angry, y: angry.y - 20, alpha: 0,
            duration: 600, onComplete: () => angry.destroy()
        });

        // Remove girl after a moment
        this.tweens.add({
            targets: girl, alpha: 0, duration: 500, delay: 300,
            onComplete: () => girl.destroy()
        });
        if (girlObj.thought) {
            this.tweens.add({
                targets: girlObj.thought, alpha: 0, duration: 300,
                onComplete: () => girlObj.thought.destroy()
            });
        }

        this.playJealousySound();
        this.cameras.main.shake(150, 0.005);

        if (this.jealousyMeter >= this.maxJealousy) {
            this.triggerGameOver();
        }
    }

    updateJealousyBar() {
        const pct = this.jealousyMeter / this.maxJealousy;
        this.tweens.add({
            targets: this.jealousyBar,
            displayWidth: 100 * pct, duration: 300
        });
        if (pct >= 0.8) this.jealousyBar.setFillStyle(0xFF0000);
        else if (pct >= 0.5) this.jealousyBar.setFillStyle(0xFF6644);
    }

    triggerGameOver() {
        this.gameOver = true;
        this.stopMusic();
        const w = 800, h = 450;

        this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6).setDepth(200);

        this.add.text(w / 2, h / 2 - 20, 'Too much jealousy! Try again!', {
            fontSize: '26px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF4444', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(201);

        const retryBtn = this.add.text(w / 2, h / 2 + 30, '>> Retry <<', {
            fontSize: '26px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', backgroundColor: '#44AA44',
            padding: { x: 20, y: 8 }
        }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

        retryBtn.on('pointerdown', () => {
            this.controls.destroy();
            this.scene.restart();
        });
    }

    winScene() {
        this.gameWon = true;
        this.stopMusic();
        const w = 800, h = 450;

        // Clear remaining girls
        this.girls.forEach(g => {
            if (g.sprite && g.sprite.active) g.sprite.destroy();
            if (g.thought && g.thought.active) g.thought.destroy();
        });
        this.girls = [];

        const text = this.add.text(w / 2, h / 2 - 25,
            'He\'s all yours, Jennifer!\nShooed ' + this.shooCount + ' girls away!', {
                fontSize: '27px', fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FFD700', stroke: '#000000', strokeThickness: 4,
                align: 'center', lineSpacing: 8
            }
        ).setOrigin(0.5).setDepth(200).setScale(0.5);

        this.tweens.add({
            targets: text, scaleX: 1, scaleY: 1,
            duration: 600, ease: 'Back.easeOut'
        });

        // Heart shower
        this.time.addEvent({
            delay: 60, repeat: 40, callback: () => {
                const heart = this.add.text(
                    Phaser.Math.Between(50, w - 50), -15,
                    ['❤️', '❤️', '❤️', '❤️'][Phaser.Math.Between(0, 3)],
                    { fontSize: '24px' }
                ).setDepth(160);
                this.tweens.add({
                    targets: heart,
                    y: h + 20, x: heart.x + Phaser.Math.Between(-40, 40),
                    duration: Phaser.Math.Between(1500, 2500),
                    onComplete: () => heart.destroy()
                });
            }
        });

        // Jennifer runs to boyfriend, couple moment
        this.tweens.add({
            targets: this.jennifer,
            x: this.boyfriend.x - 25, duration: 800, ease: 'Power2',
            onComplete: () => {
                const coupleHeart = this.add.text(this.boyfriend.x - 10, this.boyfriend.y - 50, '❤️', {
                    fontSize: '26px'
                }).setOrigin(0.5).setDepth(20);
                this.tweens.add({
                    targets: coupleHeart,
                    y: coupleHeart.y - 15, scaleX: 1.3, scaleY: 1.3,
                    duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
                });
            }
        });

        this.playVictoryJingle();

        this.time.delayedCall(4000, () => {
            // Chocolate monster story transition
            const overlay2 = this.add.rectangle(400, 225, 800, 450, 0x000000, 0.85)
                .setDepth(300).setAlpha(0);
            const monsterText1 = this.add.text(400, 180, 'All of that anger built up and created...', {
                fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5).setDepth(301).setAlpha(0);
            const monsterText2 = this.add.text(400, 225, 'A CHOCOLATE MONSTER!', {
                fontSize: '29px', fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FF4444', stroke: '#000000', strokeThickness: 5
            }).setOrigin(0.5).setDepth(301).setAlpha(0);

            this.tweens.add({
                targets: [overlay2, monsterText1, monsterText2],
                alpha: 1, duration: 600
            });

            this.time.delayedCall(3500, () => {
                this.controls.hide();
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.time.delayedCall(800, () => {
                    this.controls.destroy();
                    this.scene.start('BossScene');
                });
            });
        });
    }

    update(time, delta) {
        if (!this.gameStarted || this.gameOver || this.gameWon) return;

        // Controls
        this.controls.update();
        const state = this.controls.getState();
        this.jennifer.inputState = state;
        this.jennifer.update();

        // Keep Jennifer in bounds
        if (this.jennifer.x < 30) this.jennifer.x = 30;
        if (this.jennifer.x > 770) this.jennifer.x = 770;

        // Rotate hearts around boyfriend
        this.bfHearts.forEach(h => {
            h.angle += 0.015;
            h.obj.x = this.boyfriend.x + Math.cos(h.angle) * 32;
            h.obj.y = this.boyfriend.y - 15 + Math.sin(h.angle) * 18;
        });

        const bfX = this.boyfriend.x;

        // Update girls
        let allGirlsDone = true;
        for (let i = this.girls.length - 1; i >= 0; i--) {
            const g = this.girls[i];
            if (g.shooed || g.reached) {
                if (g.sprite && !g.sprite.active) this.girls.splice(i, 1);
                continue;
            }

            allGirlsDone = false;

            // Move toward boyfriend
            g.sprite.x += g.dir * g.speed * (delta / 1000);
            if (g.thought && g.thought.active) {
                g.thought.x = g.sprite.x;
                g.thought.y = g.sprite.y - 35;
            }

            // Jennifer collision = SHOO
            const dx = Math.abs(g.sprite.x - this.jennifer.x);
            const dy = Math.abs(g.sprite.y - this.jennifer.y);
            if (dx < 28 && dy < 30) {
                this.shooGirl(g);
                continue;
            }

            // Reached boyfriend?
            if (Math.abs(g.sprite.x - bfX) < 30) {
                this.girlReachedBoyfriend(g);
            }
        }

        // Check wave completion
        if (allGirlsDone && this.girls.length === 0 && this.gameStarted && !this.wavePending && !this.waveSpawning) {
            if (this.spawnedWaves >= this.totalWaves) {
                this.winScene();
            } else {
                // Next wave after short delay
                this.wavePending = true;
                this.time.delayedCall(1200, () => {
                    this.wavePending = false;
                    this.spawnWave();
                });
            }
        }
    }

    // === SOUNDS ===

    playShooSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            // Sassy "whoosh" sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    }

    playJealousySound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.25);
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

    startMusic() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            this.sMusicPlaying = true;
            this.sMusicOscs = [];
            this.sMusicTimers = [];

            const bpm = 150;
            const eighth = 60 / bpm / 2;

            // Fun upbeat melody
            const melody = [
                [392,2],[440,2],[494,1],[440,1],[392,2],[330,2],
                [349,2],[392,2],[440,2],[494,2],
                [523,2],[494,2],[440,1],[392,1],[440,2],[349,2],
                [330,2],[349,2],[392,4],
                [392,2],[440,2],[494,1],[440,1],[392,2],[330,2],
                [523,2],[494,2],[440,2],[392,2],
                [440,2],[494,2],[523,2],[587,2],
                [659,2],[587,2],[523,4],
            ];

            const bass = [
                [131,4],[165,4],[175,4],[196,4],
                [131,4],[165,4],[196,4],[175,4],
                [131,4],[165,4],[175,4],[196,4],
                [165,4],[196,4],[131,8],
            ];

            const melodyLen = melody.reduce((s, n) => s + n[1], 0);
            const loopDuration = melodyLen * eighth;

            const scheduleLoop = () => {
                if (!this.sMusicPlaying) return;
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
                        this.sMusicOscs.push(osc);
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
                        this.sMusicOscs.push(osc);
                    }
                    t += dur * eighth;
                });

                const timer = setTimeout(() => scheduleLoop(), (loopDuration - 0.1) * 1000);
                this.sMusicTimers.push(timer);
            };

            scheduleLoop();
        } catch(e) {}
    }

    stopMusic() {
        this.sMusicPlaying = false;
        if (this.sMusicTimers) { this.sMusicTimers.forEach(t => clearTimeout(t)); this.sMusicTimers = []; }
        if (this.sMusicOscs) { this.sMusicOscs.forEach(o => { try { o.stop(); } catch(e) {} }); this.sMusicOscs = []; }
    }
}
