import { degToRad, drawLine } from "../utils.js";

export class SolarPanel {
    constructor(rx, ry, base, side, angle, color = "blue") {
        this.rx = rx;               // X position of the panel
        this.ry = ry;               // Y position of the panel
        this.base = base;           // Horizontal base length
        this.side = side;           // Inclined side length
        this.angle = angle;         // Inclination angle in degrees
        this.color = color;         // Fill/stroke color
        this.vertices = this.getVertices(); // Precompute corner positions
    }

    draw(ctx) {
        // Fill the panel shape
        ctx.beginPath();
        ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i][0], this.vertices[i][1]);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // Stroke the panel edges using our drawLine util
        for (let i = 0; i < this.vertices.length; i++) {
            const p1 = { x: this.vertices[i][0], y: this.vertices[i][1] };
            const next = this.vertices[(i + 1) % this.vertices.length];
            const p2 = { x: next[0], y: next[1] };
            drawLine(ctx, p1, p2, this.color, 1);
        }
    }

    // Compute the four corners of the tilted panel as a parallelogram
    getVertices() {
        const rad = degToRad(this.angle);

        // Base vector (horizontal)
        const vx = this.base, vy = 0;
        // Side vector (inclined upward by angle)
        const sx = this.side * Math.cos(rad);
        const sy = -this.side * Math.sin(rad);

        // Define corners clockwise: A, B, C, D
        const A = [this.rx, this.ry];
        const B = [this.rx + vx, this.ry + vy];
        const C = [B[0] + sx, B[1] + sy];
        const D = [A[0] + sx, A[1] + sy];

        return [A, B, C, D];
    }

    explicitLine(x0, y0, angleDeg) {
        // Return y = m x + b (or vertical line)
        const norm = (360 - angleDeg) % 360;
        if (norm === 90) return { m: Infinity, b: x0 };

        const m = Math.tan(degToRad(norm));
        const b = y0 - m * x0;
        return { m, b };
    }

    getTangentPoint(cx, cy, radius, angleDeg) {
        // Point on a circle at given angle
        const rad = -degToRad(angleDeg);
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad)
        };
    }

    getVertexIntersection(vx, vy, px, py, angleDeg) {
        // Intersection of support lines from vertex and tangent point
        const L1 = this.explicitLine(vx, vy, angleDeg);
        const L2 = this.explicitLine(px, py, angleDeg + 90);

        if (L1.m === Infinity) {
            const x = L1.b;
            return { x, y: L2.m * x + L2.b };
        }
        if (L2.m === Infinity) {
            const x = L2.b;
            return { x, y: L1.m * x + L1.b };
        }
        const x = (L2.b - L1.b) / (L1.m - L2.m);
        return { x, y: L1.m * x + L1.b };
    }

    drawOuterLines(ctx, cx, cy, radius, angleDeg) {
        // 1) Compute tangent point on the circle
        const { x: px, y: py } = this.getTangentPoint(cx, cy, radius, angleDeg);

        // 2) For each panel corner, find intersection of its perpendicular support
        const supports = this.vertices.map(([vx, vy]) => {
            const { x: ix, y: iy } = this.getVertexIntersection(vx, vy, px, py, angleDeg);
            return { vx, vy, ix, iy };
        });

        // 3) Pick the two support lines that are furthest apart
        let maxDist2 = -Infinity, pair = [supports[0], supports[1]];
        for (let i = 0; i < supports.length; i++) {
            for (let j = i + 1; j < supports.length; j++) {
                const a = supports[i], b = supports[j];
                const dx = a.ix - b.ix, dy = a.iy - b.iy;
                const dist2 = dx*dx + dy*dy;
                if (dist2 > maxDist2) {
                    maxDist2 = dist2;
                    pair = [a, b];
                }
            }
        }

        // 4) Build and fill the “outer” parallelogram support
        const [L1, L2] = pair;
        const poly = [
            [L1.vx, L1.vy],
            [L1.ix, L1.iy],
            [L2.ix, L2.iy],
            [L2.vx, L2.vy],
        ];
        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 1; i < poly.length; i++) {
            ctx.lineTo(poly[i][0], poly[i][1]);
        }
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();

        // 5) Stroke the border of the support shape using drawLine
        for (let i = 0; i < poly.length; i++) {
            const p1 = { x: poly[i][0], y: poly[i][1] };
            const next = poly[(i + 1) % poly.length];
            const p2 = { x: next[0], y: next[1] };
            drawLine(ctx, p1, p2, 'yellow', 1);
        }
    }
}
