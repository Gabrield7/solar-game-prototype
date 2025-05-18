import { degToRad, drawPolyLines } from "../../utils.js";
import { ObjectShadow } from './ObjectShadow.js';

export class Parallelepiped extends ObjectShadow {
    constructor(cx, cy, rx, ry, angleZ, pf, height, color) {
        super(cx, cy, height, color);
        this.rx = rx;
        this.ry = ry;
        this.angleZRad = degToRad(angleZ);
        this.pf = Math.max(0, Math.min(1, pf));
    }

    getAllVertices() {
        // Half-width and half-height of the rectangle
        const hw = this.rx / 2, hh = this.ry / 2;

        // Precompute cosine and sine for Z-axis rotation
        const cosZ = Math.cos(this.angleZRad), sinZ = Math.sin(this.angleZRad);

        // Compute the X-axis rotation angle based on the perspective factor (pf)
        // When pf = 1, angleX = 0 (no tilt); when pf = 0, angleX = 90° (max tilt)
        const angleX = (1 - this.pf) * Math.PI / 2;
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);

        // Define the four corners of the rectangle in local 3D space (z = 0)
        const corners = [
            { x: +hw, y: +hh, z: 0 },
            { x: -hw, y: +hh, z: 0 },
            { x: -hw, y: -hh, z: 0 },
            { x: +hw, y: -hh, z: 0 }
        ];
        
        return corners.map(({ x, y, z }) => {
            // Apply rotation around Z-axis (2D rotation in XY plane)
            const x1 = x * cosZ - y * sinZ;
            const y1 = x * sinZ + y * cosZ;

            // Apply simplified perspective tilt by compressing Y based on angleX
            const y2 = y1 * cosX;

            // Translate the point to the final position relative to (cx, cy)
            return { x: this.cx + x1, y: this.cy + y2 };
        });
    }

    getShadowVertices(sx, sy) {
        // Get the four 2D projected vertices of the parallelepiped base
        const vertices = this.getAllVertices();
        const center = vertices.reduce((acc, v) => ({ x: acc.x + v.x / 4, y: acc.y + v.y / 4 }), { x: 0, y: 0 });
        // Compute the vector from the light source to the shape center
        const lx = center.x - sx, ly = center.y - sy;
        const mag = Math.hypot(lx, ly) || 1;
        const lightDir = { x: lx / mag, y: ly / mag };
        const shadowIdx = new Set();
        // Loop through each edge of the polygon
        vertices.forEach((curr, i) => {
            const next = vertices[(i + 1) % 4];
            const edge = { x: next.x - curr.x, y: next.y - curr.y };
            const normal = { x: -edge.y, y: edge.x };

            if ((normal.x * lightDir.x + normal.y * lightDir.y) < 0) {
                shadowIdx.add(i); shadowIdx.add((i + 1) % 4);
            }
        });
        // Return the shadow-casting vertices as an array of points
        return [...shadowIdx].map(i => vertices[i]);
    }

    drawShadow(ctx, sx, sy) {
        // Compute azimuth and elevation of the light source based on its position (sx, sy)
        const { az, elev } = this.computeLightParams(sx, sy);
        if (elev <= 0) return;
    
        // Get the vertices of the shape that will cast the shadow
        const pts = this.getShadowVertices(sx, sy);
        if (!pts.length) return;
    
        // Compute the end points of the shadow based on light direction and elevation
        const ends = this.shadowEnds(pts, az, elev);
    
        // Create a closed polygon path by connecting the shape's edge and its shadow projection
        const poly = [...pts, ...ends.slice().reverse()];
    
        // Draw the polygon with semi-transparent black fill
        drawPolyLines(ctx, poly[0], poly.slice(1), {
            fill: true,
            fillColor: "black",
            opacity: 0.6
        });
    }
    
    drawBody(ctx) {
        // Get the 2D base vertices of the shape (a rotated rectangle)
        const base = this.getAllVertices();
        // Create the top face by shifting each base vertex upwards by height `h`
        const top  = base.map(p => ({ x: p.x, y: p.y - this.h }));
    
        // Draw the front face (between base[0], base[1] and their corresponding top points)
        drawPolyLines(ctx, base[0], [ base[1], top[1], top[0] ], { fill: true, fillColor: this.color });
    
        // Draw the side face (between base[0], base[3] and their corresponding top points)
        drawPolyLines(ctx, base[0], [ base[3], top[3], top[0] ], { fill: true, fillColor: this.color });
    
        // Draw vertical edges to connect base to top at three corners (indices 0, 1, and 3)
        [0, 1, 3].forEach(i => drawPolyLines(ctx, base[i], [ top[i] ]));
    
        // Draw the top face (connecting all top vertices)
        drawPolyLines(ctx, top[0], top.slice(1), { fill: true, fillColor: this.color });
    }
    
    draw(ctx, sx, sy) {
        this.drawShadow(ctx, sx, sy);
        this.drawBody(ctx);
    }
}

