// SpriteGenerator.js - All pixel art drawn programmatically via Canvas API
// Every sprite is hand-coded pixel by pixel to showcase coding skills!

const SpriteGen = {

    // Helper: create a canvas and draw pixels from a color map
    createSprite(width, height, pixelData, scale = 1) {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = pixelData[y]?.[x];
                if (color && color !== '.') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
        return canvas;
    },

    // Helper: create a spritesheet canvas from multiple frames
    createSpriteSheet(width, height, frames, scale = 1) {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale * frames.length;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');

        frames.forEach((pixelData, i) => {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const color = pixelData[y]?.[x];
                    if (color && color !== '.') {
                        ctx.fillStyle = color;
                        ctx.fillRect((i * width + x) * scale, y * scale, scale, scale);
                    }
                }
            }
        });
        return canvas;
    },

    // Color palette
    colors: {
        skin: '#C68642',
        skinDark: '#A0522D',
        skinLight: '#D4956B',
        hair: '#1a1a1a',
        hairHighlight: '#2d1810',
        sunglasses: '#1a1a1a',
        sunglassesLens: '#3D2B1F',
        sunglassesShine: '#FFFACD',
        dressTop: '#FF6B8A',
        dressBottom: '#FF4571',
        dressAccent: '#FFB6C1',
        shoes: '#FFD700',
        white: '#FFFFFF',
        // Honey colors
        pomFur: '#FF9933',
        pomFurLight: '#FFBB66',
        pomFurDark: '#CC7722',
        pomNose: '#222222',
        pomTongue: '#FF6B8A',
        pomEye: '#221100',
        // Martini colors
        glass: '#FFFFFF',
        glassShine: '#E8E8FF',
        coffee: '#4A2C17',
        coffeeLight: '#6B4226',
        olive: '#8FBC8F',
        foam: '#DEB887',
        // Seagull colors
        feather: '#F5F5F5',
        featherGray: '#D3D3D3',
        beak: '#FFB347',
        beakDark: '#E8952E',
        hatBlue: '#1B2A4A',
        hatGold: '#FFD700',
        seagullEye: '#111111',
        // Environment
        wood: '#8B6914',
        woodLight: '#A0822A',
        woodDark: '#6B5210',
        ocean: '#1E90FF',
        oceanDark: '#1565C0',
        oceanLight: '#64B5F6',
        sky: '#87CEEB',
        skyTop: '#5DADE2',
        cloud: '#FFFFFF',
        cloudShadow: '#E0E0E0',
        railing: '#CCCCCC',
        railingDark: '#999999',
    },

    // ==========================================
    // JENNIFER — Player Character (32x32)
    // ==========================================
    generateJennifer() {
        const c = this.colors;
        const _ = '.'; // transparent

        // Idle frame — Latina woman with long dark hair, cute sunglasses, pink dress, gold shoes
        const idle1 = [
            [_,_,_,_,_,_,_,_,_,_,_,_,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,c.hair,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,c.hair,c.hair,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.hair,c.hair,c.hair,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,c.hair,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.hair,c.hair,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,c.hair,c.skin,c.sunglasses,c.sunglassesLens,c.sunglassesShine,c.sunglasses,c.sunglasses,c.sunglasses,c.sunglassesLens,c.sunglassesShine,c.sunglasses,c.hair,c.hair,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,c.hair,c.skin,c.sunglasses,c.sunglassesLens,c.sunglassesLens,c.sunglasses,c.skin,c.sunglasses,c.sunglassesLens,c.sunglassesLens,c.sunglasses,c.skin,c.hair,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,c.hair,c.skin,c.skin,c.skin,c.skin,c.skin,c.skinDark,c.skin,c.skin,c.skin,c.skin,c.skin,c.hair,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,c.hair,c.skin,c.skin,c.skin,c.skin,c.skinLight,c.skinLight,c.skinLight,c.skin,c.skin,c.skin,c.skin,c.hair,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,_,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,_,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,_,_,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,_,_,_,c.skin,c.skin,c.skin,c.skin,c.skin,_,_,_,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,_,_,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,_,_,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,_,c.dressTop,c.dressTop,c.dressTop,c.dressAccent,c.dressAccent,c.dressAccent,c.dressTop,c.dressTop,c.dressTop,_,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,c.skin,c.dressTop,c.dressTop,c.dressTop,c.dressAccent,c.dressAccent,c.dressAccent,c.dressTop,c.dressTop,c.dressTop,c.skin,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,c.skin,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.skin,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.hair,_,c.skin,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.skin,_,c.hair,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,c.dressBottom,c.dressBottom,c.dressBottom,c.dressAccent,c.dressBottom,c.dressBottom,c.dressBottom,c.dressAccent,c.dressBottom,c.dressBottom,c.dressBottom,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,c.dressBottom,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,_,_,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,c.shoes,_,_,c.shoes,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_,_],
        ];

        // Run frame 1 — legs apart
        const run1 = JSON.parse(JSON.stringify(idle1));
        // Move left leg forward, right leg back
        run1[23] = [_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_];
        run1[24] = [_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_];
        run1[25] = [_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_];
        run1[26] = [_,_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_];
        run1[27] = [_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,c.shoes,_,_,_,_,_,c.shoes,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_];

        // Run frame 2 — legs together
        const run2 = JSON.parse(JSON.stringify(idle1));

        // Run frame 3 — legs opposite
        const run3 = JSON.parse(JSON.stringify(idle1));
        run3[23] = [_,_,_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_,_,_];
        run3[24] = [_,_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_,_];
        run3[25] = [_,_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_,_];
        run3[26] = [_,_,_,_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,_,_,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_,_,_];
        run3[27] = [_,_,_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,c.shoes,_,_,c.shoes,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_,_];

        // Jump frame — arms up, legs tucked
        const jump = JSON.parse(JSON.stringify(idle1));
        // Arms raised
        jump[12] = [_,_,_,_,_,_,_,_,c.hair,_,c.skin,c.skin,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.dressTop,c.skin,c.skin,_,c.hair,_,_,_,_,_,_,_,_,_];
        jump[13] = [_,_,_,_,_,_,_,_,c.hair,c.skin,c.skin,c.dressTop,c.dressTop,c.dressTop,c.dressAccent,c.dressAccent,c.dressAccent,c.dressTop,c.dressTop,c.dressTop,c.skin,c.skin,c.hair,_,_,_,_,_,_,_,_,_];
        // Legs tucked up
        jump[23] = [_,_,_,_,_,_,_,_,_,_,_,_,c.skin,c.skin,c.skin,_,_,c.skin,c.skin,c.skin,_,_,_,_,_,_,_,_,_,_,_,_];
        jump[24] = [_,_,_,_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.skin,_,_,c.skin,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_,_,_];
        jump[25] = [_,_,_,_,_,_,_,_,_,_,_,_,c.shoes,c.shoes,c.shoes,_,_,c.shoes,c.shoes,c.shoes,_,_,_,_,_,_,_,_,_,_,_,_];
        jump[26] = [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_];
        jump[27] = [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_];

        return { idle: idle1, run: [run1, run2, run3, run2], jump: jump };
    },

    // ==========================================
    // HONEY — Pomeranian Companion (24x24)
    // ==========================================
    generateHoney() {
        const c = this.colors;
        const _ = '.';
        const f = c.pomFur;      // orange fur
        const l = c.pomFurLight; // light fur
        const d = c.pomFurDark;  // dark fur (paws)
        const n = c.pomNose;     // black nose
        const e = c.pomEye;      // dark eye
        const w = c.white;       // eye whites
        const t = c.pomTongue;   // pink tongue

        // Redesigned: clearly a cute small Pomeranian with pointy ears, round fluffy body, snout, tail
        const idle1 = [
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,f,f,_,_,_,_,f,f,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,f,l,f,_,_,f,l,f,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,f,l,l,f,f,l,l,f,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,f,l,l,l,l,l,l,l,l,f,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,f,l,w,e,l,l,w,e,l,f,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,f,l,l,l,l,l,l,l,l,f,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,f,l,l,n,l,l,l,f,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,f,l,l,t,l,f,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,f,f,l,l,l,l,f,f,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,f,l,l,l,l,l,l,l,l,l,f,_,_,_,_,_,_,_,_,_,_,_],
            [_,f,l,l,l,l,l,l,l,l,l,l,l,f,_,_,_,_,_,_,_,_,_,_],
            [_,f,l,l,l,l,l,l,l,l,l,l,l,f,_,_,_,_,_,_,_,_,_,_],
            [_,f,f,l,l,l,l,l,l,l,l,l,f,f,f,f,_,_,_,_,_,_,_,_],
            [_,_,f,f,l,l,l,l,l,l,l,f,f,_,f,l,f,_,_,_,_,_,_,_],
            [_,_,_,f,f,l,l,l,l,l,f,f,_,_,f,l,f,_,_,_,_,_,_,_],
            [_,_,_,_,d,d,_,_,_,d,d,_,_,_,_,f,_,_,_,_,_,_,_,_],
            [_,_,_,_,d,d,_,_,_,d,d,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,d,d,d,d,_,d,d,d,d,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        ];

        // Run frame — legs spread apart, tail wagging up
        const run1 = JSON.parse(JSON.stringify(idle1));
        run1[13] = [_,f,f,l,l,l,l,l,l,l,l,l,f,f,_,f,f,_,_,_,_,_,_,_];
        run1[14] = [_,_,f,f,l,l,l,l,l,l,l,f,f,_,f,l,f,_,_,_,_,_,_,_];
        run1[15] = [_,_,_,f,f,l,l,l,l,l,f,f,_,f,l,f,_,_,_,_,_,_,_,_];
        run1[16] = [_,_,_,d,d,_,_,_,_,_,d,d,_,_,f,_,_,_,_,_,_,_,_,_];
        run1[17] = [_,_,d,d,_,_,_,_,_,_,_,d,d,_,_,_,_,_,_,_,_,_,_,_];
        run1[18] = [_,_,d,d,_,_,_,_,_,_,_,d,d,_,_,_,_,_,_,_,_,_,_,_];

        return { idle: idle1, run: [idle1, run1] };
    },

    // ==========================================
    // ESPRESSO MARTINI — Collectible (16x16)
    // ==========================================
    generateMartini() {
        const c = this.colors;
        const _ = '.';

        return [
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,c.glass,c.glass,c.glass,c.glass,c.glass,c.glass,_,_,_,_,_],
            [_,_,_,_,c.glass,c.foam,c.foam,c.foam,c.foam,c.foam,c.foam,c.glass,_,_,_,_],
            [_,_,_,c.glass,c.coffee,c.coffee,c.coffeeLight,c.coffee,c.coffee,c.coffeeLight,c.coffee,c.coffee,c.glass,_,_,_],
            [_,_,_,c.glass,c.coffee,c.coffeeLight,c.coffee,c.coffee,c.coffeeLight,c.coffee,c.coffee,c.coffee,c.glass,_,_,_],
            [_,_,_,_,c.glass,c.coffee,c.coffee,c.coffee,c.coffee,c.coffee,c.coffee,c.glass,_,_,_,_],
            [_,_,_,_,_,c.glass,c.coffee,c.coffee,c.coffee,c.coffee,c.glass,_,_,_,_,_],
            [_,_,_,_,_,_,c.glass,c.coffee,c.coffee,c.glass,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,c.glass,c.glass,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,c.glass,c.glass,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,c.glass,c.glass,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,c.glass,c.glass,_,_,_,_,_,_,_],
            [_,_,_,_,_,c.glass,c.glass,c.glass,c.glass,c.glass,c.glass,_,_,_,_,_],
            [_,_,_,_,c.glass,c.glassShine,c.glassShine,c.glassShine,c.glassShine,c.glassShine,c.glassShine,c.glass,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        ];
    },

    // ==========================================
    // CAPTAIN SEAGULL — Boss (48x48)
    // ==========================================
    generateSeagull() {
        const c = this.colors;
        const _ = '.';

        const body = [
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,_,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,c.hatBlue,c.hatBlue,c.hatGold,c.hatGold,c.hatBlue,c.hatBlue,c.hatBlue,c.hatGold,c.hatGold,c.hatBlue,c.hatBlue,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,c.hatBlue,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.white,c.white,c.seagullEye,c.feather,c.feather,c.feather,c.white,c.white,c.seagullEye,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.white,c.white,c.seagullEye,c.feather,c.feather,c.feather,c.white,c.white,c.seagullEye,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,c.beak,c.beak,c.beak,c.beakDark,c.beakDark,c.beak,c.beak,c.beak,c.beak,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,c.beak,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,c.featherGray,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,c.featherGray,c.featherGray,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,c.featherGray,c.featherGray,c.featherGray,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,c.featherGray,c.featherGray,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,c.featherGray,c.featherGray,c.featherGray,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,c.featherGray,c.featherGray,c.featherGray,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [c.featherGray,c.featherGray,c.featherGray,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,c.featherGray,c.featherGray,_,c.featherGray,c.featherGray,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,c.featherGray,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,c.featherGray,_,_,_,_,c.featherGray,c.featherGray,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,_,_,_,_,_,_,_,c.featherGray,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,c.featherGray,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,c.feather,c.feather,c.feather,c.feather,c.feather,c.feather,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,c.beak,c.beak,c.beak,c.beak,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_,_,c.beak,_,_,c.beak,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        ];

        return { body: body };
    },

    // ==========================================
    // FISH BONE — Boss projectile (12x8)
    // ==========================================
    generateFishBone() {
        const _ = '.';
        const w = '#FFFFFF';
        const g = '#DDDDDD';
        return [
            [_,_,_,_,_,w,w,_,_,_,_,_],
            [_,_,w,_,w,w,w,w,_,w,_,_],
            [_,w,_,w,_,g,g,_,w,_,w,_],
            [w,w,w,w,w,w,w,w,w,w,w,w],
            [_,w,_,w,_,g,g,_,w,_,w,_],
            [_,_,w,_,w,w,w,w,_,w,_,_],
            [_,_,_,_,_,w,w,_,_,_,_,_],
            [_,_,_,_,_,_,_,_,_,_,_,_],
        ];
    },

    // ==========================================
    // CHOCOLATE BOSS — Giant chocolate monster (canvas drawn, 96x96)
    // ==========================================
    generateChocolateBoss() {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');

        // Main body - big chocolate blob
        ctx.fillStyle = '#5C3317';
        ctx.beginPath();
        ctx.ellipse(48, 48, 40, 44, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lighter chocolate layer
        ctx.fillStyle = '#7B4B2A';
        ctx.beginPath();
        ctx.ellipse(48, 44, 34, 36, 0, 0, Math.PI * 2);
        ctx.fill();

        // Chocolate drips from bottom
        ctx.fillStyle = '#5C3317';
        [20, 32, 48, 64, 76].forEach((dx) => {
            const dh = 8 + Math.sin(dx) * 6;
            ctx.beginPath();
            ctx.moveTo(dx - 4, 84);
            ctx.quadraticCurveTo(dx, 84 + dh + 4, dx + 4, 84);
            ctx.fill();
        });

        // Shiny chocolate highlight
        ctx.fillStyle = '#A0673D';
        ctx.beginPath();
        ctx.ellipse(38, 34, 12, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Eyes - big angry white circles
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(34, 38, 10, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(62, 38, 10, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Angry eyebrow ridges
        ctx.fillStyle = '#3E1F0D';
        ctx.save();
        ctx.translate(34, 30);
        ctx.rotate(-0.25);
        ctx.fillRect(-12, -2, 14, 4);
        ctx.restore();
        ctx.save();
        ctx.translate(62, 30);
        ctx.rotate(0.25);
        ctx.fillRect(-2, -2, 14, 4);
        ctx.restore();

        // Pupils - red/orange
        ctx.fillStyle = '#CC0000';
        ctx.beginPath();
        ctx.arc(36, 39, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(60, 39, 5, 0, Math.PI * 2);
        ctx.fill();

        // Inner pupil black
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(37, 39, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(61, 39, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Mouth - wide angry grin
        ctx.fillStyle = '#2C1205';
        ctx.beginPath();
        ctx.ellipse(48, 60, 18, 10, 0, 0, Math.PI);
        ctx.fill();

        // Chocolate teeth
        ctx.fillStyle = '#D2691E';
        for (let i = 0; i < 6; i++) {
            ctx.fillRect(33 + i * 5.5, 60, 3, 5);
        }

        // Arms - chocolate blobs on sides
        ctx.fillStyle = '#5C3317';
        ctx.beginPath();
        ctx.ellipse(10, 52, 12, 8, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(86, 52, 12, 8, 0.5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    },

    // ==========================================
    // CREEPY MAN — Small enemy (canvas drawn, 32x48)
    // ==========================================
    generateCreepyMan() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        // Body (overweight, Hawaiian shirt)
        ctx.fillStyle = '#FF6347'; // loud red Hawaiian shirt
        ctx.beginPath();
        ctx.ellipse(16, 26, 11, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shirt pattern (flowers)
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath(); ctx.arc(12, 24, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(20, 28, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(16, 22, 1.5, 0, Math.PI * 2); ctx.fill();

        // Head (bald, round)
        ctx.fillStyle = '#FFCCAA'; // skin
        ctx.beginPath();
        ctx.arc(16, 10, 8, 0, Math.PI * 2);
        ctx.fill();

        // Bald shine
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(14, 6, 3, 0, Math.PI * 2);
        ctx.fill();

        // Creepy eyes (beady)
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(13, 10, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(19, 10, 1.5, 0, Math.PI * 2); ctx.fill();

        // Raised eyebrows (creepy)
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(11, 7); ctx.lineTo(15, 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(21, 7); ctx.lineTo(17, 8); ctx.stroke();

        // Creepy grin
        ctx.strokeStyle = '#CC3333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(16, 12, 4, 0.1, Math.PI - 0.1);
        ctx.stroke();

        // Stubble dots
        ctx.fillStyle = '#999999';
        for (let sx = 12; sx <= 20; sx += 2) {
            ctx.fillRect(sx, 15, 1, 1);
        }

        // Arms reaching out (creepy)
        ctx.strokeStyle = '#FFCCAA';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(5, 24); ctx.lineTo(0, 20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(27, 24); ctx.lineTo(32, 20); ctx.stroke();

        // Hands
        ctx.fillStyle = '#FFCCAA';
        ctx.beginPath(); ctx.arc(0, 20, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(32, 20, 2, 0, Math.PI * 2); ctx.fill();

        // Shorts
        ctx.fillStyle = '#4444AA';
        ctx.fillRect(8, 36, 16, 5);

        // Legs
        ctx.fillStyle = '#FFCCAA';
        ctx.fillRect(10, 39, 4, 6);
        ctx.fillRect(18, 39, 4, 6);

        // Sandals
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(9, 45, 6, 2);
        ctx.fillRect(17, 45, 6, 2);

        return canvas;
    },

    // ==========================================
    // BOUNCE PAD — Spring platform (canvas drawn, 64x16)
    // ==========================================
    generateBouncePad() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        // Spring coils (zigzag)
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        for (let x = 4; x < 60; x += 8) {
            ctx.beginPath();
            ctx.moveTo(x, 14);
            ctx.lineTo(x + 4, 4);
            ctx.lineTo(x + 8, 14);
            ctx.stroke();
        }

        // Top pad
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(2, 0, 60, 5);
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(2, 0, 60, 2);

        // Arrow indicator
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(28, 4);
        ctx.lineTo(32, 0);
        ctx.lineTo(36, 4);
        ctx.fill();

        return canvas;
    },

    // ==========================================
    // HONEY GUN — Pomeranian in gun form (canvas drawn, 40x24)
    // ==========================================
    generateHoneyGun() {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        // Gun body (Honey's fluffy body shape)
        ctx.fillStyle = '#FF9933';
        ctx.beginPath();
        ctx.ellipse(18, 13, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lighter belly fluff
        ctx.fillStyle = '#FFBB66';
        ctx.beginPath();
        ctx.ellipse(18, 15, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head (front of gun)
        ctx.fillStyle = '#FF9933';
        ctx.beginPath();
        ctx.arc(30, 10, 8, 0, Math.PI * 2);
        ctx.fill();

        // Fluffy cheeks
        ctx.fillStyle = '#FFBB66';
        ctx.beginPath();
        ctx.arc(31, 12, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pointy ears on top
        ctx.fillStyle = '#FF9933';
        ctx.beginPath();
        ctx.moveTo(26, 5); ctx.lineTo(24, 0); ctx.lineTo(28, 3); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(33, 5); ctx.lineTo(35, 0); ctx.lineTo(31, 3); ctx.fill();

        // Inner ears
        ctx.fillStyle = '#FFBB66';
        ctx.beginPath();
        ctx.moveTo(26, 4); ctx.lineTo(25, 1); ctx.lineTo(27, 3); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(33, 4); ctx.lineTo(34, 1); ctx.lineTo(32, 3); ctx.fill();

        // Eyes (determined look)
        ctx.fillStyle = '#221100';
        ctx.beginPath(); ctx.arc(28, 9, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(33, 9, 1.5, 0, Math.PI * 2); ctx.fill();

        // Eye shine
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(28.5, 8.5, 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(33.5, 8.5, 0.5, 0, Math.PI * 2); ctx.fill();

        // Angry/determined eyebrows
        ctx.strokeStyle = '#CC7722';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(26, 7); ctx.lineTo(29, 7.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(36, 7); ctx.lineTo(32, 7.5); ctx.stroke();

        // Nose
        ctx.fillStyle = '#222222';
        ctx.beginPath(); ctx.arc(30.5, 12, 1.5, 0, Math.PI * 2); ctx.fill();

        // Barrel (snout extending into gun barrel)
        ctx.fillStyle = '#888888';
        ctx.fillRect(36, 10, 4, 4);
        ctx.fillStyle = '#666666';
        ctx.fillRect(38, 10, 2, 4);
        ctx.fillStyle = '#333333';
        ctx.beginPath(); ctx.arc(40, 12, 2, 0, Math.PI * 2); ctx.fill();

        // Handle/grip (tail curled as grip)
        ctx.fillStyle = '#CC7722';
        ctx.beginPath();
        ctx.moveTo(10, 14); ctx.lineTo(8, 22); ctx.lineTo(14, 22); ctx.lineTo(12, 14);
        ctx.fill();

        // Tail fluff on grip
        ctx.fillStyle = '#FF9933';
        ctx.beginPath();
        ctx.arc(11, 14, 4, 0, Math.PI * 2);
        ctx.fill();

        // Paw detail on grip
        ctx.fillStyle = '#CC7722';
        ctx.beginPath(); ctx.arc(10, 21, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(13, 21, 2, 0, Math.PI * 2); ctx.fill();

        return canvas;
    },

    // ==========================================
    // BARK BULLET — Honey gun projectile (canvas drawn, 16x16)
    // ================================================================
    generateBarkBullet() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        // Orange energy ball (paw-shaped blast)
        ctx.fillStyle = '#FF9933';
        ctx.beginPath();
        ctx.arc(8, 8, 6, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = '#FFCC66';
        ctx.beginPath();
        ctx.arc(8, 8, 3, 0, Math.PI * 2);
        ctx.fill();

        // Paw pad details
        ctx.fillStyle = '#CC7722';
        ctx.beginPath();
        ctx.arc(6, 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, 9, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    },

    // ==========================================
    // CHOCOLATE BALL — Boss projectile (canvas drawn, 20x20)
    // ==========================================
    generateChocolateBall() {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');

        // Dark chocolate sphere
        ctx.fillStyle = '#5C3317';
        ctx.beginPath();
        ctx.arc(10, 10, 8, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = '#7B4B2A';
        ctx.beginPath();
        ctx.arc(8, 7, 4, 0, Math.PI * 2);
        ctx.fill();

        // Shiny spot
        ctx.fillStyle = '#A0673D';
        ctx.beginPath();
        ctx.arc(7, 6, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    },

    // ==========================================
    // TESLA & OBSTACLES
    // ==========================================
    generateTesla() {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(48, 44, 38, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main body (white Model Y profile)
        ctx.fillStyle = '#F5F5F5';
        ctx.beginPath();
        ctx.moveTo(8, 32);
        ctx.lineTo(10, 18);
        ctx.quadraticCurveTo(16, 9, 30, 7);
        ctx.lineTo(62, 7);
        ctx.quadraticCurveTo(76, 9, 83, 16);
        ctx.lineTo(88, 28);
        ctx.lineTo(88, 35);
        ctx.lineTo(8, 35);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Windows (dark tint)
        ctx.fillStyle = '#334455';
        ctx.beginPath();
        ctx.moveTo(25, 9);
        ctx.lineTo(38, 9);
        ctx.lineTo(38, 20);
        ctx.lineTo(19, 20);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(40, 9, 20, 11);
        ctx.beginPath();
        ctx.moveTo(62, 9);
        ctx.lineTo(74, 13);
        ctx.lineTo(76, 20);
        ctx.lineTo(62, 20);
        ctx.closePath();
        ctx.fill();

        // Window pillars
        ctx.strokeStyle = '#DDDDDD';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(39, 9); ctx.lineTo(39, 20);
        ctx.moveTo(61, 9); ctx.lineTo(61, 20);
        ctx.stroke();

        // Door line
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(48, 20); ctx.lineTo(48, 32);
        ctx.stroke();

        // Wheels
        ctx.fillStyle = '#222222';
        ctx.beginPath(); ctx.arc(26, 36, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 36, 8, 0, Math.PI * 2); ctx.fill();
        // Rims
        ctx.fillStyle = '#888888';
        ctx.beginPath(); ctx.arc(26, 36, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 36, 4, 0, Math.PI * 2); ctx.fill();
        // Hub caps
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(26, 36, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 36, 1.5, 0, Math.PI * 2); ctx.fill();

        // Headlight
        ctx.fillStyle = '#FFEE88';
        ctx.fillRect(86, 22, 3, 5);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(86, 20, 3, 2);
        // Taillight
        ctx.fillStyle = '#FF2222';
        ctx.fillRect(7, 22, 3, 5);

        // Tesla T badge
        ctx.fillStyle = '#CC0000';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('T', 48, 30);

        return canvas;
    },

    generateTrafficCone() {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Cone body
        ctx.fillStyle = '#FF6600';
        ctx.beginPath();
        ctx.moveTo(12, 2);
        ctx.lineTo(20, 26);
        ctx.lineTo(4, 26);
        ctx.closePath();
        ctx.fill();

        // White stripes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(8, 14); ctx.lineTo(16, 14);
        ctx.lineTo(15, 11); ctx.lineTo(9, 11);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(6, 22); ctx.lineTo(18, 22);
        ctx.lineTo(17, 19); ctx.lineTo(7, 19);
        ctx.closePath();
        ctx.fill();

        // Base
        ctx.fillStyle = '#FF5500';
        ctx.fillRect(2, 26, 20, 4);

        return canvas;
    },

    generateObstacleCar() {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 44;
        const ctx = canvas.getContext('2d');

        // Red sedan facing left (oncoming)
        ctx.fillStyle = '#DD3333';
        ctx.beginPath();
        ctx.moveTo(72, 30);
        ctx.lineTo(74, 16);
        ctx.quadraticCurveTo(68, 8, 55, 6);
        ctx.lineTo(30, 6);
        ctx.quadraticCurveTo(18, 8, 12, 16);
        ctx.lineTo(6, 28);
        ctx.lineTo(6, 34);
        ctx.lineTo(76, 34);
        ctx.closePath();
        ctx.fill();

        // Windows
        ctx.fillStyle = '#446688';
        ctx.fillRect(35, 8, 16, 10);
        ctx.fillRect(18, 10, 14, 8);

        // Wheels
        ctx.fillStyle = '#222222';
        ctx.beginPath(); ctx.arc(22, 36, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 36, 7, 0, Math.PI * 2); ctx.fill();
        // Rims
        ctx.fillStyle = '#777777';
        ctx.beginPath(); ctx.arc(22, 36, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 36, 3, 0, Math.PI * 2); ctx.fill();

        // Headlight
        ctx.fillStyle = '#FFEE88';
        ctx.fillRect(5, 22, 3, 4);
        // Taillight
        ctx.fillStyle = '#FF3333';
        ctx.fillRect(74, 22, 3, 4);

        return canvas;
    },

    // ==========================================
    // SHOO SCENE SPRITES
    // ==========================================
    generateBoyfriend() {
        // Tall jacked white guy, green eyes, brown hair — canvas drawn
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 72;
        const ctx = canvas.getContext('2d');

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.beginPath(); ctx.ellipse(24, 70, 14, 3, 0, 0, Math.PI * 2); ctx.fill();

        // Legs (jeans)
        ctx.fillStyle = '#3D5A80';
        ctx.fillRect(14, 50, 8, 18);
        ctx.fillRect(26, 50, 8, 18);
        // Shoes
        ctx.fillStyle = '#333333';
        ctx.fillRect(12, 66, 11, 4);
        ctx.fillRect(25, 66, 11, 4);

        // Torso (tight white t-shirt showing muscles)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.lineTo(10, 50);
        ctx.lineTo(38, 50);
        ctx.lineTo(38, 30);
        ctx.quadraticCurveTo(36, 26, 24, 26);
        ctx.quadraticCurveTo(12, 26, 10, 30);
        ctx.closePath();
        ctx.fill();

        // Pec definition
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(19, 35, 5, 0.3, 2.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(29, 35, 5, 0.3, 2.8); ctx.stroke();
        // Ab line
        ctx.beginPath(); ctx.moveTo(24, 38); ctx.lineTo(24, 48); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 41); ctx.lineTo(28, 41); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 45); ctx.lineTo(28, 45); ctx.stroke();

        // Arms (big, muscular)
        ctx.fillStyle = '#FFE0C2';
        // Left arm
        ctx.fillRect(4, 28, 7, 6);
        ctx.fillRect(2, 28, 9, 5);
        ctx.fillRect(5, 33, 6, 12);
        // Right arm
        ctx.fillRect(37, 28, 7, 6);
        ctx.fillRect(37, 28, 9, 5);
        ctx.fillRect(37, 33, 6, 12);
        // Bicep highlights
        ctx.fillStyle = '#FFD1A3';
        ctx.beginPath(); ctx.arc(7, 32, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(41, 32, 4, 0, Math.PI * 2); ctx.fill();
        // Hands
        ctx.fillStyle = '#FFE0C2';
        ctx.fillRect(5, 44, 5, 4);
        ctx.fillRect(38, 44, 5, 4);

        // Neck
        ctx.fillStyle = '#FFE0C2';
        ctx.fillRect(20, 22, 8, 6);

        // Head
        ctx.fillStyle = '#FFE0C2';
        ctx.beginPath(); ctx.arc(24, 14, 10, 0, Math.PI * 2); ctx.fill();

        // Brown hair
        ctx.fillStyle = '#6B4226';
        ctx.beginPath();
        ctx.arc(24, 12, 10, Math.PI, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(14, 6, 20, 6);
        // Side hair
        ctx.fillStyle = '#5C3317';
        ctx.fillRect(14, 10, 3, 6);
        ctx.fillRect(31, 10, 3, 6);

        // Green eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(18, 12, 5, 4);
        ctx.fillRect(26, 12, 5, 4);
        ctx.fillStyle = '#22AA44';
        ctx.fillRect(20, 13, 3, 3);
        ctx.fillRect(27, 13, 3, 3);
        ctx.fillStyle = '#115522';
        ctx.fillRect(21, 13, 1.5, 2);
        ctx.fillRect(28, 13, 1.5, 2);

        // Smile
        ctx.strokeStyle = '#CC8866';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(24, 18, 4, 0.2, Math.PI - 0.2); ctx.stroke();

        // Jaw definition
        ctx.strokeStyle = '#E8C9A8';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(15, 18); ctx.lineTo(18, 22); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(33, 18); ctx.lineTo(30, 22); ctx.stroke();

        return canvas;
    },

    generateApproachGirl() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 52;
        const ctx = canvas.getContext('2d');

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath(); ctx.ellipse(16, 50, 9, 2, 0, 0, Math.PI * 2); ctx.fill();

        // Legs
        ctx.fillStyle = '#FFE0C2';
        ctx.fillRect(10, 36, 5, 12);
        ctx.fillRect(18, 36, 5, 12);
        // Shoes
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(9, 47, 7, 3);
        ctx.fillRect(17, 47, 7, 3);

        // Dress
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.moveTo(8, 22);
        ctx.lineTo(6, 38);
        ctx.lineTo(26, 38);
        ctx.lineTo(24, 22);
        ctx.closePath();
        ctx.fill();

        // Neck
        ctx.fillStyle = '#FFE0C2';
        ctx.fillRect(14, 16, 4, 5);

        // Head
        ctx.fillStyle = '#FFE0C2';
        ctx.beginPath(); ctx.arc(16, 10, 8, 0, Math.PI * 2); ctx.fill();

        // Blonde hair
        ctx.fillStyle = '#F5D442';
        ctx.beginPath(); ctx.arc(16, 8, 8, Math.PI, 2 * Math.PI); ctx.fill();
        ctx.fillRect(8, 3, 16, 6);
        // Long hair sides
        ctx.fillRect(7, 6, 3, 14);
        ctx.fillRect(22, 6, 3, 14);

        // Eyes
        ctx.fillStyle = '#4488CC';
        ctx.fillRect(12, 9, 3, 2);
        ctx.fillRect(18, 9, 3, 2);

        // Lips
        ctx.fillStyle = '#FF4466';
        ctx.fillRect(14, 14, 5, 1.5);

        // Heart emoji above (they want the boyfriend!)
        ctx.fillStyle = '#FF0000';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('<3', 16, 0);

        return canvas;
    },

    // ==========================================
    // CAPTAIN (muster station scene)
    // ==========================================
    generateCaptain() {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Legs — navy pants
        ctx.fillStyle = '#1A1A44';
        ctx.fillRect(12, 48, 7, 16);
        ctx.fillRect(22, 48, 7, 16);

        // Shoes — black
        ctx.fillStyle = '#111111';
        ctx.fillRect(11, 60, 9, 4);
        ctx.fillRect(21, 60, 9, 4);

        // Body — white captain uniform
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, 22, 21, 28);

        // Uniform details — gold buttons
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(19, 26, 3, 2);
        ctx.fillRect(19, 31, 3, 2);
        ctx.fillRect(19, 36, 3, 2);

        // Epaulettes — gold shoulder boards
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(8, 22, 5, 3);
        ctx.fillRect(28, 22, 5, 3);

        // Arms — white sleeves
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(5, 24, 6, 18);
        ctx.fillRect(30, 24, 6, 18);

        // Hands — skin
        ctx.fillStyle = '#FFDCB5';
        ctx.fillRect(5, 40, 6, 4);
        ctx.fillRect(30, 40, 6, 4);

        // Neck
        ctx.fillStyle = '#FFDCB5';
        ctx.fillRect(16, 18, 9, 5);

        // Head — skin tone
        ctx.fillStyle = '#FFDCB5';
        ctx.fillRect(12, 4, 17, 16);

        // Captain hat — white with black brim and gold badge
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, 1, 21, 6);
        ctx.fillStyle = '#111111';
        ctx.fillRect(8, 6, 25, 3);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(17, 2, 7, 3);
        // Hat badge anchor
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(19, 3, 3, 1);

        // Eyes
        ctx.fillStyle = '#222222';
        ctx.fillRect(15, 10, 3, 3);
        ctx.fillRect(23, 10, 3, 3);
        // Eyebrows — stern
        ctx.fillStyle = '#444444';
        ctx.fillRect(14, 8, 5, 1);
        ctx.fillRect(22, 8, 5, 1);

        // Gray mustache
        ctx.fillStyle = '#888888';
        ctx.fillRect(15, 15, 11, 2);

        // Mouth
        ctx.fillStyle = '#CC4444';
        ctx.fillRect(17, 17, 7, 1);

        // Megaphone in right hand
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(34, 34, 4, 3);
        ctx.fillRect(36, 32, 4, 7);
        ctx.fillStyle = '#FF8833';
        ctx.fillRect(38, 30, 2, 11);

        return canvas;
    },

    // ==========================================
    // PLATFORM TILES
    // ==========================================
    generateDeckTile() {
        const c = this.colors;
        const _ = '.';
        // 16x16 wooden deck tile
        const tile = [];
        for (let y = 0; y < 16; y++) {
            const row = [];
            for (let x = 0; x < 16; x++) {
                if (y === 0) row.push(c.woodLight);
                else if (y === 15) row.push(c.woodDark);
                else if (x % 8 === 0 && y > 1 && y < 14) row.push(c.woodDark);
                else row.push((x + y) % 7 === 0 ? c.woodLight : c.wood);
            }
            tile.push(row);
        }
        return tile;
    },

    generatePoolFloat() {
        const _ = '.';
        const pink = '#FF69B4';
        const pinkD = '#FF1493';
        const white = '#FFFFFF';
        // 32x12 pool float
        const f = [];
        for (let y = 0; y < 12; y++) {
            const row = [];
            for (let x = 0; x < 32; x++) {
                if (y < 2 || y > 9) {
                    if (x > 3 && x < 28) row.push(pink);
                    else row.push(_);
                } else if (y === 2 || y === 9) {
                    if (x > 1 && x < 30) row.push(pinkD);
                    else row.push(_);
                } else {
                    if (x > 0 && x < 31) {
                        if ((x + y) % 6 < 3) row.push(pink);
                        else row.push(white);
                    } else row.push(_);
                }
            }
            f.push(row);
        }
        return f;
    },

    // ==========================================
    // SPARKLE — Collection effect (8x8)
    // ==========================================
    generateSparkle() {
        const _ = '.';
        const y = '#FFD700'; // gold
        const w = '#FFFFFF';
        return [
            [_,_,_,w,w,_,_,_],
            [_,_,w,y,y,w,_,_],
            [_,w,y,y,y,y,w,_],
            [w,y,y,y,y,y,y,w],
            [w,y,y,y,y,y,y,w],
            [_,w,y,y,y,y,w,_],
            [_,_,w,y,y,w,_,_],
            [_,_,_,w,w,_,_,_],
        ];
    },

    // ==========================================
    // REGISTER ALL TEXTURES WITH PHASER
    // ==========================================
    registerAll(scene) {
        const scale = 2;

        // Jennifer spritesheet (4 run frames + 1 idle + 1 jump = 6 frames)
        const jen = this.generateJennifer();
        const jenFrames = [jen.idle, ...jen.run, jen.jump]; // 6 frames: 0=idle, 1-4=run, 5=jump
        const jenSheet = this.createSpriteSheet(32, 28, jenFrames, scale);
        scene.textures.addSpriteSheet('jennifer', jenSheet, { frameWidth: 32 * scale, frameHeight: 28 * scale });

        // Honey spritesheet (2 frames: idle + run)
        const honey = this.generateHoney();
        const honeyFrames = [honey.idle, ...honey.run];
        const honeySheet = this.createSpriteSheet(24, 20, honeyFrames, scale);
        scene.textures.addSpriteSheet('honey', honeySheet, { frameWidth: 24 * scale, frameHeight: 20 * scale });

        // Martini
        const martiniCanvas = this.createSprite(16, 16, this.generateMartini(), scale);
        scene.textures.addCanvas('martini', martiniCanvas);

        // Seagull
        const seagull = this.generateSeagull();
        const seagullCanvas = this.createSprite(48, 28, seagull.body, scale);
        scene.textures.addCanvas('seagull', seagullCanvas);

        // Fish bone
        const fishBoneCanvas = this.createSprite(12, 8, this.generateFishBone(), scale);
        scene.textures.addCanvas('fishbone', fishBoneCanvas);

        // Chocolate boss
        const chocoCanvas = this.generateChocolateBoss();
        scene.textures.addCanvas('chocolate_boss', chocoCanvas);

        // Creepy man enemy
        const creepyManCanvas = this.generateCreepyMan();
        scene.textures.addCanvas('creepy_man', creepyManCanvas);

        // Bounce pad
        const bounceCanvas = this.generateBouncePad();
        scene.textures.addCanvas('bounce_pad', bounceCanvas);

        // Bark bullet
        const barkCanvas = this.generateBarkBullet();
        scene.textures.addCanvas('bark_bullet', barkCanvas);

        // Honey gun
        const honeyGunCanvas = this.generateHoneyGun();
        scene.textures.addCanvas('honey_gun', honeyGunCanvas);

        // Chocolate ball projectile
        const chocoballCanvas = this.generateChocolateBall();
        scene.textures.addCanvas('choco_ball', chocoballCanvas);

        // Tesla Model Y
        const teslaCanvas = this.generateTesla();
        scene.textures.addCanvas('tesla', teslaCanvas);

        // Traffic cone obstacle
        const coneCanvas = this.generateTrafficCone();
        scene.textures.addCanvas('traffic_cone', coneCanvas);

        // Obstacle car
        const obsCarCanvas = this.generateObstacleCar();
        scene.textures.addCanvas('obstacle_car', obsCarCanvas);

        // Boyfriend (jacked guy)
        const bfCanvas = this.generateBoyfriend();
        scene.textures.addCanvas('boyfriend', bfCanvas);

        // Approaching girl
        const girlCanvas = this.generateApproachGirl();
        scene.textures.addCanvas('approach_girl', girlCanvas);

        // Captain
        const captainCanvas = this.generateCaptain();
        scene.textures.addCanvas('captain', captainCanvas);

        // Deck tile
        const deckCanvas = this.createSprite(16, 16, this.generateDeckTile(), scale);
        scene.textures.addCanvas('deck_tile', deckCanvas);

        // Pool float
        const floatCanvas = this.createSprite(32, 12, this.generatePoolFloat(), scale);
        scene.textures.addCanvas('pool_float', floatCanvas);

        // Sparkle
        const sparkleCanvas = this.createSprite(8, 8, this.generateSparkle(), scale);
        scene.textures.addCanvas('sparkle', sparkleCanvas);

        // Generate simple colored rectangles for backgrounds
        this.generateBackgrounds(scene);
    },

    generateBackgrounds(scene) {
        // Ocean gradient tile (for background)
        const oceanCanvas = document.createElement('canvas');
        oceanCanvas.width = 800;
        oceanCanvas.height = 450;
        const octx = oceanCanvas.getContext('2d');
        const grad = octx.createLinearGradient(0, 0, 0, 450);
        grad.addColorStop(0, '#87CEEB');
        grad.addColorStop(0.4, '#5DADE2');
        grad.addColorStop(0.6, '#2E86C1');
        grad.addColorStop(1, '#1B4F72');
        octx.fillStyle = grad;
        octx.fillRect(0, 0, 800, 450);
        scene.textures.addCanvas('bg_ocean', oceanCanvas);

        // Cloud puff
        const cloudCanvas = document.createElement('canvas');
        cloudCanvas.width = 80;
        cloudCanvas.height = 40;
        const cctx = cloudCanvas.getContext('2d');
        cctx.fillStyle = '#FFFFFF';
        cctx.beginPath();
        cctx.ellipse(40, 25, 35, 15, 0, 0, Math.PI * 2);
        cctx.fill();
        cctx.beginPath();
        cctx.ellipse(25, 18, 20, 14, 0, 0, Math.PI * 2);
        cctx.fill();
        cctx.beginPath();
        cctx.ellipse(50, 15, 22, 14, 0, 0, Math.PI * 2);
        cctx.fill();
        cctx.beginPath();
        cctx.ellipse(38, 10, 18, 12, 0, 0, Math.PI * 2);
        cctx.fill();
        scene.textures.addCanvas('cloud', cloudCanvas);

        // Sun
        const sunCanvas = document.createElement('canvas');
        sunCanvas.width = 60;
        sunCanvas.height = 60;
        const sctx = sunCanvas.getContext('2d');
        sctx.fillStyle = '#FFD700';
        sctx.beginPath();
        sctx.arc(30, 30, 25, 0, Math.PI * 2);
        sctx.fill();
        sctx.fillStyle = '#FFF8DC';
        sctx.beginPath();
        sctx.arc(30, 30, 18, 0, Math.PI * 2);
        sctx.fill();
        scene.textures.addCanvas('sun', sunCanvas);

        // Life preserver (decoration)
        const lpCanvas = document.createElement('canvas');
        lpCanvas.width = 24;
        lpCanvas.height = 24;
        const lpctx = lpCanvas.getContext('2d');
        lpctx.fillStyle = '#FF4444';
        lpctx.beginPath();
        lpctx.arc(12, 12, 10, 0, Math.PI * 2);
        lpctx.fill();
        lpctx.fillStyle = '#FFFFFF';
        lpctx.beginPath();
        lpctx.arc(12, 12, 6, 0, Math.PI * 2);
        lpctx.fill();
        lpctx.fillStyle = '#87CEEB';
        lpctx.beginPath();
        lpctx.arc(12, 12, 3, 0, Math.PI * 2);
        lpctx.fill();
        // White stripes
        lpctx.fillStyle = '#FFFFFF';
        lpctx.fillRect(10, 2, 4, 6);
        lpctx.fillRect(10, 16, 4, 6);
        lpctx.fillRect(2, 10, 6, 4);
        lpctx.fillRect(16, 10, 6, 4);
        scene.textures.addCanvas('life_preserver', lpCanvas);

        // Heart particle
        const heartCanvas = document.createElement('canvas');
        heartCanvas.width = 12;
        heartCanvas.height = 12;
        const hctx = heartCanvas.getContext('2d');
        hctx.fillStyle = '#FF69B4';
        hctx.beginPath();
        hctx.moveTo(6, 3);
        hctx.bezierCurveTo(6, 1, 2, 0, 1, 3);
        hctx.bezierCurveTo(0, 6, 6, 10, 6, 11);
        hctx.bezierCurveTo(6, 10, 12, 6, 11, 3);
        hctx.bezierCurveTo(10, 0, 6, 1, 6, 3);
        hctx.fill();
        scene.textures.addCanvas('heart', heartCanvas);

        // Confetti pieces (4 colors)
        const confettiColors = ['#FF6B8A', '#FFD700', '#4169E1', '#32CD32', '#FF69B4', '#FF8C00'];
        confettiColors.forEach((color, i) => {
            const cc = document.createElement('canvas');
            cc.width = 8;
            cc.height = 8;
            const ctx = cc.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(1, 1, 6, 6);
            scene.textures.addCanvas('confetti_' + i, cc);
        });
    }
};
