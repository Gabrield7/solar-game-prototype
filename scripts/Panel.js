export class SolarPanel {
    constructor(recX, recY, recW, recH, color = "blue", fillStyle = null) {
        this.recX = recX;
        this.recY = recY;
        this.recW = recW;
        this.recH = recH;
        this.color = color;
        this.fillStyle = fillStyle;
    }
  
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.recX, this.recY, this.recW, this.recH);
    }

    getVertices() {
        return [
            [this.recX, this.recY], // top-left
            [this.recX + this.recW, this.recY], // top-right
            [this.recX, this.recY + this.recH], // bottom-left
            [this.recX + this.recW, this.recY + this.recH], // bottom-right
        ];
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
    
    vertexIntersection(vx, vy, px, py, angleDeg) {
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
    
    getCandidates(cx, cy, radius, angleDeg) {
        const angleRad = -this.toRadians(angleDeg);
        const dirX = Math.cos(-angleRad);
        const dirY = Math.sin(-angleRad);
        const { x: px, y: py } = this.getTangentPoint(cx, cy, radius, angleDeg);
    
        return this.getVertices().map(([vx, vy]) => {
            const { x: ix, y: iy } = this.vertexIntersection(vx, vy, px, py, angleDeg);
            const proj = (ix - vx) * dirX + (iy - vy) * dirY;
            return { vx, vy, ix, iy, proj };
        });
    }
    
    drawTangentLines(ctx, cx, cy, radius, angleDeg) {
        const candidates = this.getCandidates(cx, cy, radius, angleDeg);
    
        const [outer1, outer2] = candidates
            .sort((a, b) => b.proj - a.proj)
            .slice(0, 2);
    
        [outer1, outer2].forEach(({ vx, vy, ix, iy }) => {
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(ix, iy);
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }
}