import { drawLine, drawArc, degToRad } from "../utils.js";

export class ObjectShadow {
    constructor(cx, cy, r, h, color = "blue") {
        this.cx = cx;           // circle center X
        this.cy = cy;           // circle center Y
        this.r = r;             // circle radius
        this.h = h;             // object height
        this.color = color;     // shadow/stroke color
    }

    draw(ctx, sx, sy) {
        const { cx, cy, r, h } = this;
        const dx = sx - cx, dy = sy - cy;
        const az   = Math.atan2(dy, dx);
        const elev = Math.atan2(h, Math.hypot(dx, dy));
      
        // lit–shadow divider
        const [P1, P2] = this.edgePoints(az);
        drawLine(ctx, P1, P2);
      
        if (elev > 0) {
            // compute shadow ends
            const dir = az + Math.PI;
            const len = h / Math.tan(elev);
            const ends = [P1, P2].map(p => ({
                x: p.x + len * Math.cos(dir),
                y: p.y + len * Math.sin(dir)
            }));

            ctx.save();
            ctx.globalAlpha = 0.6;

            // fill shadow polygon
            ctx.beginPath();
            ctx.moveTo(P1.x, P1.y);
            ctx.lineTo(ends[0].x, ends[0].y);

            // draw a single path around the semicircle cap
            // compute center and projection angle in degrees:
            const midX = (ends[0].x + ends[1].x) * 0.5;
            const midY = (ends[0].y + ends[1].y) * 0.5;
            const projDeg = (dir * 180 / Math.PI) % 360;

            // line from first end up to the start of the cap
            // then draw the cap as an arc
            ctx.lineTo(
                midX + r * Math.cos((projDeg - 90) * Math.PI/180),
                midY + r * Math.sin((projDeg - 90) * Math.PI/180)
            );
            ctx.arc(
                midX, midY, r,
                degToRad(projDeg - 90),
                degToRad(projDeg + 90)
            );
            // then back down to the second shadow end
            ctx.lineTo(ends[1].x, ends[1].y);

            // and back to P2
            ctx.lineTo(P2.x, P2.y);
            ctx.closePath();

            ctx.fillStyle = "black";
            ctx.fill();

            ctx.restore();
        }
      
        // fill base circle
        drawArc(ctx, cx, cy, r, { fill: true });
    }

    // circle-edge points along the line perpendicular to the sun vector
    edgePoints(azRad) {
        const θ  = azRad - Math.PI / 2; 
        const dx = this.r * Math.cos(θ);
        const dy = this.r * Math.sin(θ);

        return [
            { x: this.cx + dx, y: this.cy + dy },
            { x: this.cx - dx, y: this.cy - dy }
        ];
    }

    // project two shadow lines of length = h/tan(elevation) along direction projRad
    castShadows(ctx, edgePts, projRad, elevRad) {
        const len = this.h / Math.tan(elevRad);

        const shadowEnds = [];

        for (const P of edgePts) {
            const end = { 
                x: P.x + len * Math.cos(projRad), 
                y: P.y + len * Math.sin(projRad)
            };

            drawLine(ctx, P, end);
            shadowEnds.push(end);
        }

        return shadowEnds;
    }
}
