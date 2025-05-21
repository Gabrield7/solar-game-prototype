import { degToRad, drawPolyLines, polysIntersect } from "../../utils.js";

export class SolarPanel {
    constructor(rx, ry, base, side, angleX, angleY, color = "blue") {
        this.rx = rx;                       // X position of the panel
        this.ry = ry;                       // Y position of the panel
        this.base = base;                   // Horizontal base length
        this.side = side;                   // Inclined side length
        this.angleX = angleX;               // Panel Inclination in horizontal
        this.angleY = angleY;               // Panel Inclination in vertical
        this.color = color;                 // Fill/stroke color
        this.vertices = this.getVertices(); // Precompute corner positions
    }

    draw(ctx, shadowPolygons = []) {       
        const pts = this.vertices//.map(([x, y]) => ({ x, y }));

        // Fill the panel shape
        drawPolyLines(ctx, pts[0], pts.slice(1), {
            fillColor: this.color,
            fill: true
        });
    
        // Stroke the panel edges
        let borderColor = 'black';

        const isShadowBy = shadowPolygons.some(shadow => polysIntersect(pts, shadow));
        if (isShadowBy) borderColor = 'blue';

        drawPolyLines(ctx, pts[0], pts.slice(1), {borderColor});
    }
    
    // Compute the four corners of the tilted panel as a parallelogram
    getVertices() {
        const α = -degToRad(this.angleX);  // base tilt
        const β = -degToRad(this.angleY);  // side tilt

        // base vector in direction α
        const bx = this.base * Math.cos(α);
        const by = this.base * Math.sin(α);

        // side vector in direction β (upwards is negative y)
        const sx = this.side * Math.cos(β);
        const sy = this.side * Math.sin(β);

        const A = { x: this.rx, y: this.ry };           // corner A at (rx, ry)
        const B = { x: this.rx + bx, y: this.ry + by }; // corner B = A + base vector
        const C = { x: B.x + sx, y: B.y + sy };         // corner C = B + side vector
        const D = { x: A.x + sx, y: A.y + sy };         // corner D = A + side vector

        return [ A, B, C, D ];
    }
}

// explicitLine(x0, y0, angleDeg) {
//     // Return y = m x + b (or vertical line)
//     const norm = (360 - angleDeg) % 360;
//     if (norm === 90) return { m: Infinity, b: x0 };

//     const m = Math.tan(degToRad(norm));
//     const b = y0 - m * x0;
//     return { m, b };
// }

// getTangentPoint(cx, cy, radius, angleDeg) {
//     // Point on a circle at given angle
//     const rad = -degToRad(angleDeg);
//     return {
//         x: cx + radius * Math.cos(rad),
//         y: cy + radius * Math.sin(rad)
//     };
// }

// getVertexIntersection(vx, vy, px, py, angleDeg) {
//     // Intersection of support lines from vertex and tangent point
//     const L1 = this.explicitLine(vx, vy, angleDeg);
//     const L2 = this.explicitLine(px, py, angleDeg + 90);

//     if (L1.m === Infinity) {
//         const x = L1.b;
//         return { x, y: L2.m * x + L2.b };
//     }
//     if (L2.m === Infinity) {
//         const x = L2.b;
//         return { x, y: L1.m * x + L1.b };
//     }
//     const x = (L2.b - L1.b) / (L1.m - L2.m);
//     return { x, y: L1.m * x + L1.b };
// }

// drawOuterLines(ctx, cx, cy, radius, angleDeg) {
//     // 1) Compute tangent point on the circle
//     const { x: px, y: py } = this.getTangentPoint(cx, cy, radius, angleDeg);

//     // 2) For each panel corner, find intersection of its perpendicular support
//     const supports = this.vertices.map(([vx, vy]) => {
//         const { x: ix, y: iy } = this.getVertexIntersection(vx, vy, px, py, angleDeg);
//         return { vx, vy, ix, iy };
//     });

//     // 3) Pick the two support lines that are furthest apart
//     let maxDist2 = -Infinity, pair = [supports[0], supports[1]];
//     for (let i = 0; i < supports.length; i++) {
//         for (let j = i + 1; j < supports.length; j++) {
//             const a = supports[i], b = supports[j];
//             const dx = a.ix - b.ix, dy = a.iy - b.iy;
//             const dist2 = dx * dx + dy * dy;
//             if (dist2 > maxDist2) {
//                 maxDist2 = dist2;
//                 pair = [a, b];
//             }
//         }
//     }

//     // 4) Build the “outer” parallelogram support
//     const [L1, L2] = pair;
//     const poly = [
//         { x: L1.vx, y: L1.vy },
//         { x: L1.ix, y: L1.iy },
//         { x: L2.ix, y: L2.iy },
//         { x: L2.vx, y: L2.vy }
//     ];

//     // 5) Fill the shape
//     drawPolyLines(ctx, poly[0], poly.slice(1), {
//         fillColor: 'yellow',
//         fill: true
//     });

//     // 6) Stroke the border
//     drawPolyLines(ctx, poly[0], poly.slice(1), { borderColor: 'yellow' });
// }    