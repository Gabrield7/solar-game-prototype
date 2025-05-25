import { degToRad, pad, decode } from "../../utils.js";
import { SolarPanel } from "../photovoltaic/Panel.js";
import { StringPV } from "../photovoltaic/strings.js";
import { PanelSlot } from "./panelSlot.js";

export class Roof{
    constructor(rx, ry, panelBase, panelSide, rows, columns, space, angleX, angleY, index){
        this.rx = rx;               // Starting X position
        this.ry = ry;               // Starting Y position
        this.base = panelBase;      // Base length of each panel
        this.side = panelSide;      // Inclined length of each panel
        this.rows = rows;           // Number of slots in hortzontal
        this.cols = columns;        // Numer of Slots in vertical
        this.space = space;         // Space between Panel Slots
        this.angleX = angleX;       // Roof Inclination in horizontal
        this.angleY = angleY;       // Roof Inclination in vertical

        this.roofMask = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        this.code = `ROOF${pad(index)}`;
        this.slots = this.createSlots();
        this.activeString = false;
        this.strings = [];
    };

    createSlots() {
        const α = -degToRad(this.angleX);  // Inclination angle for rows (horizontal layout)
        const β = -degToRad(this.angleY);  // Inclination angle for columns (vertical layout)
        const roofSpace = 0;               // Optional spacing between rows/columns of slots
        const slots = [];

        for (let i = 0; i < this.rows; i++) {
            // Calculate horizontal displacement for each row
            const rowOffsetX = i * (this.base + roofSpace) * Math.cos(α);
            const rowOffsetY = i * (this.base + roofSpace) * Math.sin(α);

            for (let j = 0; j < this.cols; j++) {
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
                        this.space,                 // internal spacing for panel alignment
                        {i, j}
                    )
                );
            }
        }

        return slots;
    }

    handleClick(mousePos) {
        // Only act if the click hit this slot
        const slot = this.slots.find(s => s.containsPoint(mousePos));  
        const slotPos = decode(slot.data.code);
        
        if (this.roofMask[slotPos.i][slotPos.j] === 1) return false;    // already filled
        if (!slot) return false;                                        // clicked out of any slot

        this.handleStringExpansion(slotPos.i, slotPos.j);     
        return true;
    }

    createString(){
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

        const stringCodeGen = () => {
            if(this.strings.length === 0) return 1
            
            return parseInt(this.strings[this.strings.length - 1].code.slice(3, 5)) + 1;
        }

        const string = new StringPV(this.space, stringCodeGen());
        this.strings.push(string);

        return string;
    }

    handleStringExpansion(i, j){
        const string = this.createString();
        const slot = this.slots.find(slot => slot.data.code === `PST${pad(i)}${pad(j)}`);

        const panel = new SolarPanel(
            slot.rx, slot.ry, 
            this.base, this.side, 
            this.angleX, this.angleY,
            this.space, 
            {i, j},
            string.code
        );

        slot.data.string = string.code;
        slot.data.panel = panel.code;

        string.panels.push(panel);
        this.strings.push(string);
    }

    draw(ctx, shadowPolygons = []) {
        this.slots.forEach(slot => slot.draw(ctx, shadowPolygons));

        this.strings.forEach(string => {
            string.panels.forEach(panel => {
                panel.draw(ctx, shadowPolygons)
            })
        })
    }
}