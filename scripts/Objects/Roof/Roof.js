import { degToRad } from "../../utils.js";
import { PanelSlot } from "./PanelSlot.js";

export class Roof{
    constructor(rx, ry, panelBase, panelSide, raws, columns, space, angleX, angleY){
        this.rx = rx;               // Starting X position
        this.ry = ry;               // Starting Y position
        this.base = panelBase;      // Base length of each panel
        this.side = panelSide;      // Inclined length of each panel
        this.raws = raws;           // Number of slots in hortzontal
        this.columns = columns;       // Numer of Slots in vertical
        this.space = space;         // Space between Panel Slots
        this.angleX = angleX;       // Roof Inclination in horizontal
        this.angleY = angleY;       // Roof Inclination in vertical

        this.slots = this.createSlots();
    }

    createSlots() {
        const α = -degToRad(this.angleX);  // Inclination angle for rows (horizontal layout)
        const β = -degToRad(this.angleY);  // Inclination angle for columns (vertical layout)
        const roofSpace = 0;               // Optional spacing between rows/columns of slots
        const slots = [];

        for (let i = 0; i < this.raws; i++) {
            // Calculate horizontal displacement for each row
            const rowOffsetX = i * (this.base + roofSpace) * Math.cos(α);
            const rowOffsetY = i * (this.base + roofSpace) * Math.sin(α);

            for (let j = 0; j < this.columns; j++) {
                // Calculate vertical displacement for each column
                const colOffsetX = j * (this.side + roofSpace) * Math.cos(β);
                const colOffsetY = j * (this.side + roofSpace) * Math.sin(β);

                // Final position of the slot is the sum of row and column displacements
                const px = this.rx + rowOffsetX + colOffsetX;
                const py = this.ry + rowOffsetY + colOffsetY;

                // Create a new PanelSlot and add it to the array
                slots.push(
                    new PanelSlot(
                        px, py,                     // position
                        this.base, this.side,       // panel dimensions
                        this.angleX, this.angleY,   // orientation angles
                        this.space                  // internal spacing for panel alignment
                    )
                );
            }
        }

        return slots;
    }

    draw(ctx, shadowPolygons = []) {
        this.slots.forEach(slot => slot.draw(ctx, shadowPolygons));
    }
}