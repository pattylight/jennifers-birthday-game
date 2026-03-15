// NightClubScene.js — Guitar Hero-style rhythm mini-game at the cruise ship night club!
class NightClubScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NightClubScene' });
    }

    create() {
        const w = 800, h = 450;

        // Cleanup on shutdown
        this.events.on('shutdown', () => {
            this.stopMusic();
            if (this.controlContainer && this.controlContainer.parentNode) {
                this.controlContainer.parentNode.removeChild(this.controlContainer);
            }
        });

        // ========== NIGHT CLUB BACKGROUND ==========
        // Dark dance floor
        this.add.rectangle(w / 2, h / 2, w, h, 0x0A0015).setDepth(-10);

        // Shiny checkered dance floor
        for (let y = h - 120; y < h; y += 30) {
            for (let x = 0; x < w; x += 30) {
                const bright = ((Math.floor(x / 30) + Math.floor(y / 30)) % 2 === 0);
                this.add.rectangle(x + 15, y + 15, 30, 30, bright ? 0x222244 : 0x110022).setDepth(-9);
            }
        }

        // Disco ball
        this.discoBall = this.add.circle(w / 2, 35, 18, 0xCCCCCC).setDepth(5);
        this.add.circle(w / 2, 35, 14, 0xEEEEEE).setDepth(5);
        // Sparkle squares on disco ball
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.add.rectangle(
                w / 2 + Math.cos(angle) * 10,
                35 + Math.sin(angle) * 10,
                4, 4, 0xFFFFFF, 0.7
            ).setDepth(6);
        }
        // String from ceiling
        this.add.rectangle(w / 2, 10, 2, 18, 0x666666).setDepth(4);

        // Disco light beams (will animate)
        this.discoLights = [];
        const lightColors = [0xFF00FF, 0x00FFFF, 0xFFFF00, 0xFF0066, 0x00FF66];
        for (let i = 0; i < 5; i++) {
            const light = this.add.triangle(
                w / 2, 50,
                0, 0,
                -40 - i * 30, h,
                40 + i * 30, h,
                lightColors[i], 0.06
            ).setDepth(-8);
            this.discoLights.push(light);
        }

        // Stage / DJ booth at back
        this.add.rectangle(w / 2, h - 150, 200, 60, 0x1A0033).setDepth(-5);
        this.add.rectangle(w / 2, h - 172, 180, 10, 0xFF00FF, 0.3).setDepth(-4);
        this.add.text(w / 2, h - 155, 'DJ', {
            fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF00FF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(-3);

        // Speakers
        this.add.rectangle(140, h - 140, 40, 50, 0x222222).setDepth(-5);
        this.add.circle(140, h - 140, 12, 0x333333).setDepth(-4);
        this.add.circle(140, h - 140, 5, 0x111111).setDepth(-4);
        this.add.rectangle(w - 140, h - 140, 40, 50, 0x222222).setDepth(-5);
        this.add.circle(w - 140, h - 140, 12, 0x333333).setDepth(-4);
        this.add.circle(w - 140, h - 140, 5, 0x111111).setDepth(-4);

        // Neon sign
        this.neonText = this.add.text(w / 2, 70, '★ CLUB CRUISE ★', {
            fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF00FF', stroke: '#FF00FF', strokeThickness: 1
        }).setOrigin(0.5).setDepth(10).setAlpha(0.9);

        // ========== RHYTHM GAME LANES ==========
        this.laneCount = 4;
        this.laneWidth = 70;
        this.laneGap = 10;
        this.totalLaneWidth = this.laneCount * this.laneWidth + (this.laneCount - 1) * this.laneGap;
        this.laneStartX = (w - this.totalLaneWidth) / 2;
        this.hitLineY = h - 60;
        this.spawnY = -30;

        // Lane colors
        this.laneColors = [0xFF0066, 0x00CCFF, 0xFFCC00, 0x00FF66];
        this.laneKeys = ['D', 'F', 'J', 'K'];
        this.laneLabels = ['←', '↓', '↑', '→'];

        // Draw lane backgrounds
        for (let i = 0; i < this.laneCount; i++) {
            const lx = this.laneStartX + i * (this.laneWidth + this.laneGap) + this.laneWidth / 2;
            // Lane track (dark strip)
            this.add.rectangle(lx, h / 2, this.laneWidth, h, 0x111133, 0.5).setDepth(0);
            // Lane borders
            this.add.rectangle(lx - this.laneWidth / 2, h / 2, 2, h, 0x333366, 0.3).setDepth(0);
            this.add.rectangle(lx + this.laneWidth / 2, h / 2, 2, h, 0x333366, 0.3).setDepth(0);
        }

        // Hit zone line
        this.add.rectangle(w / 2, this.hitLineY, this.totalLaneWidth + 20, 4, 0xFFFFFF, 0.5).setDepth(1);

        // Hit zone buttons (the targets at the bottom) — tall for easy tapping
        this.hitZones = [];
        for (let i = 0; i < this.laneCount; i++) {
            const lx = this.laneStartX + i * (this.laneWidth + this.laneGap) + this.laneWidth / 2;
            const zone = this.add.rectangle(lx, this.hitLineY, this.laneWidth - 4, 32, this.laneColors[i], 0.3)
                .setDepth(2).setStrokeStyle(3, this.laneColors[i], 0.8);
            this.hitZones.push(zone);

            // Key label
            this.add.text(lx, this.hitLineY, this.laneLabels[i], {
                fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(3);
        }

        // ========== GAME STATE ==========
        this.notes = [];            // Active falling notes
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.hits = 0;
        this.misses = 0;
        this.totalNotes = 0;
        this.songTime = 0;
        this.songStarted = false;
        this.songDone = false;
        this.gameOver = false;
        this.noteSpeed = 220;       // Pixels per second

        // Hit window (pixels from hit line)
        this.perfectWindow = 18;
        this.goodWindow = 40;
        this.okWindow = 60;

        // ========== SONG DATA ==========
        // Each note: { time: ms, lane: 0-3 }
        this.songData = this.generateSong();
        this.noteIndex = 0;

        // ========== UI ==========
        this.scoreText = this.add.text(20, 10, 'Score: 0', {
            fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setDepth(100);

        this.comboText = this.add.text(w - 20, 10, '', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#00FFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0).setDepth(100);

        this.feedbackText = this.add.text(w / 2, this.hitLineY - 40, '', {
            fontSize: '22px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(100).setAlpha(0);

        // Progress bar
        this.progBarBg = this.add.rectangle(w / 2, h - 12, 300, 8, 0x222222).setDepth(100);
        this.progBar = this.add.rectangle(w / 2 - 150, h - 12, 0, 6, 0xFF00FF).setOrigin(0, 0.5).setDepth(101);

        // ========== CONTROLS ==========
        this.setupControls();

        // ========== INTRO SEQUENCE ==========
        this.showIntro();

        this.cameras.main.fadeIn(500);
    }

    generateSong() {
        // A fun dance song pattern ~25 seconds
        // Time is in ms from song start
        const notes = [];
        const bpm = 128;
        const beat = 60000 / bpm; // ~468ms per beat

        // Verse 1: Simple singles (beats 0-16)
        const verse1 = [
            [0, 0], [1, 1], [2, 2], [3, 3],
            [4, 1], [5, 2], [6, 0], [7, 3],
            [8, 2], [9, 1], [10, 0], [11, 3],
            [12, 0], [13, 2], [14, 1], [15, 3],
        ];

        // Chorus: Faster + some doubles (beats 16-32)
        const chorus = [
            [16, 0], [16, 3],          // double
            [17, 1], [18, 2],
            [19, 0], [19, 3],          // double
            [20, 2], [20.5, 1],        // eighth note
            [21, 3], [22, 0],
            [23, 1], [23, 2],          // double
            [24, 0], [24.5, 3],
            [25, 1], [25.5, 2],
            [26, 0], [26.5, 1], [27, 2], [27.5, 3],  // run
            [28, 0], [28, 3],
            [29, 1], [29, 2],
            [30, 0], [30.5, 1], [31, 2], [31.5, 3],
        ];

        // Bridge: Tricky patterns (beats 32-44)
        const bridge = [
            [32, 2], [33, 1], [34, 0], [34.5, 3],
            [35, 1], [35, 2],
            [36, 0], [37, 3], [38, 1], [38, 2],
            [39, 0], [39.5, 1], [40, 2], [40.5, 3],
            [41, 0], [41, 1], [41, 2], [41, 3],  // quad!
            [42, 1], [43, 2],
        ];

        // Finale: Big finish (beats 44-52)
        const finale = [
            [44, 0], [44, 3], [45, 1], [45, 2],
            [46, 0], [46.5, 1], [47, 2], [47.5, 3],
            [48, 0], [48, 1], [48, 2], [48, 3],
            [49, 0], [49.5, 1], [50, 2], [50.5, 3],
            [51, 0], [51, 1], [51, 2], [51, 3],
        ];

        [...verse1, ...chorus, ...bridge, ...finale].forEach(([beatNum, lane]) => {
            notes.push({ time: beatNum * beat, lane });
        });

        return notes;
    }

    showIntro() {
        const w = 800, h = 450;

        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.85).setDepth(200);

        const title = this.add.text(w / 2, h / 2 - 60, '🎵 CLUB CRUISE 🎵', {
            fontSize: '32px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF00FF', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(201);

        const subtitle = this.add.text(w / 2, h / 2 - 15, "It's Jennifer's birthday party on the dance floor!", {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(201);

        const instructions = this.add.text(w / 2, h / 2 + 30, 'Tap the lane when notes reach the targets!', {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#00FFFF', stroke: '#000000', strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setDepth(201);

        const tapText = this.add.text(w / 2, h / 2 + 80, '» TAP TO START «', {
            fontSize: '20px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(201);

        this.tweens.add({
            targets: tapText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
        });

        this.input.once('pointerdown', () => {
            this.tweens.add({
                targets: [overlay, title, subtitle, instructions, tapText],
                alpha: 0, duration: 400,
                onComplete: () => {
                    overlay.destroy();
                    title.destroy();
                    subtitle.destroy();
                    instructions.destroy();
                    tapText.destroy();
                    this.startSong();
                }
            });
        });

        // Also allow keyboard start
        if (this.input.keyboard) {
            this.input.keyboard.once('keydown', () => {
                this.tweens.add({
                    targets: [overlay, title, subtitle, instructions, tapText],
                    alpha: 0, duration: 400,
                    onComplete: () => {
                        overlay.destroy();
                        title.destroy();
                        subtitle.destroy();
                        instructions.destroy();
                        tapText.destroy();
                        this.startSong();
                    }
                });
            });
        }
    }

    startSong() {
        if (this.songStarted) return;
        this.songStarted = true;
        this.songTime = 0;
        this.noteIndex = 0;
        this.totalNotes = this.songData.length;
        this.startMusic();

        // Countdown
        const w = 800, h = 450;
        const countdown = this.add.text(w / 2, h / 2 - 20, '3', {
            fontSize: '48px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(150);

        this.songTime = -1800; // Start with countdown delay

        this.time.delayedCall(600, () => { countdown.setText('2'); });
        this.time.delayedCall(1200, () => { countdown.setText('1'); });
        this.time.delayedCall(1600, () => {
            countdown.setText('GO!');
            countdown.setColor('#FFD700');
        });
        this.time.delayedCall(2000, () => { countdown.destroy(); });
    }

    setupControls() {
        // Keyboard: arrow keys map to lanes 0-3 (← ↓ ↑ →)
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-LEFT', () => this.hitLane(0));
            this.input.keyboard.on('keydown-DOWN', () => this.hitLane(1));
            this.input.keyboard.on('keydown-UP', () => this.hitLane(2));
            this.input.keyboard.on('keydown-RIGHT', () => this.hitLane(3));

            // DFJK alternative
            this.input.keyboard.on('keydown-D', () => this.hitLane(0));
            this.input.keyboard.on('keydown-F', () => this.hitLane(1));
            this.input.keyboard.on('keydown-J', () => this.hitLane(2));
            this.input.keyboard.on('keydown-K', () => this.hitLane(3));
        }

        // Mobile: large in-game tap zones covering the bottom of each lane
        // These are Phaser objects so they scale with the canvas — perfect for mobile
        this.tapZones = [];
        const tapHeight = 120;
        const colorHex = [0xFF0066, 0x00CCFF, 0xFFCC00, 0x00FF66];
        for (let i = 0; i < this.laneCount; i++) {
            const lx = this.laneStartX + i * (this.laneWidth + this.laneGap) + this.laneWidth / 2;
            const tapZone = this.add.rectangle(lx, this.hitLineY, this.laneWidth, tapHeight, colorHex[i], 0)
                .setDepth(50).setInteractive();

            const lane = i;
            tapZone.on('pointerdown', () => {
                this.hitLane(lane);
            });

            this.tapZones.push(tapZone);
        }

        // No DOM overlay needed — controls are entirely in-canvas
        this.controlContainer = null;
    }

    hitLane(lane) {
        if (!this.songStarted || this.songDone) return;

        // Flash the hit zone
        this.tweens.add({
            targets: this.hitZones[lane],
            fillAlpha: 0.8,
            duration: 80,
            yoyo: true,
            onComplete: () => { this.hitZones[lane].fillAlpha = 0.25; }
        });

        // Find the closest note in this lane
        let bestNote = null;
        let bestDist = Infinity;

        for (const note of this.notes) {
            if (note.lane !== lane || note.hit || note.missed) continue;
            const dist = Math.abs(note.sprite.y - this.hitLineY);
            if (dist < bestDist) {
                bestDist = dist;
                bestNote = note;
            }
        }

        if (bestNote && bestDist <= this.okWindow) {
            bestNote.hit = true;
            this.hits++;

            let rating, color, points;
            if (bestDist <= this.perfectWindow) {
                rating = 'PERFECT!';
                color = '#FFD700';
                points = 100;
            } else if (bestDist <= this.goodWindow) {
                rating = 'GREAT!';
                color = '#00FF66';
                points = 70;
            } else {
                rating = 'OK';
                color = '#00CCFF';
                points = 40;
            }

            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            // Combo multiplier
            const multiplier = Math.min(4, 1 + Math.floor(this.combo / 10));
            this.score += points * multiplier;

            this.showFeedback(rating, color);
            this.showHitEffect(bestNote.lane, this.laneColors[bestNote.lane]);
            this.playHitSound(bestNote.lane);

            // Remove the note visual
            if (bestNote.label) bestNote.label.destroy();
            this.tweens.add({
                targets: bestNote.sprite,
                scaleX: 1.5, scaleY: 1.5, alpha: 0,
                duration: 150,
                onComplete: () => { if (bestNote.sprite) bestNote.sprite.destroy(); }
            });
            if (bestNote.glow) bestNote.glow.destroy();
        } else {
            // Missed (no note nearby)
            this.combo = 0;
            this.showFeedback('MISS', '#FF4444');
            this.playMissSound();
        }

        this.updateUI();
    }

    showFeedback(text, color) {
        this.feedbackText.setText(text);
        this.feedbackText.setColor(color);
        this.feedbackText.setAlpha(1);
        this.feedbackText.setScale(0.5);
        this.tweens.killTweensOf(this.feedbackText);
        this.tweens.add({
            targets: this.feedbackText,
            scaleX: 1, scaleY: 1,
            duration: 150,
            ease: 'Back.easeOut'
        });
        this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 400,
            delay: 300
        });
    }

    showHitEffect(lane, color) {
        const lx = this.laneStartX + lane * (this.laneWidth + this.laneGap) + this.laneWidth / 2;

        // Burst particles
        for (let i = 0; i < 6; i++) {
            const p = this.add.circle(
                lx + Phaser.Math.Between(-20, 20),
                this.hitLineY + Phaser.Math.Between(-10, 10),
                Phaser.Math.Between(2, 5),
                color, 0.8
            ).setDepth(50);
            this.tweens.add({
                targets: p,
                y: p.y - Phaser.Math.Between(20, 60),
                x: p.x + Phaser.Math.Between(-30, 30),
                alpha: 0, duration: 400,
                onComplete: () => p.destroy()
            });
        }

        // Ring expand
        const ring = this.add.circle(lx, this.hitLineY, 10, color, 0).setDepth(49)
            .setStrokeStyle(3, color, 0.8);
        this.tweens.add({
            targets: ring,
            scaleX: 3, scaleY: 3, alpha: 0,
            duration: 350,
            onComplete: () => ring.destroy()
        });
    }

    spawnNote(lane) {
        const lx = this.laneStartX + lane * (this.laneWidth + this.laneGap) + this.laneWidth / 2;
        const color = this.laneColors[lane];

        // Note sprite (colored rectangle)
        const sprite = this.add.rectangle(lx, this.spawnY, this.laneWidth - 16, 20, color, 0.9)
            .setDepth(10).setStrokeStyle(2, 0xFFFFFF, 0.4);

        // Arrow label on the note
        const label = this.add.text(lx, this.spawnY, this.laneLabels[lane], {
            fontSize: '14px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 1
        }).setOrigin(0.5).setDepth(11);

        // Subtle glow behind note
        const glow = this.add.rectangle(lx, this.spawnY, this.laneWidth - 8, 26, color, 0.15).setDepth(9);

        const note = {
            lane,
            sprite,
            label,
            glow,
            hit: false,
            missed: false
        };
        this.notes.push(note);
    }

    updateUI() {
        this.scoreText.setText('Score: ' + this.score);
        if (this.combo >= 5) {
            const mult = Math.min(4, 1 + Math.floor(this.combo / 10));
            this.comboText.setText(this.combo + ' combo' + (mult > 1 ? ' x' + mult : ''));
            this.comboText.setColor(this.combo >= 20 ? '#FFD700' : '#00FFFF');
        } else {
            this.comboText.setText('');
        }
    }

    update(time, delta) {
        if (!this.songStarted || this.gameOver) return;

        this.songTime += delta;

        // Animate disco lights
        this.discoLights.forEach((light, i) => {
            light.x = 400 + Math.sin(time * 0.001 + i * 1.2) * 120;
        });

        // Pulse neon sign
        if (this.neonText) {
            this.neonText.setAlpha(0.6 + Math.sin(time * 0.005) * 0.4);
        }

        // Calculate travel time (how long it takes a note to go from spawn to hit line)
        const travelTime = ((this.hitLineY - this.spawnY) / this.noteSpeed) * 1000;

        // Spawn notes ahead of time
        while (this.noteIndex < this.songData.length) {
            const noteData = this.songData[this.noteIndex];
            if (noteData.time - travelTime <= this.songTime) {
                this.spawnNote(noteData.lane);
                this.noteIndex++;
            } else {
                break;
            }
        }

        // Move notes down
        const moveAmount = this.noteSpeed * (delta / 1000);
        for (const note of this.notes) {
            if (note.hit || note.missed) continue;
            note.sprite.y += moveAmount;
            if (note.label) note.label.y += moveAmount;
            if (note.glow) note.glow.y += moveAmount;

            // Miss detection: note went past hit zone
            if (note.sprite.y > this.hitLineY + this.okWindow + 20) {
                note.missed = true;
                this.misses++;
                this.combo = 0;
                this.updateUI();

                // Fade out
                this.tweens.add({
                    targets: [note.sprite, note.glow],
                    alpha: 0, duration: 200,
                    onComplete: () => {
                        if (note.sprite) note.sprite.destroy();
                        if (note.glow) note.glow.destroy();
                        if (note.label) note.label.destroy();
                    }
                });

                // Flash hit zone red
                this.hitZones[note.lane].setFillStyle(0xFF0000, 0.4);
                this.time.delayedCall(200, () => {
                    if (this.hitZones[note.lane]) {
                        this.hitZones[note.lane].setFillStyle(this.laneColors[note.lane], 0.25);
                    }
                });
            }
        }

        // Clean up destroyed notes
        this.notes = this.notes.filter(n => !n.hit && !n.missed);

        // Progress bar
        if (this.songData.length > 0) {
            const lastNoteTime = this.songData[this.songData.length - 1].time;
            const progress = Math.max(0, Math.min(1, this.songTime / (lastNoteTime + 2000)));
            this.progBar.displayWidth = 300 * progress;
        }

        // Song complete check
        if (!this.songDone && this.noteIndex >= this.songData.length && this.notes.length === 0) {
            this.songDone = true;
            this.time.delayedCall(1500, () => this.showResults());
        }
    }

    showResults() {
        this.gameOver = true;
        this.stopMusic();

        const w = 800, h = 450;
        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.85).setDepth(200);

        const accuracy = this.totalNotes > 0 ? Math.round((this.hits / this.totalNotes) * 100) : 0;

        // Grade
        let grade, gradeColor;
        if (accuracy >= 95) { grade = 'S★'; gradeColor = '#FFD700'; }
        else if (accuracy >= 85) { grade = 'A'; gradeColor = '#00FF66'; }
        else if (accuracy >= 70) { grade = 'B'; gradeColor = '#00CCFF'; }
        else if (accuracy >= 50) { grade = 'C'; gradeColor = '#FFCC00'; }
        else { grade = 'D'; gradeColor = '#FF4444'; }

        this.add.text(w / 2, h / 2 - 80, '🎵 DANCE COMPLETE! 🎵', {
            fontSize: '28px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FF00FF', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(201);

        this.add.text(w / 2, h / 2 - 35, grade, {
            fontSize: '48px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: gradeColor, stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5).setDepth(201);

        this.add.text(w / 2, h / 2 + 15, `Score: ${this.score}   Accuracy: ${accuracy}%`, {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(201);

        this.add.text(w / 2, h / 2 + 45, `Max Combo: ${this.maxCombo}   Hits: ${this.hits}/${this.totalNotes}`, {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#CCCCCC', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(201);

        // Jennifer dancing celebration
        const jenText = accuracy >= 70
            ? "Jennifer tears up the dance floor! 💃"
            : "Jennifer had fun dancing anyway! 😄";
        this.add.text(w / 2, h / 2 + 80, jenText, {
            fontSize: '16px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFB6C1', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(201);

        const continueText = this.add.text(w / 2, h / 2 + 115, '» TAP TO CONTINUE «', {
            fontSize: '18px', fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(201);
        this.tweens.add({
            targets: continueText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
        });

        this.playResultSound(accuracy >= 70);

        this.input.once('pointerdown', () => this.goToNextScene());
        if (this.input.keyboard) {
            this.input.keyboard.once('keydown', () => this.goToNextScene());
        }
    }

    goToNextScene() {
        if (this.controlContainer && this.controlContainer.parentNode) {
            this.controlContainer.parentNode.removeChild(this.controlContainer);
        }

        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start('BossScene');
        });
    }

    // ========== MUSIC ENGINE ==========
    startMusic() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            this.musicPlaying = true;
            this.musicOscs = [];
            this.musicTimers = [];

            const bpm = 128;
            const beat = 60 / bpm;

            // Funky dance bass line
            const bassNotes = [
                [82, 2], [0, 1], [82, 1], [98, 2], [0, 1], [98, 1],
                [73, 2], [0, 1], [82, 1], [110, 2], [0, 1], [98, 1],
                [82, 2], [0, 1], [82, 1], [123, 2], [0, 1], [110, 1],
                [98, 2], [0, 1], [82, 1], [73, 3], [0, 1],
            ];

            // Synth melody (dance-y)
            const melodyNotes = [
                [523, 1], [0, 1], [659, 1], [587, 1],
                [523, 1], [0, 1], [494, 1], [523, 1],
                [659, 1], [0, 1], [784, 1], [659, 1],
                [587, 1], [0, 1], [523, 1], [0, 1],
                [784, 1], [0, 1], [659, 1], [587, 1],
                [523, 1], [587, 1], [659, 1], [0, 1],
                [784, 1], [880, 1], [784, 1], [659, 1],
                [587, 2], [523, 2],
            ];

            // Hi-hat pattern
            const hihat = [
                [1, 1], [0, 1], [1, 1], [1, 1],
                [1, 1], [0, 1], [1, 1], [1, 1],
                [1, 1], [0, 1], [1, 1], [1, 1],
                [1, 1], [1, 1], [1, 1], [1, 1],
            ];

            const bassLen = bassNotes.reduce((s, n) => s + n[1], 0);
            const loopDuration = bassLen * beat;

            const scheduleLoop = () => {
                if (!this.musicPlaying) return;
                const now = audioCtx.currentTime + 0.05;

                // Bass
                let t = now;
                bassNotes.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.06, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * beat - 0.01);
                        osc.start(t);
                        osc.stop(t + dur * beat);
                        this.musicOscs.push(osc);
                    }
                    t += dur * beat;
                });

                // Melody
                t = now;
                melodyNotes.forEach(([freq, dur]) => {
                    if (freq > 0) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'square';
                        osc.frequency.value = freq;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.03, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + dur * beat - 0.01);
                        osc.start(t);
                        osc.stop(t + dur * beat);
                        this.musicOscs.push(osc);
                    }
                    t += dur * beat;
                });

                // Hi-hat (noise-like)
                t = now;
                hihat.forEach(([on, dur]) => {
                    if (on) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.value = 8000;
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        gain.gain.setValueAtTime(0.015, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
                        osc.start(t);
                        osc.stop(t + 0.05);
                        this.musicOscs.push(osc);
                    }
                    t += dur * beat;
                });

                const timer = setTimeout(() => scheduleLoop(), (loopDuration - 0.1) * 1000);
                this.musicTimers.push(timer);
            };

            scheduleLoop();
        } catch (e) {}
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.musicTimers) {
            this.musicTimers.forEach(t => clearTimeout(t));
            this.musicTimers = [];
        }
        if (this.musicOscs) {
            this.musicOscs.forEach(osc => {
                try { osc.stop(); } catch (e) {}
            });
            this.musicOscs = [];
        }
    }

    playHitSound(lane) {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            const freqs = [523, 659, 784, 880];
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.value = freqs[lane];
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {}
    }

    playMissSound() {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.value = 150;
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.15);
        } catch (e) {}
    }

    playResultSound(good) {
        try {
            const audioCtx = this.sound.context;
            if (!audioCtx) return;
            const notes = good ? [523, 659, 784, 1047] : [400, 350, 300, 250];
            let t = audioCtx.currentTime;
            notes.forEach(freq => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.06, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                osc.start(t);
                osc.stop(t + 0.2);
                t += 0.15;
            });
        } catch (e) {}
    }
}
