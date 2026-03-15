// BossScene.js - Chocolate Monster boss fight! Honey becomes the BARK BLASTER!
class BossScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Background
        this.add.image(w / 2, h / 2, 'bg_ocean').setDisplaySize(w, h);
        this.add.image(w - 60, 40, 'sun').setScale(1);

        // Clouds
        this.clouds = [];
        for (let i = 0; i < 4; i++) {
            const cloud = this.add.image(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(10, 80),
                'cloud'
            ).setScale(Phaser.Math.FloatBetween(0.3, 0.7)).setAlpha(0.6).setDepth(-5);
            this.clouds.push(cloud);
        }

        // Arena floor (raised 70px for mobile visibility)
        const groundY = h - 86;
        this.platforms = this.physics.add.staticGroup();
        for (let x = 0; x < w; x += 32) {
            const tile = this.platforms.create(x + 16, groundY, 'deck_tile');
            tile.setDisplaySize(32, 32);
            tile.refreshBody();
        }
        for (let x = 0; x < w; x += 32) {
            this.add.rectangle(x + 16, groundY + 16, 32, 16, 0x6B5210);
        }

        // Elevated platforms
        const platPositions = [
            { x: 100, y: h - 200, w: 3 },
            { x: 350, y: h - 250, w: 3 },
            { x: 600, y: h - 200, w: 3 },
            { x: 250, y: h - 350, w: 2 },
            { x: 500, y: h - 350, w: 2 },
        ];
        platPositions.forEach(p => {
            for (let i = 0; i < p.w; i++) {
                const tile = this.platforms.create(p.x + i * 32, p.y, 'deck_tile');
                tile.setDisplaySize(32, 32);
                tile.refreshBody();
            }
        });

        // Create Jennifer
        this.jennifer = new Jennifer(this, 100, groundY - 40);
        this.jennifer.setDepth(10);

        // Create Honey (will transform into gun)
        this.honey = new Honey(this, 60, groundY - 40);
        this.honey.setDepth(9);

        // Collisions
        this.physics.add.collider(this.jennifer, this.platforms);
        this.physics.add.collider(this.honey, this.platforms);

        // Touch controls
        this.controls = new TouchControls(this);

        // Bark bullets group
        this.barkBullets = this.physics.add.group();

        // State
        this.bossActive = false;
        this.bossIsDead = false;
        this.canShoot = false;
        this.shootCooldown = 0;
        this.lives = 3;
        this.isGameOver = false;

        // Stop any leftover music and clean up on shutdown
        this.stopBossMusic();
        this.events.on('shutdown', () => this.stopBossMusic());

        // Lives display
        this.livesText = this.add.text(w - 20, 12, '❤️❤️❤️', {
            fontSize: '22px'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        // Start the transformation sequence
        this.time.delayedCall(500, () => this.startTransformation());

        // Fade in
        this.cameras.main.fadeIn(500);
    }

    startTransformation() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Honey senses danger!
        const text1 = this.add.text(w / 2, h / 2 - 60, 'Honey senses danger...', {
            fontSize: '24px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(200).setAlpha(0);

        this.tweens.add({ targets: text1, alpha: 1, duration: 500 });

        // Honey shakes and glows
        this.time.delayedCall(1200, () => {
            if (!this.honey || !this.honey.active) return;
            this.tweens.add({
                targets: this.honey,
                x: this.honey.x + 3,
                duration: 50,
                yoyo: true,
                repeat: 15
            });

            // Glow effect
            const glow = this.add.circle(this.honey.x, this.honey.y, 5, 0xFFD700, 0.6).setDepth(20);
            this.tweens.add({
                targets: glow,
                scaleX: 8,
                scaleY: 8,
                alpha: 0,
                duration: 800,
                onComplete: () => glow.destroy()
            });

            // Transformation sound (ascending sweep)
            try {
                const audioCtx = this.sound.context;
                if (!audioCtx) return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.8);
                gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 1);
            } catch(e) {}
        });

        // Transformation!
        this.time.delayedCall(2500, () => {
            text1.destroy();

            // Hide Honey
            this.honey.setVisible(false);
            this.honey.body.setEnable(false);

            // Show transformation text
            const text2 = this.add.text(w / 2, h / 2 - 40, 'HONEY became the BARK BLASTER!', {
                fontSize: '22px',
                fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FF69B4',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(200).setScale(0.5);

            this.tweens.add({
                targets: text2,
                scaleX: 1,
                scaleY: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });

            // Gun indicator on Jennifer
            this.gunSprite = this.add.image(0, 0, 'honey_gun').setDepth(12).setScale(0.9);

            // Enable shooting
            this.canShoot = true;
            this.controls.addShootButton();

            // Now spawn the boss
            this.time.delayedCall(1500, () => {
                text2.destroy();
                this.spawnBoss();
            });
        });
    }

    spawnBoss() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Start boss music
        this.startBossMusic();

        // Warning
        const warning = this.add.text(w / 2, h / 2 - 40, 'A CHOCOLATE MONSTER APPEARS!', {
            fontSize: '27px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF4444',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(200);

        this.tweens.add({
            targets: warning,
            scaleX: 1.1,
            scaleY: 1.1,
            alpha: 0.7,
            duration: 400,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.tweens.add({
                    targets: warning,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => warning.destroy()
                });
            }
        });

        // Create the chocolate boss
        this.boss = new ChocolateBoss(this, w / 2, -50);
        this.boss.setDepth(8);
        this.physics.add.collider(this.boss, this.platforms);
        this.boss.enter();

        // Health bar
        this.createHealthBar();

        // Collision: chocolate boss touches Jennifer
        this.physics.add.overlap(this.jennifer, this.boss, (jennifer, boss) => {
            try {
                if (!boss || !boss.active || boss.isDead || boss.isInvulnerable || boss.isEntering || this.bossIsDead) return;
                this.hurtJennifer();
            } catch(e) { console.warn('Boss touch error:', e); }
        });

        // Collision: chocolate balls hit Jennifer
        this.physics.add.overlap(this.jennifer, this.boss.chocoBalls, (jennifer, ball) => {
            try {
                if (!ball || !ball.active) return;
                ball.destroy();
                this.hurtJennifer();
            } catch(e) { console.warn('Choco ball error:', e); }
        });

        // Collision: bark bullets hit boss
        this.physics.add.overlap(this.barkBullets, this.boss, (objA, objB) => {
            try {
                // Determine which is the bullet and which is the boss
                const bullet = (objA === this.boss) ? objB : objA;
                const boss = this.boss;
                if (!bullet || !bullet.active || !boss || !boss.active) return;
                bullet.destroy();
                if (boss.isDead || boss.isInvulnerable || boss.isEntering) return;
                const killed = boss.takeDamage();
                this.updateHealthBar();
                if (killed && !this.bossIsDead) this.bossDefeated();
            } catch(e) { console.warn('Bullet overlap error:', e); }
        });

        // Hint text
        const hint = this.add.text(w / 2, h - 55, 'Press X or SHOOT to shoot! Aim by facing left/right!', {
            fontSize: '16px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: hint,
            alpha: 0,
            duration: 500,
            delay: 4000,
            onComplete: () => hint.destroy()
        });

        this.bossActive = true;
    }

    shoot() {
        if (!this.canShoot || this.shootCooldown > 0 || this.bossIsDead) return;
        this.shootCooldown = 200;

        const dir = this.jennifer.flipX ? -1 : 1;
        const bullet = this.barkBullets.create(
            this.jennifer.x + dir * 20,
            this.jennifer.y - 5,
            'bark_bullet'
        );
        if (!bullet) return;
        bullet.body.setAllowGravity(false);
        bullet.setVelocityX(dir * 450);
        bullet.setDepth(8);

        this.time.delayedCall(2000, () => {
            if (bullet && bullet.active) bullet.destroy();
        });

        this.playBarkShot();
    }

    playBarkShot() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.1);
        } catch(e) {}
    }

    createHealthBar() {
        const w = this.cameras.main.width;
        this.hpBarBg = this.add.rectangle(w / 2, 30, 204, 18, 0x333333)
            .setScrollFactor(0).setDepth(100);
        this.hpBarBorder = this.add.rectangle(w / 2, 30, 208, 22, 0x000000)
            .setScrollFactor(0).setDepth(99).setFillStyle(0x000000, 0).setStrokeStyle(2, 0xFFFFFF);
        this.hpBar = this.add.rectangle(w / 2, 30, 200, 14, 0x8B4513)
            .setScrollFactor(0).setDepth(101);
        this.add.text(w / 2, 12, 'CHOCOLATE MONSTER', {
            fontSize: '18px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
    }

    updateHealthBar() {
        if (!this.boss) return;
        const pct = this.boss.hp / this.boss.maxHP;
        this.tweens.add({
            targets: this.hpBar,
            displayWidth: 200 * pct,
            duration: 300,
            ease: 'Power2'
        });
        if (pct <= 0.3) this.hpBar.setFillStyle(0xFF0000);
        else if (pct <= 0.6) this.hpBar.setFillStyle(0xCC6600);
    }

    bossDefeated() {
        this.bossIsDead = true;
        this.canShoot = false;
        this.playVictoryFanfare();

        const defeatText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 20,
            '** MELTED! **',
            {
                fontSize: '38px',
                fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setOrigin(0.5).setDepth(200).setScale(0.1);

        this.tweens.add({
            targets: defeatText,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });

        this.stopBossMusic();
        this.tweens.add({
            targets: [this.hpBar, this.hpBarBg, this.hpBarBorder],
            alpha: 0,
            duration: 500
        });

        // Honey transforms back!
        this.time.delayedCall(1000, () => {
            if (this.gunSprite) this.gunSprite.destroy();
            this.gunSprite = null;
            this.honey.setVisible(true);
            this.honey.body.setEnable(true);
            this.honey.setPosition(this.jennifer.x - 30, this.jennifer.y);

            for (let i = 0; i < 5; i++) {
                this.time.delayedCall(i * 300, () => {
                    if (this.honey && this.honey.active) this.honey.bark();
                });
            }
        });

        this.time.delayedCall(3500, () => {
            this.controls.hide();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.controls.destroy();
                this.scene.start('VictoryScene');
            });
        });
    }

    startBossMusic() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            this.bMusicPlaying = true;
            this.bMusicOscs = [];
            this.bMusicTimers = [];

            const bpm = 160;
            const eighth = 60 / bpm / 2;

            const melody = [
                [330,1],[330,1],[0,1],[330,1],[0,1],[311,1],[330,1],[0,1],
                [330,1],[392,1],[440,1],[392,1],[330,1],[294,1],[330,1],[0,1],
                [440,1],[440,1],[415,1],[440,1],[494,1],[440,1],[392,1],[330,1],
                [330,1],[247,1],[262,1],[294,1],[330,1],[294,1],[262,1],[247,1],
                [330,1],[0,1],[330,1],[0,1],[494,1],[440,1],[392,1],[330,1],
                [370,1],[330,1],[370,1],[330,1],[294,1],[330,1],[370,1],[0,1],
                [494,1],[494,1],[440,1],[392,1],[440,1],[494,1],[523,1],[494,1],
                [440,1],[392,1],[330,1],[294,1],[330,2],[0,2],
            ];

            const bass = [
                [82,2],[82,2],[82,2],[82,2],
                [82,2],[98,2],[110,2],[98,2],
                [110,2],[110,2],[110,2],[110,2],
                [82,2],[82,2],[98,2],[82,2],
                [82,2],[82,2],[123,2],[110,2],
                [93,2],[82,2],[93,2],[82,2],
                [123,2],[123,2],[110,2],[98,2],
                [110,2],[98,2],[82,4],
            ];

            const perc = [
                [80,1],[0,1],[60,1],[0,1],[80,1],[0,1],[60,1],[80,1],
                [80,1],[0,1],[60,1],[0,1],[80,1],[60,1],[80,1],[0,1],
                [80,1],[0,1],[60,1],[0,1],[80,1],[0,1],[60,1],[80,1],
                [80,1],[0,1],[60,1],[80,1],[80,1],[0,1],[60,1],[0,1],
                [80,1],[0,1],[60,1],[0,1],[80,1],[0,1],[60,1],[80,1],
                [80,1],[60,1],[80,1],[0,1],[80,1],[60,1],[80,1],[0,1],
                [80,1],[0,1],[60,1],[0,1],[80,1],[0,1],[60,1],[80,1],
                [80,1],[60,1],[80,1],[60,1],[80,2],[0,2],
            ];

            const melodyLen = melody.reduce((s, n) => s + n[1], 0);
            const loopDuration = melodyLen * eighth;

            const scheduleLoop = () => {
                if (!this.bMusicPlaying) return;
                const now = audioCtx.currentTime + 0.05;

                let t = now;
                melody.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'square';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.04, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * eighth - 0.01);
                        osc.start(t);
                        osc.stop(t + dur * eighth);
                        this.bMusicOscs.push(osc);
                    }
                    t += dur * eighth;
                });

                t = now;
                bass.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.045, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * eighth - 0.01);
                        osc.start(t);
                        osc.stop(t + dur * eighth);
                        this.bMusicOscs.push(osc);
                    }
                    t += dur * eighth;
                });

                t = now;
                perc.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.06, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
                        osc.start(t);
                        osc.stop(t + 0.06);
                        this.bMusicOscs.push(osc);
                    }
                    t += dur * eighth;
                });

                const timer = setTimeout(() => scheduleLoop(), (loopDuration - 0.1) * 1000);
                this.bMusicTimers.push(timer);
            };

            scheduleLoop();
        } catch(e) {}
    }

    stopBossMusic() {
        this.bMusicPlaying = false;
        if (this.bMusicTimers) {
            this.bMusicTimers.forEach(t => clearTimeout(t));
            this.bMusicTimers = [];
        }
        if (this.bMusicOscs) {
            this.bMusicOscs.forEach(osc => {
                try { osc.stop(); } catch(e) {}
            });
            this.bMusicOscs = [];
        }
    }

    playVictoryFanfare() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            const melody = [523, 523, 523, 698, 880, 784, 698, 880, 1047];
            const durations = [0.15, 0.15, 0.15, 0.3, 0.15, 0.15, 0.3, 0.15, 0.4];
            let t = audioCtx.currentTime;
            melody.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.07, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + durations[i]);
                osc.start(t);
                osc.stop(t + durations[i]);
                t += durations[i];
            });
        } catch(e) {}
    }

    update(time, delta) {
        this.controls.update();
        const state = this.controls.getState();
        this.jennifer.inputState = state;
        this.jennifer.update();

        // Shoot on shoot button or keyboard X
        if (state.shoot) {
            this.shoot();
        }

        // Honey follows (only when visible, before transformation)
        if (this.honey && this.honey.visible) {
            this.honey.update(this.jennifer);
        }

        // Gun sprite follows Jennifer
        if (this.gunSprite) {
            const dir = this.jennifer.flipX ? -1 : 1;
            this.gunSprite.x = this.jennifer.x + dir * 15;
            this.gunSprite.y = this.jennifer.y - 5;
            this.gunSprite.setFlipX(this.jennifer.flipX);
        }

        // Shoot cooldown
        if (this.shootCooldown > 0) this.shootCooldown -= delta;

        // Boss AI
        if (this.boss && this.boss.active && this.bossActive && !this.bossIsDead) {
            this.boss.updateBoss(time, delta);
        }

        // Move clouds
        this.clouds.forEach((cloud, i) => {
            cloud.x -= 0.15 + i * 0.05;
            if (cloud.x < -60) cloud.x = this.cameras.main.width + 60;
        });

        // Boundary
        if (this.jennifer.x < 30) this.jennifer.x = 30;
        if (this.jennifer.x > this.cameras.main.width - 30) {
            this.jennifer.x = this.cameras.main.width - 30;
        }
    }

    hurtJennifer() {
        if (this.isGameOver || !this.jennifer || this.jennifer.isHurt) return;
        this.jennifer.hurt();
        this.lives--;
        this.updateLivesDisplay();

        if (this.lives <= 0) {
            this.isGameOver = true;
            this.time.delayedCall(500, () => {
                this.physics.pause();
                const w = this.cameras.main.width;
                const h = this.cameras.main.height;
                this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7)
                    .setScrollFactor(0).setDepth(400);
                this.add.text(w / 2, h / 2 - 20, 'DEFEATED BY CHOCOLATE!', {
                    fontSize: '28px', fontFamily: 'Arial Black, Arial, sans-serif',
                    color: '#FF4444', stroke: '#000000', strokeThickness: 5
                }).setOrigin(0.5).setScrollFactor(0).setDepth(401);
                const tapText = this.add.text(w / 2, h / 2 + 25, 'Tap to retry', {
                    fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
                    color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5).setScrollFactor(0).setDepth(401);
                this.tweens.add({ targets: tapText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
                this.stopBossMusic();
                this.input.once('pointerdown', () => {
                    this.controls.destroy();
                    this.scene.restart();
                });
            });
        }
    }

    updateLivesDisplay() {
        if (this.livesText) {
            this.livesText.setText('❤️'.repeat(Math.max(0, this.lives)) + '🖤'.repeat(Math.max(0, 3 - this.lives)));
        }
    }
}
