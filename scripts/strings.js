import { SolarPanel } from "./Objects/Panel.js";
import { drawPolyLines } from "./utils.js";

export class StringPV {
    constructor(sx, sy, numberOfPanel, space, base, side, angle, color = "blue") {
        this.sx = sx;                       // Starting X position
        this.sy = sy;                       // Starting Y position
        this.count = numberOfPanel;         // Quantity of panels
        this.space = space;                 // Horizontal spacing between panels
        this.base = base;                   // Base length of each panel
        this.side = side;                   // Inclined length of each panel
        this.angle = angle;                 // Inclination angle of panels
        this.color = color;

        this.panels = this.createPanels();
        this.boundary = this.computeBoundary();
    }

    createPanels() {
        const panels = [];

        for (let i = 0; i < this.count; i++) {
            const offsetX = i * (this.base + this.space);
            const px = this.sx + offsetX;
            const py = this.sy;

            const panel = new SolarPanel(px, py, this.base, this.side, this.angle);
            panels.push(panel);
        }

        return panels;
    }

    // Compute the 4 corners of the bounding parallelogram, offset by gap and tilt
    computeBoundary() {
        const firstCorners = this.panels[0].getVertices();
        const lastCorners  = this.panels[this.count - 1].getVertices();

        // Map to named corners
        const A = { x: firstCorners[0][0], y: firstCorners[0][1] }; // bottom-left of first panel
        const D = { x: firstCorners[3][0], y: firstCorners[3][1] }; // top-left of first panel
        const B = { x: lastCorners[1][0],  y: lastCorners[1][1]  }; // bottom-right of last panel
        const C = { x: lastCorners[2][0],  y: lastCorners[2][1]  }; // top-right of last panel

        // Edge vector AD and its unit normal
        const sideVec = { x: D.x - A.x, y: D.y - A.y };
        const len = Math.hypot(sideVec.x, sideVec.y) || 1;
        const normal = { x: -sideVec.y / len, y: sideVec.x / len };

        // Offset outward by gap and compensate tilt
        const border = this.space / 2
        const offsetX = normal.x * border * (1 - Math.cos(this.angle));
        const offsetY = normal.y * border * (1 - Math.sin(this.angle));

        // Construct parallelogram corners in BL, BR, TR, TL order
        const bl = { x: A.x - offsetX, y: A.y + offsetY };
        const br = { x: B.x + normal.x * border, y: B.y + offsetY };
        const tr = { x: C.x + offsetX, y: C.y - offsetY };
        const tl = { x: D.x - normal.x * border, y: D.y - offsetY };

        return [bl, br, tr, tl];
    }

    // Draw bounding box and each panel (with shadow highlighting)
    draw(ctx, shadowPolygons = []) {
        drawPolyLines(ctx, this.boundary[0], this.boundary.slice(1), {
            fill: true,
            fillColor: 'rgba(0,0,255,0.2)',
            borderColor: this.color,
            borderWidth: 2
        });

        this.panels.forEach(panel => panel.draw(ctx, shadowPolygons));
    }
}

