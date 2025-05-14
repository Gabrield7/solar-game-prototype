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
}