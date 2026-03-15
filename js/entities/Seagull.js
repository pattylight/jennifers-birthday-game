// Seagull.js — ChocolateBoss class for the boss fight
class ChocolateBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'chocolate_boss');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(70, 70);
        this.body.setOffset(13, 13);
        this.body.setAllowGravity(true);
        this.body.setBounce(0.1);
        this.setCollideWorldBounds(true);

        this.maxHP = 12;
        this.hp = 12;
        this.isDead = false;
        this.isInvulnerable = false;
        this.isEntering = true;
        this.phase = 1;
        this.phaseTransitioning = false;

        this.attackTimer = 0;
        this.slamming = false;
        this.telegraphing = false;

        this.chocoBalls = scene.physics.add.group();
    }

    enter() {
        this.y = -80;
        this.body.setAllowGravity(false);
        this.scene.tweens.add({
            targets: this,
            y: 180,
            duration: 1500,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.isEntering = false;
                this.body.setAllowGravity(true);
                this.scene.cameras.main.shake(200, 0.01);
            }
        });
    }

    takeDamage() {
        if (this.isInvulnerable || this.isDead) return false;
        this.hp--;
        this.isInvulnerable = true;

        this.setTint(0xFF0000);
        this.scene.time.delayedCall(200, () => {
            if (!this.isDead) this.clearTint();
        });

        this.scene.cameras.main.shake(100, 0.008);
        this.playHitSound();

        // Check for phase transitions
        const oldPhase = this.phase;
        if (this.hp <= 4) this.phase = 3;
        else if (this.hp <= 8) this.phase = 2;

        if (this.phase !== oldPhase) {
            this.startPhaseTransition(this.phase);
        }

        this.scene.time.delayedCall(400, () => {
            this.isInvulnerable = false;
        });

        if (this.hp <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    playHitSound() {
        try {
            const audioCtx = this.scene.sound.context;
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.3);
        } catch(e) {}
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.body.setVelocity(0, 0);
        this.body.setAllowGravity(false);
        this.body.setEnable(false);

        // Kill all active tweens on the boss
        this.scene.tweens.killTweensOf(this);

        // Destroy all chocolate balls
        this.chocoBalls.clear(true, true);

        // Chocolate splatter
        for (let i = 0; i < 15; i++) {
            const splat = this.scene.add.circle(
                this.x + Phaser.Math.Between(-40, 40),
                this.y + Phaser.Math.Between(-30, 30),
                Phaser.Math.Between(4, 14),
                0x5C3317, 0.8
            ).setDepth(20);
            this.scene.tweens.add({
                targets: splat,
                y: splat.y + Phaser.Math.Between(30, 100),
                scaleX: 2,
                scaleY: 0.3,
                alpha: 0,
                duration: 1000,
                delay: i * 40,
                onComplete: () => splat.destroy()
            });
        }

        // Melt away
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.5,
            scaleY: 0.15,
            alpha: 0,
            y: this.y + 40,
            duration: 1200,
            ease: 'Power2'
        });

        // Defeat sound
        try {
            const audioCtx = this.scene.sound.context;
            if (!audioCtx) return;
            [500, 400, 300, 200, 100].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.15);
                osc.start(audioCtx.currentTime + i * 0.12);
                osc.stop(audioCtx.currentTime + i * 0.12 + 0.15);
            });
        } catch(e) {}
    }

    startPhaseTransition(newPhase) {
        this.phaseTransitioning = true;
        this.isInvulnerable = true;
        this.body.setVelocity(0, 0);

        // Clear existing projectiles
        this.chocoBalls.clear(true, true);

        // Visual flash
        this.setTint(0xFFFFFF);
        this.scene.cameras.main.shake(300, 0.015);

        const w = this.scene.cameras.main.width;
        const h = this.scene.cameras.main.height;

        let phaseText = '';
        let phaseColor = '#FFFFFF';
        if (newPhase === 2) {
            phaseText = 'PHASE 2: CHOCOLATE STORM!';
            phaseColor = '#FF8C00';
            this.setTint(0xCC6600);
        } else if (newPhase === 3) {
            phaseText = 'PHASE 3: MELTDOWN!';
            phaseColor = '#FF2222';
            this.setTint(0xFF4444);
            this.setScale(1.15);
        }

        const announcement = this.scene.add.text(w / 2, h / 2 - 30, phaseText, {
            fontSize: '26px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: phaseColor,
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(200).setScale(0.3);

        this.scene.tweens.add({
            targets: announcement,
            scaleX: 1, scaleY: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });

        // Phase transition sound
        try {
            const audioCtx = this.scene.sound.context;
            if (audioCtx) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.5);
            }
        } catch(e) {}

        // Pause gives player breathing room
        this.scene.time.delayedCall(1800, () => {
            if (this.isDead) return;
            announcement.destroy();
            this.phaseTransitioning = false;
            this.isInvulnerable = false;
            this.attackTimer = 0;
        });
    }

    shootChocolate(targetX, targetY) {
        if (this.isDead || this.isEntering || this.phaseTransitioning) return;
        if (!this.chocoBalls || !this.scene) return;

        const ball = this.chocoBalls.create(this.x, this.y + 20, 'choco_ball');
        if (!ball) return;
        ball.setDepth(8);

        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        const speed = 140 + this.phase * 40;
        ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        ball.body.setAllowGravity(false);

        this.scene.time.delayedCall(3500, () => {
            if (ball && ball.active) ball.destroy();
        });

        // Throw sound
        try {
            const audioCtx = this.scene.sound.context;
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(250, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.12);
        } catch(e) {}
    }

    telegraphAttack(callback) {
        if (this.isDead || this.telegraphing) return;
        this.telegraphing = true;

        // Flash warning above boss
        const warn = this.scene.add.text(this.x, this.y - 50, '!', {
            fontSize: '28px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(200);

        this.scene.tweens.add({
            targets: warn,
            alpha: 0.3,
            duration: 150,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                warn.destroy();
                this.telegraphing = false;
                if (!this.isDead) callback();
            }
        });
    }

    groundSlam() {
        if (this.isDead || this.isEntering || this.slamming || this.phaseTransitioning) return;
        this.slamming = true;

        const startY = this.y;
        this.body.setAllowGravity(false);

        this.scene.tweens.add({
            targets: this,
            y: startY - 120,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                if (this.isDead) return;
                this.scene.tweens.add({
                    targets: this,
                    y: this.scene.cameras.main.height - 150,
                    duration: 200,
                    ease: 'Power4',
                    onComplete: () => {
                        if (this.isDead) return;
                        this.body.setAllowGravity(true);
                        this.scene.cameras.main.shake(300, 0.02);
                        this.slamming = false;

                        // Shockwave
                        const wave = this.scene.add.rectangle(
                            this.x, this.scene.cameras.main.height - 105,
                            20, 8, 0x5C3317, 0.7
                        ).setDepth(6);
                        this.scene.tweens.add({
                            targets: wave,
                            scaleX: 30,
                            alpha: 0,
                            duration: 600,
                            onComplete: () => wave.destroy()
                        });

                        // Slam sound
                        try {
                            const audioCtx = this.scene.sound.context;
                            if (!audioCtx) return;
                            const osc = audioCtx.createOscillator();
                            const gain = audioCtx.createGain();
                            osc.connect(gain);
                            gain.connect(audioCtx.destination);
                            osc.type = 'sawtooth';
                            osc.frequency.value = 55;
                            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
                            osc.start(audioCtx.currentTime);
                            osc.stop(audioCtx.currentTime + 0.4);
                        } catch(e) {}
                    }
                });
            }
        });
    }

    updateBoss(time, delta) {
        if (this.isDead || this.isEntering || !this.body || !this.body.enable) return;

        const jennifer = this.scene.jennifer;
        if (!jennifer) return;

        // Don't act during phase transitions
        if (this.phaseTransitioning) {
            this.setVelocityX(0);
            // Pulsing glow during transition
            this.alpha = 0.6 + Math.sin(time * 0.01) * 0.4;
            return;
        }
        this.alpha = 1;

        // Chase Jennifer (not during slam)
        if (!this.slamming && !this.telegraphing) {
            const speed = this.phase === 1 ? 35 : this.phase === 2 ? 55 : 45;
            if (jennifer.x < this.x - 30) {
                this.setVelocityX(-speed);
                this.setFlipX(true);
            } else if (jennifer.x > this.x + 30) {
                this.setVelocityX(speed);
                this.setFlipX(false);
            } else {
                this.setVelocityX(0);
            }
        }

        // Attack timer — more generous intervals
        this.attackTimer += delta;
        const attackInterval = this.phase === 1 ? 2800 : this.phase === 2 ? 2000 : 1400;

        if (this.attackTimer >= attackInterval) {
            this.attackTimer = 0;
            const rand = Math.random();

            if (this.phase === 1) {
                // Phase 1: Simple single shots with telegraph
                this.telegraphAttack(() => {
                    this.shootChocolate(jennifer.x, jennifer.y);
                });
            } else if (this.phase === 2) {
                // Phase 2: Mix of slams and aimed shots
                if (rand < 0.3) {
                    this.telegraphAttack(() => this.groundSlam());
                } else {
                    this.telegraphAttack(() => {
                        this.shootChocolate(jennifer.x, jennifer.y);
                        // Occasional spread shot
                        if (rand > 0.6) {
                            this.scene.time.delayedCall(300, () => {
                                this.shootChocolate(jennifer.x + 80, jennifer.y - 40);
                            });
                        }
                    });
                }
            } else {
                // Phase 3: Desperate — rapid bursts + slams, but boss is slower
                if (rand < 0.35) {
                    this.telegraphAttack(() => this.groundSlam());
                } else {
                    this.telegraphAttack(() => {
                        this.shootChocolate(jennifer.x, jennifer.y);
                        this.scene.time.delayedCall(250, () => {
                            this.shootChocolate(jennifer.x - 60, jennifer.y);
                        });
                    });
                }
            }
        }

        // Wobble animation — more frantic in later phases
        const wobbleSpeed = this.phase === 1 ? 0.002 : this.phase === 2 ? 0.004 : 0.006;
        const wobbleAmt = this.phase === 1 ? 2 : this.phase === 2 ? 4 : 6;
        this.angle = Math.sin(time * wobbleSpeed) * wobbleAmt;
    }
}
