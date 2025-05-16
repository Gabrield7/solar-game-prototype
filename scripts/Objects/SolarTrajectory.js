import { degToRad, drawArc, drawLine } from "../utils.js";

export class SolarTrajectory {
    constructor(x, y, radius, startAngle = 0, endAngle = 2 * Math.PI, strokeStyle = "red", fillStyle = null) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle; // radians
        this.endAngle = endAngle;     // radians
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
    }
  
    draw(ctx) {
        const startDeg = this.startAngle * 180 / Math.PI;
        const endDeg   = this.endAngle   * 180 / Math.PI;

        drawArc(
            ctx,
            this.x,
            this.y,
            this.radius,
            startDeg,
            endDeg,
            this.strokeStyle,
            1,
            !!this.fillStyle
        );

        if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
        }
    }

    getIntersection(angleDeg) {
        const rad = degToRad(-angleDeg);
        return {
            x: this.x + this.radius * Math.cos(rad),
            y: this.y + this.radius * Math.sin(rad)
        };
    }

    drawTangentLine(ctx, angleDeg, length) {
        const border = this.getIntersection(angleDeg);

        const rad = degToRad(-angleDeg);
        const dx = Math.cos(rad + Math.PI / 2);
        const dy = Math.sin(rad + Math.PI / 2);
        const half = length / 2;

        const p1 = {
            x: border.x + dx * half,
            y: border.y + dy * half
        };
        const p2 = {
            x: border.x - dx * half,
            y: border.y - dy * half
        };

        drawLine(ctx, p1, p2, "black", 2);
    }
}

  
