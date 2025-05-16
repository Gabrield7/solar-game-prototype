import { degToRad, drawLine, drawArc } from '../utils.js';

export class ObjectShadow {
    constructor(cx, cy, r, angle, color = "blue") {
        this.cx = cx;         // X position of the center
        this.cy = cy;         // Y position of the center
        this.r = r;           // Circle radius
        this.angle = angle;   // Angle in degrees
        this.color = color;   // Stroke color of the circle
    }

    draw(ctx) {
        // Draw the main circle
        drawArc(ctx, this.cx, this.cy, this.r, 0, 360, this.color, 2);

        // Calculate the two points on the circle's edge intersected by the central line
        const points = this.getCircleIntersections(this.angle);

        // Draw the central line crossing the circle
        drawLine(ctx, points[0], points[1], "black", 1);

        // Draw projected lines (shadows) from both edge points
        this.drawProjections(ctx, points, 200, this.angle + 90);
    }

    // Returns the two edge points of the circle based on the given angle
    getCircleIntersections(angleDeg) {
        const rad = degToRad(-angleDeg);
        const dx = this.r * Math.cos(rad);
        const dy = this.r * Math.sin(rad);

        return [
            { x: this.cx + dx, y: this.cy + dy },
            { x: this.cx - dx, y: this.cy - dy }
        ];
    }

    // Draws projected lines (like shadows) from each point at a specified angle and length
    drawProjections(ctx, points, length, angleDeg) {
        const rad = degToRad(-angleDeg);

        for (const point of points) {
            const end = {
                x: point.x + length * Math.cos(rad),
                y: point.y + length * Math.sin(rad)
            };
            drawLine(ctx, point, end, "black", 1);
        }
    }
}