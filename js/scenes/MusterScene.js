// MusterScene.js — The captain asks Jennifer for her muster station number. She never remembers it.
class MusterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MusterScene' });
    }

    create() {
        const w = 800, h = 450;
        this.events.on('shutdown', () => this.cleanup());

        // === CRUISE SHIP CORRIDOR BACKGROUND ===
        // Walls
        this.add.rectangle(w / 2, h / 2 - 40, w, 280, 0xF5F0E0).setDepth(-5);
        // Floor
        this.add.rectangle(w / 2, h - 50, w, 120, 0x8B7355).setDepth(-4);
        // Carpet strip
        this.add.rectangle(w / 2, h - 50, w, 100, 0xA52A2A, 0.3).setDepth(-3);
        // Ceiling
        this.add.rectangle(w / 2, 30, w, 60, 0xE8E0D0).setDepth(-5);
        // Ceiling lights
        for (let x = 100; x < w; x += 200) {
            this.add.rectangle(x, 55, 40, 4, 0xFFFFCC).setDepth(-3);
            this.add.circle(x, 60, 6, 0xFFF8DC, 0.6).setDepth(-3);
        }
        // Door frames in background
        for (let x = 80; x < w; x += 250) {
            this.add.rectangle(x, 200, 50, 110, 0x6B4226).setDepth(-4);
            this.add.rectangle(x, 200, 44, 104, 0x8B6238).setDepth(-4);
            this.add.text(x, 165, '\uD83D\uDEAA', { fontSize: '10px' }).setOrigin(0.5).setDepth(-3);
        }
        // "MUSTER STATIONS" sign on wall
        this.add.rectangle(w / 2, 95, 220, 28, 0xCC0000).setDepth(-2);
        this.add.text(w / 2, 95, '\u26A0\uFE0F MUSTER STATIONS \u26A0\uFE0F', {
            fontSize: '11px', fontFamily: 'Courier New, monospace',
            color: '#FFFFFF', stroke: '#880000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(-1);

        // Safety poster
        this.add.rectangle(650, 180, 50, 60, 0xFFFFFF).setDepth(-3);
        this.add.text(650, 165, '\uD83D\uDEDF', { fontSize: '16px' }).setOrigin(0.5).setDepth(-2);
        this.add.text(650, 185, 'KNOW\nYOUR\nSTATION!', {
            fontSize: '5px', fontFamily: 'Courier New, monospace',
            color: '#CC0000', align: 'center'
        }).setOrigin(0.5).setDepth(-2);

        // === SCENE STATE ===
        this.phase = 'intro'; // intro -> captain_enters -> yelling -> input -> wrong -> sinking
        this.inputElement = null;

        // Jennifer standing center-right, looking confused
        this.jennifer = this.add.image(500, h - 95, 'jennifer').setDepth(5).setScale(2);

        // Start sequence
        this.cameras.main.fadeIn(500);
        this.time.delayedCall(600, () => this.captainEnters());
    }

    captainEnters() {
        const w = 800, h = 450;
        this.phase = 'captain_enters';

        // Captain walks in from left
        this.captain = this.add.image(-40, h - 80, 'captain').setDepth(5).setScale(1.8);

        // Alarm sound
        this.playAlarmSound();

        // Red flashing alarm lights
        this.alarmLight1 = this.add.circle(50, 70, 8, 0xFF0000, 0).setDepth(10);
        this.alarmLight2 = this.add.circle(w - 50, 70, 8, 0xFF0000, 0).setDepth(10);
        this.alarmTween = this.tweens.add({
            targets: [this.alarmLight1, this.alarmLight2],
            alpha: { from: 0, to: 0.8 },
            duration: 400, yoyo: true, repeat: -1
        });

        // Captain runs in
        this.tweens.add({
            targets: this.captain,
            x: 250, duration: 1200, ease: 'Power2',
            onComplete: () => this.captainYells()
        });

        // Running sound
        this.time.addEvent({
            delay: 200, repeat: 5, callback: () => this.playFootstep()
        });
    }

    captainYells() {
        this.phase = 'yelling';
        const w = 800, h = 450;

        // Captain shakes with urgency
        this.tweens.add({
            targets: this.captain,
            x: this.captain.x + 3, duration: 50, yoyo: true, repeat: 8
        });

        // Speech bubble background
        const bubbleBg = this.add.rectangle(260, h - 190, 280, 80, 0xFFFFFF, 0.95).setDepth(50);
        bubbleBg.setStrokeStyle(3, 0x000000);

        // Bubble tail
        const tail = this.add.triangle(260, h - 148, 0, 0, 20, 0, 10, 15, 0xFFFFFF).setDepth(50);

        // Captain's speech — typed out
        const speeches = [
            { text: '\uD83D\uDEA8 THE BOAT IS SINKING!!!', delay: 0, color: '#FF0000', size: '13px' },
            { text: 'QUICK!!!', delay: 1200, color: '#FF0000', size: '15px' },
            { text: 'What\'s your MUSTER STATION?!', delay: 2200, color: '#222222', size: '12px' },
        ];

        this.speechTexts = [];

        speeches.forEach((s, i) => {
            this.time.delayedCall(s.delay, () => {
                // Clear previous speech
                this.speechTexts.forEach(t => t.destroy());
                this.speechTexts = [];

                const txt = this.add.text(260, h - 195, s.text, {
                    fontSize: s.size, fontFamily: 'Courier New, monospace',
                    color: s.color, stroke: '#000000', strokeThickness: 1,
                    wordWrap: { width: 260 }, align: 'center'
                }).setOrigin(0.5).setDepth(51);
                this.speechTexts.push(txt);

                if (i < 2) {
                    this.cameras.main.shake(200, 0.008);
                    this.playAlarmSound();
                }

                // On the last speech, also show "???" over Jennifer
                if (i === speeches.length - 1) {
                    // Jennifer panics
                    const panic = this.add.text(500, h - 145, '???', {
                        fontSize: '22px', fontFamily: 'Courier New, monospace',
                        color: '#FF4444', stroke: '#000000', strokeThickness: 4
                    }).setOrigin(0.5).setDepth(50);
                    this.tweens.add({
                        targets: panic, scaleX: 1.2, scaleY: 1.2,
                        duration: 300, yoyo: true, repeat: 2,
                        onComplete: () => {
                            panic.destroy();
                            this.time.delayedCall(800, () => {
                                bubbleBg.destroy();
                                tail.destroy();
                                this.speechTexts.forEach(t => t.destroy());
                                this.showInput();
                            });
                        }
                    });
                }
            });
        });
    }

    showInput() {
        this.phase = 'input';
        const w = 800, h = 450;

        // Dramatic prompt
        this.promptText = this.add.text(w / 2, 140, '\uD83D\uDEA8 ENTER YOUR MUSTER STATION NUMBER! \uD83D\uDEA8', {
            fontSize: '16px', fontFamily: 'Courier New, monospace',
            color: '#FF0000', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.promptText,
            scaleX: 1.05, scaleY: 1.05,
            duration: 500, yoyo: true, repeat: -1
        });

        // Timer ticking down for pressure
        this.timerText = this.add.text(w / 2, 170, '\u23F0 HURRY! 10', {
            fontSize: '14px', fontFamily: 'Courier New, monospace',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(100);

        this.countdown = 10;
        this.countdownTimer = this.time.addEvent({
            delay: 1000, repeat: 9,
            callback: () => {
                this.countdown--;
                if (this.timerText && this.timerText.active) {
                    this.timerText.setText('\u23F0 HURRY! ' + this.countdown);
                    if (this.countdown <= 3) this.timerText.setColor('#FF0000');
                }
                this.playTickSound();
                if (this.countdown <= 0 && this.phase === 'input') {
                    this.triggerWrong();
                }
            }
        });

        // Create HTML input element for text entry
        this.createInputField();

        // Captain tapping foot impatiently
        this.tweens.add({
            targets: this.captain,
            y: this.captain.y - 3, duration: 300,
            yoyo: true, repeat: -1
        });
    }

    createInputField() {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();

        // Create the input container
        this.inputContainer = document.createElement('div');
        this.inputContainer.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            text-align: center;
        `;

        // Input box styled like a ship terminal
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.placeholder = 'Type muster station #...';
        this.inputElement.maxLength = 20;
        this.inputElement.style.cssText = `
            font-family: 'Courier New', monospace;
            font-size: 28px;
            padding: 12px 20px;
            width: 280px;
            text-align: center;
            background: #1a1a2e;
            color: #00FF00;
            border: 3px solid #FFD700;
            border-radius: 8px;
            outline: none;
            letter-spacing: 3px;
            box-shadow: 0 0 20px rgba(255,0,0,0.5), inset 0 0 10px rgba(0,255,0,0.1);
        `;

        // Submit button
        this.submitBtn = document.createElement('button');
        this.submitBtn.textContent = '\uD83D\uDEA8 SUBMIT';
        this.submitBtn.style.cssText = `
            font-family: 'Courier New', monospace;
            font-size: 20px;
            padding: 10px 30px;
            margin-top: 10px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            background: #CC0000;
            color: #FFFFFF;
            border: 2px solid #FFD700;
            border-radius: 6px;
            cursor: pointer;
            letter-spacing: 2px;
        `;

        this.inputContainer.appendChild(this.inputElement);
        this.inputContainer.appendChild(this.submitBtn);
        document.body.appendChild(this.inputContainer);

        // Focus the input
        this.time.delayedCall(100, () => {
            if (this.inputElement) this.inputElement.focus();
        });

        // Any input at all triggers WRONG
        this.inputElement.addEventListener('input', () => {
            if (this.phase !== 'input') return;
            const val = this.inputElement.value;
            if (val.length > 0) {
                this.time.delayedCall(400, () => {
                    if (this.phase === 'input') this.triggerWrong();
                });
            }
        });

        // Submit button also triggers wrong
        this.submitBtn.addEventListener('click', () => {
            if (this.phase === 'input') this.triggerWrong();
        });

        // Enter key
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.phase === 'input') {
                this.triggerWrong();
            }
        });
    }

    triggerWrong() {
        if (this.phase !== 'input') return;
        this.phase = 'wrong';

        // Remove input
        this.removeInput();

        // Stop countdown
        if (this.countdownTimer) this.countdownTimer.remove();
        if (this.promptText) this.promptText.destroy();
        if (this.timerText) this.timerText.destroy();

        // Stop alarms
        if (this.alarmTween) this.alarmTween.stop();
        if (this.alarmLight1) this.alarmLight1.setAlpha(0);
        if (this.alarmLight2) this.alarmLight2.setAlpha(0);

        const w = 800, h = 450;

        // Big WRONG screen
        this.cameras.main.shake(500, 0.02);
        this.playWrongBuzzer();

        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0xFF0000, 0.0).setDepth(200);
        this.tweens.add({
            targets: overlay, fillAlpha: 0.3,
            duration: 200, yoyo: true, repeat: 3
        });

        // Giant WRONG text
        const wrongText = this.add.text(w / 2, h / 2 - 60, '\u274C WRONG!!! \u274C', {
            fontSize: '52px', fontFamily: 'Courier New, monospace',
            color: '#FF0000', stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5).setDepth(300).setScale(0.1);

        this.tweens.add({
            targets: wrongText, scaleX: 1, scaleY: 1,
            duration: 400, ease: 'Back.easeOut'
        });

        // Subtitle
        this.time.delayedCall(800, () => {
            const subText = this.add.text(w / 2, h / 2 + 5, '\uD83D\uDEA2 THE SHIP IS SINKING!!! \uD83D\uDEA2', {
                fontSize: '22px', fontFamily: 'Courier New, monospace',
                color: '#FFD700', stroke: '#000000', strokeThickness: 5
            }).setOrigin(0.5).setDepth(300);

            this.tweens.add({
                targets: subText, scaleX: 1.05, scaleY: 1.05,
                duration: 400, yoyo: true, repeat: -1
            });
        });

        // Captain facepalms
        this.time.delayedCall(600, () => {
            const facepalm = this.add.text(this.captain.x, this.captain.y - 50, '\uD83E\uDD26', {
                fontSize: '28px'
            }).setOrigin(0.5).setDepth(250);
            this.tweens.add({
                targets: facepalm, y: facepalm.y - 15, alpha: 0,
                duration: 1500
            });
        });

        // Jennifer confused/embarrassed
        this.time.delayedCall(400, () => {
            const oops = this.add.text(this.jennifer.x, this.jennifer.y - 50, '\uD83D\uDE05 oops...', {
                fontSize: '14px', fontFamily: 'Courier New, monospace',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(250);
            this.tweens.add({
                targets: oops, y: oops.y - 10,
                duration: 2000
            });
        });

        // Ship tilting / sinking animation
        this.time.delayedCall(1500, () => this.shipSinks());
    }

    shipSinks() {
        this.phase = 'sinking';
        const w = 800, h = 450;

        // Everything tilts!!
        const allVisuals = [this.captain, this.jennifer];

        // Screen tilts
        this.tweens.add({
            targets: this.cameras.main,
            rotation: 0.08, duration: 2000, ease: 'Sine.easeInOut'
        });

        // Water rising from bottom
        this.water = this.add.rectangle(w / 2, h + 50, w, 100, 0x2288CC, 0.7).setDepth(150);
        this.tweens.add({
            targets: this.water,
            y: h - 20, displayHeight: 200,
            duration: 3500, ease: 'Sine.easeIn'
        });

        // Bubbles
        this.time.addEvent({
            delay: 150, repeat: 20,
            callback: () => {
                const bx = Phaser.Math.Between(50, w - 50);
                const bubble = this.add.circle(bx, h, Phaser.Math.Between(3, 8), 0x88CCFF, 0.6).setDepth(160);
                this.tweens.add({
                    targets: bubble,
                    y: bubble.y - Phaser.Math.Between(80, 200),
                    alpha: 0, duration: Phaser.Math.Between(800, 1500),
                    onComplete: () => bubble.destroy()
                });
            }
        });

        // Play sinking sound
        this.playSinkingSound();

        // Funny "Classic Jennifer" text
        this.time.delayedCall(2500, () => {
            const classic = this.add.text(w / 2, h / 2 - 10, '\uD83D\uDE02 Classic Jennifer... \uD83D\uDE02', {
                fontSize: '24px', fontFamily: 'Courier New, monospace',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 5
            }).setOrigin(0.5).setDepth(300);

            this.tweens.add({
                targets: classic, y: classic.y - 10,
                duration: 1500
            });
        });

        // Transition out after the gag
        this.time.delayedCall(5500, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.rotation = 0;
            this.time.delayedCall(1000, () => {
                this.scene.start('TitleScene');
            });
        });
    }

    removeInput() {
        if (this.inputContainer && this.inputContainer.parentNode) {
            this.inputContainer.parentNode.removeChild(this.inputContainer);
        }
        this.inputElement = null;
        this.submitBtn = null;
        this.inputContainer = null;
    }

    cleanup() {
        this.removeInput();
        this.stopMusic();
    }

    // === SOUNDS ===

    playAlarmSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.setValueAtTime(600, ctx.currentTime + 0.15);
            osc.frequency.setValueAtTime(800, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
        } catch(e) {}
    }

    playFootstep() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.06);
        } catch(e) {}
    }

    playTickSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine'; osc.frequency.value = 1000;
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.03);
        } catch(e) {}
    }

    playWrongBuzzer() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.value = 90;
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6);

            // Second tone
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2); gain2.connect(ctx.destination);
            osc2.type = 'square'; osc2.frequency.value = 120;
            gain2.gain.setValueAtTime(0.06, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.5);
        } catch(e) {}
    }

    playSinkingSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            // Low rumble
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 3);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 3);

            // Creaking
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2); gain2.connect(ctx.destination);
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(200, ctx.currentTime);
            osc2.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.5);
            osc2.frequency.linearRampToValueAtTime(250, ctx.currentTime + 1);
            osc2.frequency.linearRampToValueAtTime(100, ctx.currentTime + 2);
            gain2.gain.setValueAtTime(0.02, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
            osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 2);
        } catch(e) {}
    }

    stopMusic() {
        // No looping music in this scene, but clean up just in case
    }
}
