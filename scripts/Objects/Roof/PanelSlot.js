import { degToRad } from "../../utils.js";
import { PanelBase } from "../PanelBase.js";
import { StringPV } from "../photovoltaic/strings.js";

export class PanelSlot extends PanelBase{
    constructor(rx, ry, base, side, angleX, angleY, space, color = "rgba(255,0,0,0.9)"){
        super(rx, ry, base, side, angleX, angleY, color);
        this.space = space;
        this.strings = [];
    }

    //Draws the slot and its attached strings
    draw(ctx, shadows = []) {
        // Draw the slot shape
        this.drawShape(ctx, this.color);

        // Draw any strings created inside this slot
        this.strings.forEach(str => str.draw(ctx, shadows));
    }

    // Should be called on canvas click event:
    // adds a single-panel string at this slot's center if clicked.
    handleClick(mousePos) {
        // Only act if the click hit this slot
        if(this.strings.length !== 0) return;
        if (!this.containsPoint(mousePos)) return false;

        // Convert tilt angles to radians
        const α = -degToRad(this.angleX);
        const β = -degToRad(this.angleY);

        // Compute the string’s insertion point, inset by half the gap along both axes
        const gap = this.space / 2;
        const insetX  = gap * (Math.cos(α) + Math.cos(β));
        const insetY  = gap * (Math.sin(α) + Math.sin(β));
        const stringPos = {
            x: this.rx + insetX,
            y: this.ry + insetY
        };

        // Create and store a new StringPV of length 1 exactly at that point.
        // We subtract `space` from `base` and `side` so the panel “fits” inside the slot.
        const string = new StringPV(
            stringPos.x,
            stringPos.y,
            [[1]],                       // one panel
            this.space,              // spacing
            this.base - this.space,  // adjusted base
            this.side - this.space,  // adjusted side
            this.angleX,
            this.angleY
        );
        
        this.strings.push(string);
        console.log(this.strings);

        return true;
    }
}