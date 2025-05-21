import { degToRad, drawPolyLines, drawArc } from "../utils.js";

export class SolarTrajectory {
    constructor(tx, ty, angle, color = "orange") {
        this.tx = tx;
        this.ty = ty;
        this.angle = angle;
        this.color = color;
    }

    // draw the full border-crossing line
    draw(ctx, t) {
        const ends = this.getEndpoints(ctx);
        if (ends) drawPolyLines(ctx, ends[0], [ends[1]], { borderColor: this.color });

        this.drawSun(ctx, t)
    }

    // returns the two intersection points with the canvas borders
    getEndpoints(ctx) {
        const { tx, ty, angle } = this;
        const { width: W, height: H } = ctx.canvas;
        const rad = degToRad(-angle);
        const dx = Math.cos(rad), dy = Math.sin(rad);
        const pts = [];

        // left border x=0
        if (dx !== 0) {
            const t = (0 - tx) / dx;
            const y = ty + t * dy;
            if (y >= 0 && y <= H) pts.push({ x: 0, y });
        }
        // right border x=W
        if (dx !== 0) {
            const t = (W - tx) / dx;
            const y = ty + t * dy;
            if (y >= 0 && y <= H) pts.push({ x: W, y });
        }
        // top    border y=0
        if (dy !== 0) {
            const t = (0 - ty) / dy;
            const x = tx + t * dx;
            if (x >= 0 && x <= W) pts.push({ x, y: 0 });
        }
        // bottom border y=H
        if (dy !== 0) {
            const t = (H - ty) / dy;
            const x = tx + t * dx;
            if (x >= 0 && x <= W) pts.push({ x, y: H });
        }

        return pts.length >= 2 ? [pts[0], pts[1]] : null;
    }

    // returns a point at relative position t∈[0,1] along the line
    getPointAt(ctx, t) {
        const ends = this.getEndpoints(ctx);
        if (!ends) return null;
        return {
            x: ends[0].x + (ends[1].x - ends[0].x) * t,
            y: ends[0].y + (ends[1].y - ends[0].y) * t
        };
    }

    // draw a small filled circle (handle) at t∈[0,1] along the line
    drawSun(ctx, t, radius = 10, color = "yellow") {
        const p = this.getPointAt(ctx, t);
        if (!p) return;
        
        drawArc(ctx, p.x, p.y, radius, radius, {
            fillColor: color, 
            borderColor: color, 
            fill: true
        });
    }
}

  
