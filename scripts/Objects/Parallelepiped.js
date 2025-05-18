import { degToRad, drawPolyLines } from "../utils.js";

export class Parallelepiped {
    constructor(cx, cy, rx, ry, angleZ, pf, height, color = "blue") {
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.angleZRad = degToRad(angleZ);
        this.pf = Math.max(0, Math.min(1, pf));
        this.h = height
        this.color = color;
    }

    getAllVertices() {
        const hw = this.rx/2, hh = this.ry/2;
        const cosZ = Math.cos(this.angleZRad), sinZ = Math.sin(this.angleZRad);

        const angleXRad = (1 - this.pf) * Math.PI/2;
        const cosX = Math.cos(angleXRad), sinX = Math.sin(angleXRad);

        // base rectangle in local 3D coords
        const corners = [
            { x: +hw, y: +hh, z: 0 },
            { x: -hw, y: +hh, z: 0 },
            { x: -hw, y: -hh, z: 0 },
            { x: +hw, y: -hh, z: 0 }
        ];

        return corners.map(({ x, y, z }) => {
            // rotate around Z (in-plane)
            const x1 =  x * cosZ - y * sinZ;
            const y1 =  x * sinZ + y * cosZ;
            const z1 =  z;

            // rotate around X (lift toward viewer)
            const x2 = x1;
            const y2 = y1 * cosX - z1 * sinX;
            // z2 = y1*sinX + z1*cosX; // discarded

            return {
                x: this.cx + x2,
                y: this.cy + y2
            };
        });
    }

    getShadowVertices(sx, sy) {
        const vertices = this.getAllVertices();
        const center = vertices.reduce((acc, v) => ({
            x: acc.x + v.x / 4,
            y: acc.y + v.y / 4
        }), { x: 0, y: 0 });
    
        const lx = center.x - sx;
        const ly = center.y - sy;
        const lmag = Math.hypot(lx, ly) || 1;
        const lightDir = { x: lx / lmag, y: ly / lmag };
    
        const shadowIndices = new Set();
    
        for (let i = 0; i < vertices.length; i++) {
            const curr = vertices[i];
            const next = vertices[(i + 1) % vertices.length];
    
            const edge = { x: next.x - curr.x, y: next.y - curr.y };
            const normal = { x: -edge.y, y: edge.x };
    
            const dot = normal.x * lightDir.x + normal.y * lightDir.y;
    
            // Se a normal está contra a luz, essa aresta deve projetar sombra
            if (dot < 0) {
                shadowIndices.add(i);
                shadowIndices.add((i + 1) % vertices.length);
            }
        }
    
        return [...shadowIndices].map(i => vertices[i]);
    }

    shadowEnds(points, az, elev, h) {
        const dir = az + Math.PI;
        const len = h / Math.tan(elev);
    
        return points.map(p => ({
            x: p.x + len * Math.cos(dir),
            y: p.y + len * Math.sin(dir)
        }));
    }

    drawShadow(ctx, sx, sy) {
        //const vertices = this.getShadowVertices(sx, sy);
        const vertices = this.getShadowVertices(sx, sy, 1);
        if (!vertices.length) return;
    
        const dx = sx - this.cx; 
        const dy = sy - this.cy;
        const az = Math.atan2(dy, dx);
        const elev = Math.atan2(this.h, Math.hypot(dx, dy));
    
        const ends = this.shadowEnds(vertices, az, elev, this.h);
    
        const shadowPolygon = [...vertices, ...ends.slice().reverse()];
    
        drawPolyLines(ctx, shadowPolygon[0], shadowPolygon.slice(1), {
            fillColor: "black",
            fill: true,
            opacity: 0.6
        });
    }

    drawBody(ctx) {
        const base = this.getAllVertices();
        const top = base.map(p => ({ x: p.x, y: p.y - this.h }));
    
        // Front-left face
        drawPolyLines(ctx, base[0], [ base[1], top[1], top[0] ], { fill: true });
    
        // Front-right face
        drawPolyLines(ctx, base[0], [ base[3], top[3], top[0] ], { fill: true });
        
        // Vertical edges
        [0, 1, 3].forEach(i => {
            drawPolyLines(ctx, base[i], [ top[i] ]);
        });
        
        // Top face
        drawPolyLines(ctx, top[0], top.slice(1), { fill: true });
    }

    draw(ctx, sx, sy) {
        this.drawShadow(ctx, sx, sy);

        this.drawBody(ctx)
    }
}

