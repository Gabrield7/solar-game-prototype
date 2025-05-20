import { ObjectShadow } from './ObjectShadow.js';

export class Cylinder extends ObjectShadow {
    constructor(cx, cy, rx, pf, height, color) {
        super(cx, cy, height, color);
        this.rx = rx;
        this.pf = Math.max(0, Math.min(1, pf));
    }

    edgePoints(az) {
        const ry = this.rx * this.pf;
        const perp = az - Math.PI/2;
        
        // Return two points on the ellipse edge perpendicular to the light direction
        return [
            { x: this.cx + this.rx * Math.cos(perp), y: this.cy + ry * Math.sin(perp) },
            { x: this.cx - this.rx * Math.cos(perp), y: this.cy - ry * Math.sin(perp) }
        ];
    }

    computeShadowPolygon(sx, sy) {
        const { az, elev } = this.computeLightParams(sx, sy);
        if (elev <= 0) return null;

        const pts = this.edgePoints(az);
        const ends = this.shadowEnds(pts, az, elev);

        const mx = (ends[0].x + ends[1].x) * 0.5;
        const my = (ends[0].y + ends[1].y) * 0.5;

        const start = az + Math.PI - Math.PI / 2;
        const end = az + Math.PI + Math.PI / 2;

        const segments = 16;
        const arcPts = [];
        for (let i = 0; i <= segments; i++) {
            const theta = start + (end - start) * (i / segments);
            arcPts.push({
                x: mx + this.rx * Math.cos(theta),
                y: my + (this.rx * this.pf) * Math.sin(theta)
            });
        }

        return [
            { x: pts[0].x, y: pts[0].y },
            { x: ends[0].x, y: ends[0].y },
            ...arcPts,
            { x: ends[1].x, y: ends[1].y },
            { x: pts[1].x, y: pts[1].y }
        ];
    }

    renderShadow(ctx, poly) {
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.beginPath();

        ctx.moveTo(poly[0].x, poly[0].y);
        for (let i = 1; i < poly.length; i++) {
            ctx.lineTo(poly[i].x, poly[i].y);
        }

        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.restore();
    }

    drawShadow(ctx, sx, sy) {
        const poly = this.computeShadowPolygon(sx, sy);
        if (!poly) return;

        this.renderShadow(ctx, poly);
        return poly;
    }

    drawBody(ctx) {
        const ry = this.rx * this.pf;
    
        ctx.save();
        ctx.fillStyle = this.color;         // Fill color of the object
        ctx.strokeStyle = "black";          // Outline color
        ctx.lineWidth = 2;                  // Outline thickness
    
        // --- Draw the cylindrical side body ---
        ctx.beginPath();
        ctx.ellipse(this.cx, this.cy, this.rx, ry, 0, 0, Math.PI);
        ctx.lineTo(this.cx - this.rx, this.cy - this.h);
        ctx.ellipse(this.cx, this.cy - this.h, this.rx, ry, 0, Math.PI, 0, true);
        ctx.lineTo(this.cx + this.rx, this.cy);
    
        ctx.closePath();
        ctx.fill();   // Fill the side body
        ctx.stroke(); // Outline the side body
    
        // --- Draw the top cover (full ellipse) ---
        ctx.beginPath();
        ctx.ellipse(this.cx, this.cy - this.h, this.rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();   // Fill the top cover
        ctx.stroke(); // Outline the top cover
    
        ctx.restore();
    }
    
    draw(ctx, sx, sy) {
        this.drawShadow(ctx, sx, sy);
        this.drawBody(ctx);
    }
}

