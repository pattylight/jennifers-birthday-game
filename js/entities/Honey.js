// Honey.js - Pomeranian companion that follows Jennifer
class Honey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'honey', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(30, 36);
        this.body.setOffset(8, 4);
        this.body.setAllowGravity(true);
        this.setCollideWorldBounds(true);

        // Breadcrumb trail - stores Jennifer's recent positions
        this.trail = [];
        this.trailDelay = 25; // number of frames behind Jennifer
        this.followSpeed = 180;

        // Bark timer
        this.barkTimer = 0;
        this.barkInterval = Phaser.Math.Between(3000, 6000);

        this.play('honey_idle');

        // Idle bobbing
        this.bobOffset = 0;
    }

    followJennifer(jennifer) {
        if (!jennifer || !jennifer.isAlive) return;

        // Record Jennifer's position in trail
        this.trail.push({ x: jennifer.x, y: jennifer.y });

        // Keep trail at a fixed length
        if (this.trail.length > this.trailDelay) {
            this.trail.shift();
        }

        // Follow the oldest point in the trail
        if (this.trail.length >= this.trailDelay) {
            const target = this.trail[0];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 20) {
                // Move toward target
                const speed = Math.min(this.followSpeed, dist * 3);
                this.setVelocityX((dx / dist) * speed);

                // Face the direction of movement
                if (dx < -5) this.setFlipX(true);
                else if (dx > 5) this.setFlipX(false);

                // Jump if Jennifer is way above and Honey is on ground
                const onGround = this.body.blocked.down || this.body.touching.down;
                if (dy < -50 && onGround) {
                    this.setVelocityY(-380);
                }

                this.play('honey_run', true);
            } else {
                this.setVelocityX(0);
                this.play('honey_idle', true);
            }
        }

        // Bark occasionally
        this.barkTimer += this.scene.game.loop.delta;
        if (this.barkTimer >= this.barkInterval) {
            this.bark();
            this.barkTimer = 0;
            this.barkInterval = Phaser.Math.Between(3000, 6000);
        }
    }

    bark() {
        // Show little "Woof!" text
        const woofText = this.scene.add.text(this.x, this.y - 30, 'WOOF!', {
            fontSize: '16px'
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: woofText,
            y: woofText.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => woofText.destroy()
        });

        // Retro bark sound
        try {
            const audioCtx = this.scene.sound.context;
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.1);
        } catch(e) { /* audio not available */ }
    }

    update(jennifer) {
        this.followJennifer(jennifer);
    }
}
