import { degToRad, drawPolyLines } from "../utils.js";

export class PanelBase {
    constructor(rx, ry, base, side, angleX, angleY) {
        this.rx = rx;                           // X position of the panel
        this.ry = ry;                           // Y position of the panel
        this.base = base;                       // Horizontal base length
        this.side = side;                       // Inclined side length
        this.angleX = angleX;                   // Panel Inclination in horizontal
        this.angleY = angleY;                   // Panel Inclination in vertical
        //this.color = color;                 // Fill/stroke color
        this.vertices = this.getVertices(rx, ry, base, side)
    }

    // compute the 4 corner points A→B→C→D of the tilted parallelogram
    getVertices(rx, ry, base, side) {
        const α = -degToRad(this.angleX);  // base tilt
        const β = -degToRad(this.angleY);  // side tilt

        // base vector in direction α
        const bx = base * Math.cos(α);
        const by = base * Math.sin(α);

        // side vector in direction β (upwards is negative y)
        const sx = side * Math.cos(β);
        const sy = side * Math.sin(β);

        const bl = { x: rx, y: ry };               // bottom-left (A)
        const br = { x: rx + bx, y: ry + by };     // bottom-right (B)
        const tr = { x: br.x + sx, y: br.y + sy };           // top-right (C)
        const tl = { x: bl.x + sx, y: bl.y + sy };           // top-left (D)

        return { bl, br, tr, tl };
    }

    // draw a filled parallelogram in its fillColor, with optional strokeColor
    drawShape(ctx, fillColor, strokeColor = "black") {
        const poly = [...Object.values(this.vertices)];

        drawPolyLines(ctx, poly[0], poly.slice(1), {
            fill: true,
            fillColor: fillColor
        });

        drawPolyLines(ctx, poly[0], poly.slice(1), {
            borderColor: strokeColor
        });
    }

    // quick point‐in‐polygon for click / hover tests
    containsPoint(pt) {
        // ray‐casting algorithm
        let inside = false;
        //const poly = this.vertices;
        const poly = [...Object.values(this.vertices)]

        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i].x, yi = poly[i].y;
            const xj = poly[j].x, yj = poly[j].y;
            const intersect =
                (yi > pt.y) !== (yj > pt.y) &&
                pt.x < ((xj - xi)*(pt.y - yi))/(yj - yi) + xi;
            if (intersect) inside = !inside;
        }
        return inside;
    }
}