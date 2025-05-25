import { degToRad, drawPolyLines, pad, polysIntersect } from "../../utils.js";
import { PanelBase } from "../PanelBase.js";

export class SolarPanel extends PanelBase {
    constructor(rx, ry, base, side, angleX, angleY, space, position = {i: 0, j: 0}, string, color = "blue") {
        // Convert angles to radians once
        const α = -degToRad(angleX);
        const β = -degToRad(angleY);

        // Calculate adjusted origin offset by half the spacing along both axes
        const adjustedRx = rx + 0.5 * space * (Math.cos(α) + Math.cos(β));
        const adjustedRy = ry + 0.5 * space * (Math.sin(α) + Math.sin(β));

        // Shrink dimensions by full spacing
        const adjustedBase = base - space;
        const adjustedSide = side - space;
        
        // Initialize PanelBase with adjusted values
        super(adjustedRx, adjustedRy, adjustedBase, adjustedSide, angleX, angleY, color);
        console.log(this.vertices)

        this.outer = { rx, ry, base, side };
        // SolarPanel-specific properties
        this.space = space;
        this.code = `PNL${pad(position.i)}${pad(position.j)}`;
        this.string = string;
    }

    draw(ctx, shadowPolygons = []) {       
        const pts = [...Object.values(this.vertices)];
        console.log(pts);
    
        // Stroke the panel edges
        let strokeColor = 'black';

        const isShadowBy = shadowPolygons.some(shadow => polysIntersect(pts, shadow));
        if (isShadowBy) strokeColor = 'blue';

        // Draw Panel Boundary
        const poly = [...Object.values(this.getVertices())];
        drawPolyLines(ctx, poly[0], poly.slice(1), {
            fill: true,
            fillColor: 'rgb(0,0,255,0.1)'
        });

        // Draw Panel 
        this.drawShape(ctx, this.color, strokeColor);
    }
}
