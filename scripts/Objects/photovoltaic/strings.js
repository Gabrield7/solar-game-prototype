import { pad } from "../../utils.js";

export class StringPV {
    constructor(space, index, color = "rgba(0,0,255,0.8)") {
        this.space = space;
        this.color = color;
        this.code = `STR${pad(index)}`;
        this.panels = [];
    }

    draw(ctx, shadowPolygons = []) {
        // draw panels
        this.panels.forEach(p => p.draw(ctx, shadowPolygons));
    }

    // createPanelsFromMask() {
    //     const panels = [];

    //     const α = -degToRad(this.angleX);
    //     const β = -degToRad(this.angleY);
        
    //     const rows = this.mask.length;
    //     const cols = this.mask[0]?.length || 0;

    //     for (let i = 0; i < rows; i++) {
    //         for (let j = 0; j < cols; j++) {
    //             if (!this.mask[i][j]) continue;
    //             // deslocamento pela mask
    //             const rowDisp = i * (this.base + this.space);
    //             const colDisp = j * (this.side + this.space);
    //             const dx = rowDisp * Math.cos(α) + colDisp * Math.cos(β);
    //             const dy = rowDisp * Math.sin(α) + colDisp * Math.sin(β);
    //             const px = this.sx + dx;
    //             const py = this.sy + dy;

    //             panels.push(
    //                 new SolarPanel(
    //                     px, py, 
    //                     this.base, this.side, 
    //                     this.angleX, this.angleY, 
    //                     this.color
    //                 )
    //             );
    //         }
    //     }

    //     return panels;
    // }
}

