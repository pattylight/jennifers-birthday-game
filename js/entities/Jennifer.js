// Jennifer.js — Player character class
class Jennifer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'jennifer', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(40, 52);
        this.body.setOffset(12, 4);

        this.moveSpeed = 200;
        this.jumpForce = -420;
        this.isAlive = true;
        this.isHurt = false;
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;

        // Input state (set by touch controls or keyboard)
        this.inputState = {
            left: false,
            right: false,
            jump: false,
            jumpJustPressed: false
        };

        this.play('jennifer_idle');
    }

    handleInput() {
        if (!this.isAlive) return;

        const onGround = this.body.blocked.down || this.body.touching.down;

        // Horizontal movement
        if (this.inputState.left) {
            this.setVelocityX(-this.moveSpeed);
            this.setFlipX(true);
        } else if (this.inputState.right) {
            this.setVelocityX(this.moveSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        // Jumping
        if (this.inputState.jumpJustPressed) {
            if (onGround) {
                this.setVelocityY(this.jumpForce);
                this.hasDoubleJumped = false;
                this.playJumpSound();
            } else if (!this.hasDoubleJumped) {
                this.setVelocityY(this.jumpForce * 0.85);
                this.hasDoubleJumped = true;
                this.playJumpSound();
            }
            this.inputState.jumpJustPressed = false;
        }

        // Reset double jump when landing
        if (onGround) {
            this.hasDoubleJumped = false;
        }

        // Animations
        if (!onGround) {
            this.play('jennifer_jump', true);
        } else if (Math.abs(this.body.velocity.x) > 10) {
            this.play('jennifer_run', true);
        } else {
            this.play('jennifer_idle', true);
        }
    }

    playJumpSound() {
        // Retro jump sound using Web Audio
        try {
            const audioCtx = this.scene.sound.context;
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.15);
        } catch(e) { /* audio not available */ }
    }

    hurt() {
        if (!this.isAlive || this.isHurt) return;
        this.isHurt = true;
        // Flash and knockback
        this.setVelocityY(-200);
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.alpha = 1;
                this.isHurt = false;
            }
        });
    }

    update() {
        this.handleInput();
    }
}
