// WakeUpScene.js — Jennifer and Patrick wake up and realize they're late for the cruise!
class WakeUpScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WakeUpScene' });
    }

    create() {
        const w = 800, h = 450;

        // === DARK BEDROOM ===
        this.add.rectangle(w / 2, h / 2, w, h, 0x0D0D1A).setDepth(-10);

        // Walls
        this.add.rectangle(w / 2, h / 2, w - 40, h - 40, 0x1A1A2E).setDepth(-9);

        // Floor
        this.add.rectangle(w / 2, h - 40, w, 60, 0x2C1810).setDepth(-8);

        // Rug
        this.add.ellipse(w / 2, h - 45, 200, 30, 0x8B3A62, 0.5).setDepth(-7);

        // Window (dark/night at first)
        this.windowBg = this.add.rectangle(w - 150, 100, 100, 80, 0x0A0A20).setDepth(-6);
        this.add.rectangle(w - 150, 100, 104, 84, 0x444444, 0).setDepth(-5)
            .setStrokeStyle(4, 0x666666);
        // Window cross
        this.add.rectangle(w - 150, 100, 2, 80, 0x666666).setDepth(-4);
        this.add.rectangle(w - 150, 100, 100, 2, 0x666666).setDepth(-4);

        // Curtains
        this.add.rectangle(w - 205, 100, 12, 90, 0x6B2D5B).setDepth(-4);
        this.add.rectangle(w - 95, 100, 12, 90, 0x6B2D5B).setDepth(-4);

        // Nightstand with alarm clock
        this.add.rectangle(w / 2 + 130, h - 120, 50, 60, 0x3E2723).setDepth(0);
        this.add.rectangle(w / 2 + 130, h - 120, 46, 56, 0x4E342E).setDepth(0);

        // Alarm clock
        this.clockBg = this.add.rectangle(w / 2 + 130, h - 145, 36, 22, 0x111111).setDepth(1);
        this.clockText = this.add.text(w / 2 + 130, h - 145, '7:45', {
            fontSize: '14px', fontFamily: 'monospace',
            color: '#FF0000'
        }).setOrigin(0.5).setDepth(2);

        // Lamp
        this.add.rectangle(w / 2 - 140, h - 155, 8, 40, 0x8D6E63).setDepth(0);
        this.lampShade = this.add.triangle(w / 2 - 140, h - 180, 0, 20, 15, 0, -15, 0, 0xFFD54F, 0.3).setDepth(0);

        // BED
        // Bed frame
        this.add.rectangle(w / 2, h - 95, 220, 12, 0x5D4037).setDepth(1);
        // Headboard
        this.add.rectangle(w / 2, h - 165, 230, 70, 0x4E342E).setDepth(-1);
        this.add.rectangle(w / 2, h - 165, 220, 60, 0x5D4037).setDepth(-1);
        // Mattress
        this.add.rectangle(w / 2, h - 115, 210, 50, 0xE8E0D8).setDepth(1);
        // Blanket
        this.blanket = this.add.rectangle(w / 2, h - 110, 210, 40, 0xFF8A9E).setDepth(2);
        // Pillows
        this.add.ellipse(w / 2 - 50, h - 140, 50, 25, 0xF5F5F5).setDepth(1);
        this.add.ellipse(w / 2 + 50, h - 140, 50, 25, 0xF5F5F5).setDepth(1);

        // Jennifer sleeping (just head on pillow)
        this.jenHead = this.add.circle(w / 2 - 50, h - 148, 12, 0xC68642).setDepth(3);
        // Hair
        this.add.circle(w / 2 - 50, h - 153, 13, 0x1a1a1a).setDepth(2);
        // Zzz
        this.jenZzz = this.add.text(w / 2 - 30, h - 175, 'z z z', {
            fontSize: '14px', fontFamily: 'Arial', color: '#AAAAFF'
        }).setDepth(10).setAlpha(0.7);
        this.tweens.add({
            targets: this.jenZzz, y: this.jenZzz.y - 8, alpha: 0.3,
            duration: 1000, yoyo: true, repeat: -1
        });

        // Patrick sleeping
        this.patHead = this.add.circle(w / 2 + 50, h - 148, 13, 0xD4956B).setDepth(3);
        // Patrick's hair/buzz
        this.add.circle(w / 2 + 50, h - 152, 14, 0x3E2723).setDepth(2);
        // Zzz
        this.patZzz = this.add.text(w / 2 + 75, h - 175, 'z z z', {
            fontSize: '14px', fontFamily: 'Arial', color: '#AAAAFF'
        }).setDepth(10).setAlpha(0.7);
        this.tweens.add({
            targets: this.patZzz, y: this.patZzz.y - 8, alpha: 0.3,
            duration: 1200, yoyo: true, repeat: -1
        });

        // Honey curled up at foot of bed
        this.honeySprite = this.add.sprite(w / 2 + 80, h - 90, 'honey', 0).setScale(0.8).setDepth(3);

        // Fade in from black
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // === CUTSCENE SEQUENCE ===
        this.time.delayedCall(1500, () => this.alarmGoesOff());
    }

    alarmGoesOff() {
        const w = 800, h = 450;

        // Alarm ringing!
        this.tweens.add({
            targets: this.clockBg,
            angle: 5, duration: 50, yoyo: true, repeat: 15
        });
        this.clockText.setColor('#FF0000');
        this.tweens.add({
            targets: this.clockText,
            alpha: 0.2, duration: 200, yoyo: true, repeat: 8
        });

        // Alarm sound
        this.playAlarmSound();

        // "BEEP BEEP BEEP" text
        const beep = this.add.text(w / 2 + 130, h - 180, 'BEEP! BEEP!', {
            fontSize: '14px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF4444', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({
            targets: beep, scaleX: 1.1, scaleY: 1.1,
            duration: 200, yoyo: true, repeat: 5,
            onComplete: () => beep.destroy()
        });

        // Wake up sequence
        this.time.delayedCall(1800, () => this.wakeUp());
    }

    wakeUp() {
        const w = 800, h = 450;

        // Remove zzz's
        this.jenZzz.destroy();
        this.patZzz.destroy();

        // Window brightens — it's morning!
        this.tweens.add({
            targets: this.windowBg,
            fillColor: 0x87CEEB,
            duration: 800
        });

        // Room gets lighter
        const lightOverlay = this.add.rectangle(w / 2, h / 2, w, h, 0xFFFFFF, 0)
            .setDepth(50).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: lightOverlay, fillAlpha: 0.08, duration: 1000
        });

        // Patrick sits up — "!"
        const exclaim1 = this.add.text(w / 2 + 50, h - 195, '!', {
            fontSize: '24px', fontFamily: 'Arial Black',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(20).setScale(0);
        this.tweens.add({
            targets: exclaim1, scaleX: 1, scaleY: 1,
            duration: 300, ease: 'Back.easeOut'
        });

        // Dialogue
        this.time.delayedCall(800, () => {
            exclaim1.destroy();
            this.showDialogue("Patrick", "BABE! Wake up! What time is it?!", '#88CCFF', () => {
                this.clockText.setText('7:45');
                this.showDialogue("Jennifer", "Oh no... it's 7:45!!", '#FF69B4', () => {
                    this.showDialogue("Patrick", "THE CRUISE LEAVES AT 9!", '#88CCFF', () => {
                        this.showDialogue("Jennifer", "WE'RE GONNA BE LATE!!", '#FF69B4', () => {
                            this.showDialogue("Patrick", "Quick!! Get Honey, I'll start the Tesla!!", '#88CCFF', () => {
                                this.rushOut();
                            });
                        });
                    });
                });
            });
        });
    }

    showDialogue(speaker, text, color, onComplete) {
        const w = 800, h = 450;

        // Dark panel at bottom
        const panel = this.add.rectangle(w / 2, h - 35, w - 40, 50, 0x000000, 0.8)
            .setDepth(100).setStrokeStyle(2, 0x444444);

        const nameText = this.add.text(30, h - 55, speaker + ':', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: color, stroke: '#000000', strokeThickness: 3
        }).setDepth(101);

        const dialogueText = this.add.text(30, h - 35, text, {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setDepth(101);

        // Auto advance or tap
        const advance = () => {
            panel.destroy();
            nameText.destroy();
            dialogueText.destroy();
            if (onComplete) onComplete();
        };

        // Tap to advance
        const tapZone = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0)
            .setDepth(99).setInteractive();
        tapZone.once('pointerdown', () => {
            tapZone.destroy();
            advance();
        });

        // Auto advance after 2.5s
        this.time.delayedCall(2500, () => {
            if (tapZone.active) {
                tapZone.destroy();
                advance();
            }
        });
    }

    rushOut() {
        const w = 800, h = 450;

        // Blanket flies off
        this.tweens.add({
            targets: this.blanket,
            angle: 30, y: this.blanket.y + 50, alpha: 0,
            duration: 400
        });

        // Screen shake — everyone's panicking!
        this.cameras.main.shake(500, 0.008);

        // "RUSH RUSH RUSH" effects
        const rush = this.add.text(w / 2, h / 2 - 30, 'HURRY!!!', {
            fontSize: '36px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF4444', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(200).setScale(0.3);
        this.tweens.add({
            targets: rush, scaleX: 1, scaleY: 1,
            duration: 400, ease: 'Back.easeOut'
        });

        // Honey barks (bounces)
        this.tweens.add({
            targets: this.honeySprite,
            y: this.honeySprite.y - 20, duration: 200,
            yoyo: true, repeat: 3
        });

        this.time.delayedCall(1800, () => {
            rush.destroy();

            // Fade to black with transition text
            const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0)
                .setDepth(300);
            this.tweens.add({
                targets: overlay, fillAlpha: 1, duration: 800
            });

            const transText = this.add.text(w / 2, h / 2, '🚗 Racing to the port... 🚗', {
                fontSize: '24px', fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FFD700', stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5).setDepth(301).setAlpha(0);

            this.tweens.add({
                targets: transText, alpha: 1, duration: 600, delay: 800
            });

            this.time.delayedCall(3000, () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start('TeslaScene');
                });
            });
        });
    }

    playAlarmSound() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            // Alarm beeps
            for (let i = 0; i < 6; i++) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.value = 880;
                const t = audioCtx.currentTime + i * 0.25;
                gain.gain.setValueAtTime(0.06, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                osc.start(t);
                osc.stop(t + 0.12);
            }
        } catch (e) {}
    }
}
