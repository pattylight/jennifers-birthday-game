// VictoryScene.js - Birthday celebration with confetti, message, and Honey celebrating
class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Get score from registry
        const collected = this.registry.get('martinisCollected') || 0;
        const total = this.registry.get('totalMartinis') || 15;

        // Dark festive background
        const bg = this.add.rectangle(w / 2, h / 2, w, h, 0x1a1a2e);

        // Stars in background
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                Phaser.Math.Between(1, 2),
                0xFFFFFF,
                Phaser.Math.FloatBetween(0.3, 0.8)
            );
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: Phaser.Math.Between(500, 1500),
                yoyo: true,
                repeat: -1
            });
        }

        // Confetti particle system
        this.createConfetti();

        // Main birthday text - scales in with bounce
        const happyText = this.add.text(w / 2, 60, 'HAPPY 32nd', {
            fontSize: '53px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700',
            stroke: '#8B4513',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setScale(0).setDepth(10);

        const birthdayText = this.add.text(w / 2, 115, 'BIRTHDAY!', {
            fontSize: '53px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF69B4',
            stroke: '#8B0045',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setScale(0).setDepth(10);

        const nameText = this.add.text(w / 2, 170, '~ JENNIFER ~', {
            fontSize: '40px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setScale(0).setDepth(10);

        // Animate text in sequence
        this.tweens.add({
            targets: happyText,
            scaleX: 1, scaleY: 1,
            duration: 800,
            delay: 500,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: birthdayText,
            scaleX: 1, scaleY: 1,
            duration: 800,
            delay: 1000,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: nameText,
            scaleX: 1, scaleY: 1,
            duration: 800,
            delay: 1500,
            ease: 'Back.easeOut'
        });

        // Espresso martini icon
        const cake = this.add.image(w / 2, 210, 'martini').setScale(2.5).setAlpha(0).setDepth(10);

        this.tweens.add({
            targets: cake,
            alpha: 1,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 600,
            delay: 2000,
            ease: 'Back.easeOut'
        });

        // Bouncing cake
        this.tweens.add({
            targets: cake,
            y: 205,
            duration: 1000,
            delay: 2600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Jennifer sprite doing a little victory dance
        const jenSprite = this.add.sprite(w / 2 - 60, h - 80, 'jennifer', 0).setScale(2).setDepth(10);
        this.tweens.add({
            targets: jenSprite,
            y: jenSprite.y - 15,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        // Toggle flip for dance effect
        this.time.addEvent({
            delay: 500,
            callback: () => { jenSprite.setFlipX(!jenSprite.flipX); },
            loop: true
        });

        // Honey jumping around happily
        const honeySprite = this.add.sprite(w / 2 + 60, h - 65, 'honey', 0).setScale(1.8).setDepth(10);
        this.tweens.add({
            targets: honeySprite,
            y: honeySprite.y - 25,
            x: honeySprite.x + 15,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Hearts popping around them
        this.time.addEvent({
            delay: 300,
            callback: () => {
                const hx = Phaser.Math.Between(w / 2 - 100, w / 2 + 100);
                const hy = Phaser.Math.Between(h - 120, h - 60);
                const heart = this.add.image(hx, hy, 'heart').setScale(0.8).setDepth(9);
                this.tweens.add({
                    targets: heart,
                    y: hy - 40,
                    alpha: 0,
                    scale: 1.2,
                    duration: 800,
                    onComplete: () => heart.destroy()
                });
            },
            loop: true
        });

        // Dark panel behind message for readability
        this.msgBg = this.add.rectangle(w / 2, 290, w * 0.85, 100, 0x000000, 0.5)
            .setOrigin(0.5).setDepth(9).setAlpha(0);

        // Personal message (appears after delay)
        const message = this.add.text(w / 2, 275, '', {
            fontSize: '24px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: w * 0.8 },
            lineSpacing: 6,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(10);

        // Type out the message character by character
        const fullMessage = "You're the most amazing woman in the world.\nHere's to 32 incredible years of YOU!\nI love you more than all the espresso martinis\non every cruise ship in the world.\n\nLove, Patrick";
        let charIndex = 0;

        this.time.delayedCall(2500, () => {
            this.tweens.add({ targets: this.msgBg, alpha: 1, duration: 400 });
            this.time.addEvent({
                delay: 40,
                callback: () => {
                    if (charIndex < fullMessage.length) {
                        message.setText(fullMessage.substring(0, charIndex + 1));
                        // Resize background to fit text
                        this.msgBg.setSize(Math.max(message.width + 40, 200), message.height + 24);
                        this.msgBg.setPosition(w / 2, message.y);
                        charIndex++;
                    }
                },
                repeat: fullMessage.length - 1
            });
        });

        // Play celebration music
        this.time.delayedCall(500, () => {
            this.playCelebrationMusic();
        });

        // Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    createConfetti() {
        const w = this.cameras.main.width;

        // Continuous confetti rain
        this.time.addEvent({
            delay: 50,
            callback: () => {
                const colorIndex = Phaser.Math.Between(0, 5);
                const x = Phaser.Math.Between(0, w);
                const confetti = this.add.image(x, -10, 'confetti_' + colorIndex)
                    .setScale(Phaser.Math.FloatBetween(0.5, 1.5))
                    .setDepth(5)
                    .setAlpha(Phaser.Math.FloatBetween(0.6, 1));

                this.tweens.add({
                    targets: confetti,
                    y: this.cameras.main.height + 20,
                    x: x + Phaser.Math.Between(-80, 80),
                    angle: Phaser.Math.Between(-360, 360),
                    duration: Phaser.Math.Between(2000, 4000),
                    onComplete: () => confetti.destroy()
                });
            },
            loop: true
        });
    }

    playCelebrationMusic() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;

            // Happy birthday melody (simplified)
            const melody = [
                // Note, duration, delay
                [262, 0.2, 0],     // C
                [262, 0.2, 0.25],  // C
                [294, 0.4, 0.5],   // D
                [262, 0.4, 0.95],  // C
                [349, 0.4, 1.4],   // F
                [330, 0.6, 1.85],  // E
                [262, 0.2, 2.6],   // C
                [262, 0.2, 2.85],  // C
                [294, 0.4, 3.1],   // D
                [262, 0.4, 3.55],  // C
                [392, 0.4, 4.0],   // G
                [349, 0.6, 4.45],  // F
            ];

            melody.forEach(([freq, dur, delay]) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.value = freq;
                const startTime = audioCtx.currentTime + delay;
                gain.gain.setValueAtTime(0.06, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
                osc.start(startTime);
                osc.stop(startTime + dur);
            });
        } catch(e) {}
    }
}
