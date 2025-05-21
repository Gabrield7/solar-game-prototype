import { SolarPanel } from "./Panel.js";
import { degToRad, drawPolyLines } from "../../utils.js";

export class StringPV {
    constructor(sx, sy, numberOfPanel, space, base, side, angleX, angleY, color = "blue") {
        this.sx = sx;                       // Starting X position
        this.sy = sy;                       // Starting Y position
        this.count = numberOfPanel;         // Quantity of panels
        this.space = space;                 // Horizontal spacing between panels
        this.base = base;                   // Base length of each panel
        this.side = side;                   // Inclined length of each panel
        this.angleX = angleX;     // Panel Inclination in horizontal
        this.angleY = angleY;     // Panel Inclination in vertical
        this.color = color;

        this.panels = this.createPanels();
        this.boundary = this.computeBoundary();
    }

    createPanels() {
        const angXRad = -degToRad(this.angleX);
        const angYRad = -degToRad(this.angleX);
        const panels = [];

        for (let i = 0; i < this.count; i++) {
            const offsetX = i * (this.base + this.space) * Math.cos(angXRad);
            const offsetY = i * (this.base + this.space) * Math.sin(angYRad);
            
            const px = this.sx + offsetX;
            const py = this.sy + offsetY;

            const panel = new SolarPanel(px, py, this.base, this.side, this.angleX, this.angleY);
            panels.push(panel);
        }

        return panels;
    }

    // Compute the 4 corners of the bounding parallelogram, offset by gap and tilt
    computeBoundary() {
        // α: direction of the string axis; β: tilt angle of each panel's side
        const α = -degToRad(this.angleX);
        const β = -degToRad(this.angleY);
        const gap = this.space / 2;

        // Helper to compute offset along string normal and panel tilt
        const offset = (signA, signB) => {
            const dx = gap * (signA * Math.cos(α) + signB * Math.cos(β));
            const dy = gap * (signA * Math.sin(α) + signB * Math.sin(β));
            return { x: dx, y: dy };
        };

        // Retrieve base points A (first panel) and B (last panel)
        const A = this.panels[0].getVertices()[0];            // bottom-left of first panel
        const B = this.panels[this.count - 1].getVertices()[1]; // bottom-right of last panel

        // Projection of panel's side onto axes
        const sideOffset = {
            x: this.side * Math.cos(β),
            y: this.side * Math.sin(β)
        };

        // Calculate the four corners of the boundary parallelogram:
        // bottom-left, bottom-right, top-right, top-left
        const bl = {
            x: A.x + offset(-1, -1).x,
            y: A.y + offset(-1, -1).y
        };
        const br = {
            x: B.x + offset(1, -1).x,
            y: B.y + offset(1, -1).y
        };
        const tr = {
            x: B.x + sideOffset.x + offset(1, 1).x,
            y: B.y + sideOffset.y + offset(1, 1).y
        };
        const tl = {
            x: A.x + sideOffset.x + offset(-1, 1).x,
            y: A.y + sideOffset.y + offset(-1, 1).y
        };

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

