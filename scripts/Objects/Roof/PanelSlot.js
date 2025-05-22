import { degToRad } from "../../utils.js";
import { PanelBase } from "../PanelBase.js";
import { StringPV } from "../photovoltaic/strings.js";

export class PanelSlot extends PanelBase{
    constructor(rx, ry, base, side, angleX, angleY, space, color = "red"){
        super(rx, ry, base, side, angleX, angleY, color);
        this.space = space;
        this.strings = [];
    }

    /** Draws the slot and its attached strings */
    draw(ctx, shadows = []) {
        // Draw the slot shape
        this.drawShape(ctx, this.color);

        // Draw any strings created inside this slot
        this.strings.forEach(str => str.draw(ctx, shadows));
    }

    /**
     * Should be called on canvas click event:
     * adds a single-panel string at this slot's center if clicked.
     */
    handleClick(mousePos) {
        // Only act if the click hit this slot
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
        const singleString = new StringPV(
            stringPos.x,
            stringPos.y,
            1,                       // one panel
            this.space,              // spacing
            this.base - this.space,  // adjusted base
            this.side - this.space,  // adjusted side
            this.angleX,
            this.angleY
        );
        this.strings.push(singleString);

        return true;
    }

    /** Get geometric center of the slot parallelogram */
    // getCenter() {
    //     const vs = this.vertices;
    //     const sum = vs.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    //     return { x: sum.x / vs.length, y: sum.y / vs.length };
    // }
}