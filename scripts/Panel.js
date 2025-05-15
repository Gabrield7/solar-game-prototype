export class SolarPanel {
    constructor(rx, ry, base, side, angle, color = "blue") {
        this.rx = rx;               // X position of the panel
        this.ry = ry;               // Y position of the panel
        this.base = base;           // Horizontal base length
        this.side = side;           // Inclined side length
        this.angle = angle;         // Inclination angle in degrees
        this.color = color;         
        this.vertices = [];         // Stores the parallelogram vertices
    }

    draw(ctx) {
        const rad = this.angle * Math.PI / 180;

        // Horizontal base vector
        const vx = this.base;
        const vy = 0;

        // Inclined side vector (based on the angle)
        const hx = this.side * Math.cos(rad);
        const hy = -this.side * Math.sin(rad); // upward inclination

        // Define the four vertices of the parallelogram (clockwise)
        const A = [this.rx, this.ry];                       // Top-left
        const B = [this.rx + vx, this.ry + vy];             // Top-right
        const C = [B[0] + hx, B[1] + hy];                   // Bottom-right
        const D = [A[0] + hx, A[1] + hy];                   // Bottom-left

        // Store vertices
        this.vertices = [A, B, C, D];

        // Draw the parallelogram
        ctx.beginPath();
        ctx.moveTo(...A);
        ctx.lineTo(...B);
        ctx.lineTo(...C);
        ctx.lineTo(...D);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    toRadians(deg) {
        return deg * Math.PI / 180;
    }
    
    explicitLine(x0, y0, angleDeg) {
        if (angleDeg % 180 === 90) {
            return { m: Infinity, b: x0 };
        }
        const rad = this.toRadians((360 - angleDeg) % 360);
        const m = Math.tan(rad);
        const b = y0 - m * x0;
        return { m, b };
    }
    
    getTangentPoint(cx, cy, radius, angleDeg) {
        const rad = -this.toRadians(angleDeg);
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad)
        };
    }
    
    getVertexIntersection(vx, vy, px, py, angleDeg) {
        const line1 = this.explicitLine(vx, vy, angleDeg);
        const line2 = this.explicitLine(px, py, angleDeg + 90);
    
        if (line1.m === Infinity) {
            const x = line1.b;
            return { x, y: line2.m * x + line2.b };
        }
        if (line2.m === Infinity) {
            const x = line2.b;
            return { x, y: line1.m * x + line1.b };
        }
        const x = (line2.b - line1.b) / (line1.m - line2.m);
        return { x, y: line1.m * x + line1.b };
    }

    drawOuterLines(ctx, cx, cy, radius, angleDeg) {
        // 1) compute tangent point on circle
        const { x: px, y: py } = this.getTangentPoint(cx, cy, radius, angleDeg);
        // 2) build list of { vx, vy, ix, iy }
        const lines = this.vertices.map(([vx, vy]) => {
            const { x: ix, y: iy } = this.getVertexIntersection(vx, vy, px, py, angleDeg);
            return { vx, vy, ix, iy };
        });
    
        // 3) brute-force all pairs to find max-distance pair
        let maxDist2 = -Infinity;
        let pair = [lines[0], lines[1]];
    
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                const a = lines[i], b = lines[j];
                const dx = a.ix - b.ix, dy = a.iy - b.iy;
                const dist2 = dx*dx + dy*dy;
                if (dist2 > maxDist2) {
                maxDist2 = dist2;
                pair = [a, b];
                }
            }
        }
    
        // 4) draw the two farthest lines
        pair.forEach(({ vx, vy, ix, iy }) => {
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(ix, iy);
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
    
}