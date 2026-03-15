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

        this.maxHP = 10;
        this.hp = 10;
        this.isDead = false;
        this.isInvulnerable = false;
        this.isEntering = true;
        this.phase = 1;

        this.attackTimer = 0;
        this.slamming = false;

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

        if (this.hp <= 3) this.phase = 3;
        else if (this.hp <= 6) this.phase = 2;

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

    shootChocolate(targetX, targetY) {
        if (this.isDead || this.isEntering) return;
        if (!this.chocoBalls || !this.scene) return;

        const ball = this.chocoBalls.create(this.x, this.y + 20, 'choco_ball');
        if (!ball) return;
        ball.setDepth(8);

        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        const speed = 180 + this.phase * 50;
        ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        ball.body.setAllowGravity(false);

        this.scene.time.delayedCall(3000, () => {
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

    groundSlam() {
        if (this.isDead || this.isEntering || this.slamming) return;
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

        // Slowly chase Jennifer (not during slam)
        if (!this.slamming) {
            const speed = 30 + this.phase * 20;
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

        // Attack timer
        this.attackTimer += delta;
        const attackInterval = this.phase === 1 ? 2200 : this.phase === 2 ? 1500 : 900;

        if (this.attackTimer >= attackInterval) {
            this.attackTimer = 0;
            const rand = Math.random();

            if (this.phase >= 2 && rand < 0.3) {
                this.groundSlam();
            } else {
                this.shootChocolate(jennifer.x, jennifer.y);
                if (this.phase === 3 && rand > 0.5) {
                    this.scene.time.delayedCall(200, () => {
                        this.shootChocolate(jennifer.x + 50, jennifer.y - 30);
                    });
                }
            }
        }

        // Wobble animation
        this.angle = Math.sin(time * 0.003) * (2 + this.phase);
    }
}
