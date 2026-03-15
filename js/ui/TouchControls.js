// TouchControls.js - Mobile virtual button overlay
class TouchControls {
    constructor(scene) {
        this.scene = scene;
        this.left = false;
        this.right = false;
        this.jump = false;
        this.jumpJustPressed = false;
        this.shoot = false;
        this.shootJustPressed = false;

        this.createButtons();
        this.setupKeyboard();
    }

    createButtons() {
        // Create DOM overlay for touch buttons
        this.container = document.createElement('div');
        this.container.className = 'touch-controls active';

        // Left button
        this.btnLeft = document.createElement('div');
        this.btnLeft.className = 'touch-btn btn-left';
        this.btnLeft.innerHTML = '&lt;';

        // Right button
        this.btnRight = document.createElement('div');
        this.btnRight.className = 'touch-btn btn-right';
        this.btnRight.innerHTML = '&gt;';

        // Jump button
        this.btnJump = document.createElement('div');
        this.btnJump.className = 'touch-btn btn-jump';
        this.btnJump.innerHTML = '^';

        this.container.appendChild(this.btnLeft);
        this.container.appendChild(this.btnRight);
        this.container.appendChild(this.btnJump);
        document.body.appendChild(this.container);

        // Touch event listeners
        this.addTouchEvents(this.btnLeft, 'left');
        this.addTouchEvents(this.btnRight, 'right');
        this.addJumpEvents(this.btnJump);
    }

    addTouchEvents(btn, direction) {
        const start = () => {
            this[direction] = true;
            btn.classList.add('pressed');
        };
        const end = () => {
            this[direction] = false;
            btn.classList.remove('pressed');
        };

        btn.addEventListener('touchstart', (e) => { e.preventDefault(); start(); }, { passive: false });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); end(); }, { passive: false });
        btn.addEventListener('touchcancel', (e) => { e.preventDefault(); end(); }, { passive: false });
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
    }

    addJumpEvents(btn) {
        const start = () => {
            this.jump = true;
            this.jumpJustPressed = true;
            btn.classList.add('pressed');
        };
        const end = () => {
            this.jump = false;
            btn.classList.remove('pressed');
        };

        btn.addEventListener('touchstart', (e) => { e.preventDefault(); start(); }, { passive: false });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); end(); }, { passive: false });
        btn.addEventListener('touchcancel', (e) => { e.preventDefault(); end(); }, { passive: false });
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
    }

    setupKeyboard() {
        // Also support keyboard controls for testing
        if (!this.scene.input || !this.scene.input.keyboard) return;

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Jump on key down (just pressed)
        this.scene.input.keyboard.on('keydown-UP', () => { this.jumpJustPressed = true; });
        this.scene.input.keyboard.on('keydown-W', () => { this.jumpJustPressed = true; });
        this.scene.input.keyboard.on('keydown-SPACE', () => { this.jumpJustPressed = true; });
        this.scene.input.keyboard.on('keydown-X', () => { this.shootJustPressed = true; });
    }

    update() {
        // Merge keyboard input with touch
        if (this.cursors) {
            if (this.cursors.left.isDown || this.wasd.left.isDown) this.left = true;
            else if (!this.isTouchingLeft()) this.left = false;

            if (this.cursors.right.isDown || this.wasd.right.isDown) this.right = true;
            else if (!this.isTouchingRight()) this.right = false;

            if (this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown) this.jump = true;
            else if (!this.isTouchingJump()) this.jump = false;
        }
    }

    isTouchingLeft() {
        return this.btnLeft.classList.contains('pressed');
    }

    isTouchingRight() {
        return this.btnRight.classList.contains('pressed');
    }

    isTouchingJump() {
        return this.btnJump.classList.contains('pressed');
    }

    getState() {
        const state = {
            left: this.left,
            right: this.right,
            jump: this.jump,
            jumpJustPressed: this.jumpJustPressed,
            shoot: this.shootJustPressed
        };
        this.jumpJustPressed = false;
        this.shootJustPressed = false;
        return state;
    }

    addShootButton() {
        if (this.btnShoot) return;
        this.btnShoot = document.createElement('div');
        this.btnShoot.className = 'touch-btn btn-shoot';
        this.btnShoot.innerHTML = 'X';
        this.container.appendChild(this.btnShoot);

        const start = () => {
            this.shoot = true;
            this.shootJustPressed = true;
            this.btnShoot.classList.add('pressed');
        };
        const end = () => {
            this.shoot = false;
            this.btnShoot.classList.remove('pressed');
        };

        this.btnShoot.addEventListener('touchstart', (e) => { e.preventDefault(); start(); }, { passive: false });
        this.btnShoot.addEventListener('touchend', (e) => { e.preventDefault(); end(); }, { passive: false });
        this.btnShoot.addEventListener('touchcancel', (e) => { e.preventDefault(); end(); }, { passive: false });
        this.btnShoot.addEventListener('mousedown', start);
        this.btnShoot.addEventListener('mouseup', end);
        this.btnShoot.addEventListener('mouseleave', end);
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    hide() {
        this.container.classList.remove('active');
    }

    show() {
        this.container.classList.add('active');
    }
}
