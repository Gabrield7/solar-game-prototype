export class SolarTrajectory {
    constructor(x, y, radius, startAngle = 0, endAngle = 2 * Math.PI, strokeStyle = "red", fillStyle = null) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
    }
  
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    
        if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
        }
    
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }


    drawTangentLine(ctx, angle, length){
        const radAngle = - angle * Math.PI / 180;
        
        const px = this.x + this.radius * Math.cos(radAngle);
        const py = this.y + this.radius * Math.sin(radAngle);

        const dx = Math.cos(radAngle + Math.PI / 2);
        const dy = Math.sin(radAngle + Math.PI / 2);

        const halfLen = length / 2;

        const line = {
            x1: px - dx * halfLen,
            y1: py - dy * halfLen,
            x2: px + dx * halfLen,
            y2: py + dy * halfLen,
        };

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
    
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
  
