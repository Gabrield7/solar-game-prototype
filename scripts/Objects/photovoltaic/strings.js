import { pad } from "../../utils.js";

export class StringPV {
    static colors = [
        "hsla(170, 100%, 50%, 0.6)",
        "hsla(185, 100%, 50%, 0.6)",
        "hsla(200, 100%, 50%, 0.6)",
        "hsla(215, 100%, 50%, 0.6)",
        "hsla(230, 100%, 50%, 0.6)",
        "hsla(245, 100%, 50%, 0.6)",
        "hsla(260, 100%, 50%, 0.6)",
        "hsla(275, 100%, 50%, 0.6)",
        "hsla(290, 100%, 50%, 0.6)",
        "hsla(305, 100%, 50%, 0.6)"
    ];
    // Static counter to cycle through blues array
    static colorIndex = 0;
    static nextIndex = 1;

    constructor(space) {
        this.space = space;
        this.code = `STR${pad(StringPV.nextIndex++)}`;
        this.color = this.getRandomColor();
        this.panels = [];
    }

    // Draws each panel with the stored color
    draw(ctx, shadowPolygons = []) {
        this.panels.forEach(p => p.draw(ctx, shadowPolygons, this.color));
    }

    getRandomColor() {
        const idx = StringPV.colorIndex % StringPV.colors.length;
        const color = StringPV.colors[idx];
        StringPV.colorIndex++;
        return color;
    }
}

