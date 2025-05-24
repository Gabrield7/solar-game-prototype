import { degToRad, drawPolyLines } from "../utils.js";

export class PanelBase {
    constructor(rx, ry, base, side, angleX, angleY, fillColor) {
        this.rx = rx;                           // X position of the panel
        this.ry = ry;                           // Y position of the panel
        this.base = base;                       // Horizontal base length
        this.side = side;                       // Inclined side length
        this.angleX = angleX;                   // Panel Inclination in horizontal
        this.angleY = angleY;                   // Panel Inclination in vertical
        this.color = fillColor;                 // Fill/stroke color
        this.vertices = this.orderVertices(this.getVertices());     // Precompute corner positions
    }

    // compute the 4 corner points A→B→C→D of the tilted parallelogram
    getVertices() {
        const α = -degToRad(this.angleX);  // base tilt
        const β = -degToRad(this.angleY);  // side tilt

        // base vector in direction α
        const bx = this.base * Math.cos(α);
        const by = this.base * Math.sin(α);

        // side vector in direction β (upwards is negative y)
        const sx = this.side * Math.cos(β);
        const sy = this.side * Math.sin(β);

        const bl = { x: this.rx, y: this.ry };               // bottom-left (A)
        const br = { x: this.rx + bx, y: this.ry + by };     // bottom-right (B)
        const tr = { x: br.x + sx, y: br.y + sy };           // top-right (C)
        const tl = { x: bl.x + sx, y: bl.y + sy };           // top-left (D)

        return { bl, br, tr, tl };
        // const A = { x: this.rx, y: this.ry };           // corner A at (rx, ry)
        // const B = { x: this.rx + bx, y: this.ry + by }; // corner B = A + base vector
        // const C = { x: B.x + sx, y: B.y + sy };         // corner C = B + side vector
        // const D = { x: A.x + sx, y: A.y + sy };         // corner D = A + side vector

        // return [ A, B, C, D ];
    }

    orderVertices(verticesObj) {
        // extrai os 4 pontos
        const pts = Object.values(verticesObj);

        // 1) ordena do "mais embaixo" (maior y) para o "mais acima" (menor y)
        pts.sort((a, b) => b.y - a.y);

        // 2) os 2 primeiros são "bottom", os 2 últimos são "top"
        const bottom = pts.slice(0, 2).sort((a, b) => a.x - b.x);
        const top    = pts.slice(2, 4).sort((a, b) => b.x - a.x);

        // 3) retorna em sentido horário, começando no bottom-left
        return {
            bl: bottom[0],
            br: bottom[1],
            tr: top[0],
            tl: top[1]
        };
    }

    // draw a filled parallelogram in its fillColor, with optional strokeColor
    drawShape(ctx, fillColor, strokeColor = "black") {
        //const poly = this.vertices;
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