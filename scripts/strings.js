import { SolarPanel } from "./Objects/Panel.js";

export class StringPV {
    constructor(sx, sy, numberOfPanel, space, base, side, angle, color = "blue") {
        this.sx = sx;  // Starting X position
        this.sy = sy;  // Starting Y position
        this.numberOfPanel = numberOfPanel;  // Quantity of panels
        this.space = space;  // Horizontal spacing between panels
        this.base = base;  // Base length of each panel
        this.side = side;  // Inclined length of each panel
        this.angle = angle;  // Inclination angle of panels
        this.color = color;

        this.panels = this.createPanels();
    }

    createPanels() {
        const panels = [];
        for (let i = 0; i < this.numberOfPanel; i++) {
            const offsetX = i * (this.base + this.space);
            const px = this.sx + offsetX;
            const py = this.sy;

            const panel = new SolarPanel(px, py, this.base, this.side, this.angle);
            panels.push(panel);
        }
        return panels;
    }

    draw(ctx, cx, cy, radius, angle) {
        this.panels.forEach(panel => {
            panel.drawOuterLines(ctx, cx, cy, radius, angle);
        });

        this.panels.forEach(panel => {
            panel.draw(ctx);//, cx, cy, radius, angle);
        });
        
    }
}
