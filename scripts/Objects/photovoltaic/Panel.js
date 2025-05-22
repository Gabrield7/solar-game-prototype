import { polysIntersect } from "../../utils.js";
import { PanelBase } from "../PanelBase.js";

export class SolarPanel extends PanelBase {
    constructor(rx, ry, base, side, angleX, angleY, color = "blue") {
        super(rx, ry, base, side, angleX, angleY, color);
    }

    draw(ctx, shadowPolygons = []) {       
        const pts = this.vertices;
    
        // Stroke the panel edges
        let strokeColor = 'black';

        const isShadowBy = shadowPolygons.some(shadow => polysIntersect(pts, shadow));
        if (isShadowBy) strokeColor = 'blue';

        //Draw Panel 
        this.drawShape(ctx, this.color, strokeColor)
    }
}
