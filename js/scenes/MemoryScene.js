// MemoryScene.js — Chocolate Tasting memory matching game!
class MemoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MemoryScene' });
    }

    create() {
        const w = 800, h = 450;

        this.events.on('shutdown', () => this.stopAmbientMusic());

        // Warm chocolate background
        this.add.rectangle(w / 2, h / 2, w, h, 0x3E2723);

        // Decorative border
        this.add.rectangle(w / 2, h / 2, w - 16, h - 16)
            .setFillStyle(0, 0).setStrokeStyle(3, 0x8D6E63).setDepth(1);

        // Corner decorations
        [{ x: 20, y: 20 }, { x: w - 20, y: 20 }, { x: 20, y: h - 20 }, { x: w - 20, y: h - 20 }].forEach(pos => {
            this.add.text(pos.x, pos.y, '~', { fontSize: '14px' }).setOrigin(0.5).setDepth(2);
        });

        // Title
        this.add.text(w / 2, 25, 'Chocolate Tasting Lounge', {
            fontSize: '20px', fontFamily: 'Courier New, monospace',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(10);

        this.add.text(w / 2, 48, 'Match the chocolate pairs!', {
            fontSize: '11px', fontFamily: 'Courier New, monospace',
            color: '#BCAAA4', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(10);

        // 6 chocolate types = 6 pairs = 12 cards (4x3 grid)
        this.chocolateTypes = [
            { name: 'Dark', emoji: 'DK', color: 0x3E2723, textColor: '#D7CCC8' },
            { name: 'Milk', emoji: 'ML', color: 0x6D4C41, textColor: '#EFEBE9' },
            { name: 'White', emoji: 'WH', color: 0xBCAAA4, textColor: '#3E2723' },
            { name: 'Truffle', emoji: 'TR', color: 0x4E342E, textColor: '#EFEBE9' },
            { name: 'Caramel', emoji: 'CA', color: 0xE65100, textColor: '#FFF3E0' },
            { name: 'Praline', emoji: 'PR', color: 0x6A1B9A, textColor: '#F3E5F5' },
        ];

        // Create shuffled pairs
        let cardValues = [];
        this.chocolateTypes.forEach((_, i) => cardValues.push(i, i));
        Phaser.Utils.Array.Shuffle(cardValues);

        // Grid layout
        const cols = 4, rows = 3;
        const cardW = 120, cardH = 95;
        const gapX = 16, gapY = 12;
        const gridW = cols * cardW + (cols - 1) * gapX;
        const gridH = rows * cardH + (rows - 1) * gapY;
        const startX = (w - gridW) / 2 + cardW / 2;
        const startY = 65 + (h - 65 - 30 - gridH) / 2 + cardH / 2;

        // State
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 6;
        this.moves = 0;
        this.isChecking = false;

        cardValues.forEach((val, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cardW + gapX);
            const y = startY + row * (cardH + gapY);

            // Card back (face-down)
            const back = this.add.rectangle(x, y, cardW, cardH, 0x795548)
                .setStrokeStyle(2, 0xA1887F)
                .setInteractive({ useHandCursor: true })
                .setDepth(5);
            const backEmoji = this.add.text(x, y - 8, '?', { fontSize: '26px' })
                .setOrigin(0.5).setDepth(6);
            const backQ = this.add.text(x, y + 18, '?', {
                fontSize: '18px', fontFamily: 'Courier New, monospace',
                color: '#D7CCC8'
            }).setOrigin(0.5).setDepth(6);

            // Decorative lines on card back
            this.add.rectangle(x - 30, y, 2, cardH - 20, 0x8D6E63, 0.3).setDepth(5);
            this.add.rectangle(x + 30, y, 2, cardH - 20, 0x8D6E63, 0.3).setDepth(5);

            // Card face (hidden)
            const type = this.chocolateTypes[val];
            const face = this.add.rectangle(x, y, cardW, cardH, type.color)
                .setStrokeStyle(2, 0xFFD700)
                .setDepth(5).setVisible(false);
            const faceEmoji = this.add.text(x, y - 14, type.emoji, { fontSize: '32px' })
                .setOrigin(0.5).setDepth(6).setVisible(false);
            const faceName = this.add.text(x, y + 22, type.name, {
                fontSize: '13px', fontFamily: 'Courier New, monospace',
                color: type.textColor, stroke: '#000000', strokeThickness: 1
            }).setOrigin(0.5).setDepth(6).setVisible(false);

            const card = {
                value: val, x, y,
                back, backEmoji, backQ,
                face, faceEmoji, faceName,
                isFlipped: false, isMatched: false
            };

            back.on('pointerdown', () => this.flipCard(card));
            back.on('pointerover', () => { if (!card.isFlipped && !card.isMatched) back.setStrokeStyle(2, 0xFFD700); });
            back.on('pointerout', () => { if (!card.isFlipped && !card.isMatched) back.setStrokeStyle(2, 0xA1887F); });

            this.cards.push(card);
        });

        // UI
        this.movesText = this.add.text(20, h - 22, 'Moves: 0', {
            fontSize: '13px', fontFamily: 'Courier New, monospace',
            color: '#BCAAA4', stroke: '#000000', strokeThickness: 2
        }).setDepth(10);

        this.pairsText = this.add.text(w - 20, h - 22, 'Pairs: 0/6', {
            fontSize: '13px', fontFamily: 'Courier New, monospace',
            color: '#BCAAA4', stroke: '#000000', strokeThickness: 2
        }).setOrigin(1, 0).setDepth(10);

        // Hint text
        const hint = this.add.text(w / 2, h - 22, 'Tap cards to flip them!', {
            fontSize: '11px', fontFamily: 'Courier New, monospace',
            color: '#8D6E63', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(10);

        this.tweens.add({
            targets: hint, alpha: 0, duration: 500, delay: 3000,
            onComplete: () => hint.destroy()
        });

        this.cameras.main.fadeIn(500);
        this.time.delayedCall(500, () => this.startAmbientMusic());
    }

    flipCard(card) {
        if (this.isChecking || card.isFlipped || card.isMatched) return;
        if (this.flippedCards.length >= 2) return;

        card.isFlipped = true;

        // Flip animation: shrink back → show face
        this.tweens.add({
            targets: [card.back, card.backEmoji, card.backQ],
            scaleX: 0, duration: 120,
            onComplete: () => {
                card.back.setVisible(false);
                card.backEmoji.setVisible(false);
                card.backQ.setVisible(false);
                card.face.setVisible(true).setScale(0, 1);
                card.faceEmoji.setVisible(true).setScale(0, 1);
                card.faceName.setVisible(true).setScale(0, 1);
                this.tweens.add({
                    targets: [card.face, card.faceEmoji, card.faceName],
                    scaleX: 1, duration: 120
                });
            }
        });

        this.playFlipSound();
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesText.setText('Moves: ' + this.moves);
            this.checkMatch();
        }
    }

    checkMatch() {
        this.isChecking = true;
        const [c1, c2] = this.flippedCards;

        if (c1.value === c2.value) {
            // MATCH!
            this.time.delayedCall(350, () => {
                c1.isMatched = true;
                c2.isMatched = true;
                this.matchedPairs++;
                this.pairsText.setText('Pairs: ' + this.matchedPairs + '/6');

                // Green glow + pulse
                [c1, c2].forEach(c => {
                    c.face.setStrokeStyle(3, 0x00E676);
                    this.tweens.add({
                        targets: [c.face, c.faceEmoji, c.faceName],
                        scaleX: 1.06, scaleY: 1.06, duration: 150, yoyo: true
                    });
                });

                // Praise text
                const phrases = ['Yummy!', 'Delicious!', 'Sweet!', 'Tasty!', 'Mmm!', 'Perfect!'];
                const phrase = phrases[Math.min(this.matchedPairs - 1, phrases.length - 1)];
                const praise = this.add.text(
                    (c1.x + c2.x) / 2, Math.min(c1.y, c2.y) - 30, phrase,
                    {
                        fontSize: '18px', fontFamily: 'Courier New, monospace',
                        color: '#FFD700', stroke: '#000000', strokeThickness: 3
                    }
                ).setOrigin(0.5).setDepth(100);
                this.tweens.add({
                    targets: praise, y: praise.y - 25, alpha: 0,
                    duration: 800, onComplete: () => praise.destroy()
                });

                this.playMatchSound();
                this.flippedCards = [];
                this.isChecking = false;

                if (this.matchedPairs === this.totalPairs) {
                    this.time.delayedCall(600, () => this.allMatched());
                }
            });
        } else {
            // No match — flip back
            this.time.delayedCall(700, () => {
                [c1, c2].forEach(card => {
                    card.isFlipped = false;
                    this.tweens.add({
                        targets: [card.face, card.faceEmoji, card.faceName],
                        scaleX: 0, duration: 120,
                        onComplete: () => {
                            card.face.setVisible(false);
                            card.faceEmoji.setVisible(false);
                            card.faceName.setVisible(false);
                            card.back.setVisible(true).setScale(0, 1);
                            card.backEmoji.setVisible(true).setScale(0, 1);
                            card.backQ.setVisible(true).setScale(0, 1);
                            this.tweens.add({
                                targets: [card.back, card.backEmoji, card.backQ],
                                scaleX: 1, duration: 120
                            });
                        }
                    });
                });
                this.playMismatchSound();
                this.flippedCards = [];
                this.isChecking = false;
            });
        }
    }

    allMatched() {
        const w = 800, h = 450;
        this.stopAmbientMusic();

        // Overlay
        this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5).setDepth(150);

        // Star rating
        const stars = this.moves <= 8 ? '***' : this.moves <= 12 ? '**' : '*';

        const text = this.add.text(w / 2, h / 2 - 30,
            'All Chocolates Matched!\n' + stars + '\nMoves: ' + this.moves,
            {
                fontSize: '22px', fontFamily: 'Courier New, monospace',
                color: '#FFD700', stroke: '#000000', strokeThickness: 4,
                align: 'center', lineSpacing: 8
            }
        ).setOrigin(0.5).setDepth(200).setScale(0.5);

        this.tweens.add({
            targets: text, scaleX: 1, scaleY: 1,
            duration: 600, ease: 'Back.easeOut'
        });

        const nextText = this.add.text(w / 2, h / 2 + 55, 'Get ready for the boss fight!', {
            fontSize: '13px', fontFamily: 'Courier New, monospace',
            color: '#FF69B4', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(200).setAlpha(0);

        this.tweens.add({ targets: nextText, alpha: 1, duration: 500, delay: 1500 });

        // Chocolate confetti
        this.time.addEvent({
            delay: 80, repeat: 30, callback: () => {
                const emojis = ['*', 'o', '+', 'x', '#'];
                const choc = this.add.text(
                    Phaser.Math.Between(50, w - 50), -20,
                    emojis[Phaser.Math.Between(0, emojis.length - 1)],
                    { fontSize: '20px' }
                ).setDepth(160);
                this.tweens.add({
                    targets: choc,
                    y: h + 30, x: choc.x + Phaser.Math.Between(-60, 60),
                    angle: Phaser.Math.Between(-180, 180),
                    duration: Phaser.Math.Between(1500, 3000),
                    onComplete: () => choc.destroy()
                });
            }
        });

        this.playVictoryJingle();

        this.time.delayedCall(4500, () => {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ShooScene');
            });
        });
    }

    // === SOUNDS ===

    playFlipSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
        } catch(e) {}
    }

    playMatchSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            [523, 659, 784].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine'; osc.frequency.value = freq;
                const t = ctx.currentTime + i * 0.08;
                gain.gain.setValueAtTime(0.05, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
                osc.start(t); osc.stop(t + 0.15);
            });
        } catch(e) {}
    }

    playMismatchSound() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
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

    startAmbientMusic() {
        try {
            const ctx = this.sound.context; if (!ctx) return;
            this.aMusicPlaying = true;
            this.aMusicOscs = [];
            this.aMusicTimers = [];

            const bpm = 72;
            const quarter = 60 / bpm;

            // Calm jazzy chocolate shop melody
            const melody = [
                [330, 2], [370, 2], [440, 4], [0, 2], [392, 2],
                [370, 2], [330, 2], [294, 4], [0, 2], [262, 2],
                [294, 2], [330, 2], [370, 4], [0, 2], [392, 2],
                [440, 2], [392, 2], [370, 2], [330, 2], [0, 4],
            ];

            // Gentle bass
            const bass = [
                [131, 4], [147, 4], [165, 4], [131, 4],
                [110, 4], [131, 4], [147, 4], [165, 4],
                [131, 8], [110, 8],
            ];

            const melodyLen = melody.reduce((s, n) => s + n[1], 0);
            const loopDuration = melodyLen * quarter;

            const scheduleLoop = () => {
                if (!this.aMusicPlaying) return;
                const now = ctx.currentTime + 0.05;

                let t = now;
                melody.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine'; osc.frequency.value = freq;
                        osc.connect(gain); gain.connect(ctx.destination);
                        gain.gain.setValueAtTime(0.025, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * quarter - 0.02);
                        osc.start(t); osc.stop(t + dur * quarter);
                        this.aMusicOscs.push(osc);
                    }
                    t += dur * quarter;
                });

                t = now;
                bass.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle'; osc.frequency.value = freq;
                        osc.connect(gain); gain.connect(ctx.destination);
                        gain.gain.setValueAtTime(0.02, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * quarter - 0.02);
                        osc.start(t); osc.stop(t + dur * quarter);
                        this.aMusicOscs.push(osc);
                    }
                    t += dur * quarter;
                });

                const timer = setTimeout(() => scheduleLoop(), (loopDuration - 0.1) * 1000);
                this.aMusicTimers.push(timer);
            };

            scheduleLoop();
        } catch(e) {}
    }

    stopAmbientMusic() {
        this.aMusicPlaying = false;
        if (this.aMusicTimers) { this.aMusicTimers.forEach(t => clearTimeout(t)); this.aMusicTimers = []; }
        if (this.aMusicOscs) { this.aMusicOscs.forEach(o => { try { o.stop(); } catch(e) {} }); this.aMusicOscs = []; }
    }
}
