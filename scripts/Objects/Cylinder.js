import { drawPolyLines } from "../utils.js";

export class Cylinder {
    constructor(cx, cy, rx, pf, height, color = "blue") {
        this.cx = cx;                               // ellipse center X
        this.cy = cy;                               // ellipse center Y
        this.rx = rx;                               // ellipse radius X
        this.pf = Math.max(0, Math.min(1, pf));     // perspective factor: ry = rx * pf
        this.h = height;                            // object height
        this.color = color;                         // shadow/stroke color
    }

    edgePoints(azRad, rx, ry) {
        const perp = azRad - Math.PI/2;
        return [
            {
                x: this.cx + rx * Math.cos(perp),
                y: this.cy + ry * Math.sin(perp)
            },
            {
                x: this.cx - rx * Math.cos(perp),
                y: this.cy - ry * Math.sin(perp)
            }
        ];
    }
    
    shadowEnds(points, az, elev, h) {
        const dir = az + Math.PI;
        const len = h / Math.tan(elev);
    
        return points.map(p => ({
            x: p.x + len * Math.cos(dir),
            y: p.y + len * Math.sin(dir)
        }));
    }

    drawShadow(ctx, P1, P2, ends, rx, ry, az) {
        const dir = az + Math.PI;

        const mx = (ends[0].x + ends[1].x) * 0.5;
        const my = (ends[0].y + ends[1].y) * 0.5;
    
        const start = dir - Math.PI / 2;
        const end = dir + Math.PI / 2;
    
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.6;
    
        // Começa a linha de P1 até ends[0]
        ctx.moveTo(P1.x, P1.y);
        ctx.lineTo(ends[0].x, ends[0].y);
    
        // Desenha a elipse entre ends[0] e ends[1]
        ctx.ellipse(mx, my, rx, ry, 0, start, end);
    
        // Continua com ends[1] → P2
        ctx.lineTo(ends[1].x, ends[1].y);
        ctx.lineTo(P2.x, P2.y);
    
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.restore();
    }

    drawBody(ctx, cx, cy, rx, ry){
        ctx.save();

        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        //side
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI, false);
        ctx.lineTo(cx - rx, cy - this.h);
        ctx.ellipse(cx, cy - this.h, rx, ry, 0, Math.PI, 0, true);
        ctx.lineTo(cx + rx, cy);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // top
        ctx.beginPath();
        ctx.ellipse(cx, cy - this.h, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
    
    draw(ctx, sx, sy) {
        const { cx, cy, rx, pf, h, color } = this;
        const ry = rx * pf;
        // sun vector & elevation
        const dx = sx - cx; 
        const dy = sy - cy;
        const az = Math.atan2(dy, dx);
        const elev = Math.atan2(h, Math.hypot(dx, dy));
    
        // 1) divider line on ellipse
        const [P1, P2] = this.edgePoints(az, rx, ry);
        drawPolyLines(ctx, P1, [P2], { color });
    
        if (elev > 0) {
            const shadowEnds = this.shadowEnds([P1, P2], az, elev, h);

            this.drawShadow(ctx, P1, P2, shadowEnds, rx, ry, az);
        }
    
        // 4) draw & fill base ellipse
        this.drawBody(ctx, cx, cy, rx, ry);
    }
}
