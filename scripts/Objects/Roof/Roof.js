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

        this.mask = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        this.code = `ROOF${pad(index)}`;
        this.slots = this.createSlots();
        this.expandString = false;
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
    };

    handleClick(mousePos) {
        // Only act if the click hit this slot
        const slot = this.slots.find(s => s.containsPoint(mousePos));  
        const slotPos = decode(slot.data.code);
        
        if (this.mask[slotPos.i][slotPos.j] === 1) return false;    // already filled
        if (!slot) return false;                                        // clicked out of any slot

        this.handleStringExpansion(slotPos.i, slotPos.j);
        console.log(this.mask);
          
        return true;
    };

    createString(){
        const string = new StringPV(this.space)
        this.strings.push(string);
    
        return string;
    };

    handleStringExpansion(i, j){
        const cell = this.mask[i][j];
        // Only operate on an empty (0) or adjacent ('A') slot
        if (cell !== 0 && cell !== 'A') return;
        if(this.expandString && cell !== 'A') return

        // Determine or create the active string
        let string;
        if (cell === 0) {
            this.expandString = true;
            string = this.createString();
        } else {
            string = this.strings[this.strings.length - 1];
        }

        // Create panel from slot
        const slot = this.slots.find(s => s.data.code === `PST${pad(i)}${pad(j)}`);
        const panel = new SolarPanel(
            slot.rx, slot.ry,
            this.base, this.side,
            this.angleX, this.angleY,
            this.space,
            { i, j },
            string.code
        );

        // Update mask and slot metadata
        this.updateMask(i, j);
        slot.data.string = string.code;
        slot.data.panel = panel.code;
        string.panels.push(panel);
        
        
        // if (!this.expandString) return;
        // const cell = this.mask[i][j];
        // if (cell !== 0 && cell !== 'A') return;

        // if (!this.expandString) {
        //     this.expandString = true;
        //     // Get or create the active string
        //     const string = cell === 0
        //         ? this.createString()
        //         : this.strings[this.strings.length - 1];
    
        //     const slot = this.slots.find(s => s.data.code === `PST${pad(i)}${pad(j)}`);
        //     const panel = new SolarPanel(
        //         slot.rx, slot.ry,
        //         this.base, this.side,
        //         this.angleX, this.angleY,
        //         this.space,
        //         { i, j },
        //         string.code
        //     );

        //     this.updateMask(i, j);
        //     slot.data.string = string.code;
        //     slot.data.panel  = panel.code;
        //     string.panels.push(panel);
        // }
        // if(this.expandString && cell === 'A'){
        //     const string = this.strings[this.strings.length - 1];

        //     const slot = this.slots.find(s => s.data.code === `PST${pad(i)}${pad(j)}`);
        //     const panel = new SolarPanel(
        //         slot.rx, slot.ry,
        //         this.base, this.side,
        //         this.angleX, this.angleY,
        //         this.space,
        //         { i, j },
        //         string.code
        //     );

        //     this.updateMask(i, j);
        //     slot.data.string = string.code;
        //     slot.data.panel  = panel.code;
        //     string.panels.push(panel);
        // }
    };

    updateMask(i, j) {
        const adj = [
            { i: i - 1, j },
            { i: i + 1, j },
            { i, j: j - 1 },
            { i, j: j + 1 },
        ];

        this.mask[i][j] = 1;
        const maxI = this.rows - 1;
        const maxJ = this.cols - 1;

        adj.forEach(pt => {
            if (pt.i < 0 || pt.i > maxI || pt.j < 0 || pt.j > maxJ) return;
            if (this.mask[pt.i][pt.j] !== 1) {
                this.mask[pt.i][pt.j] = 'A';
            }
        });
    };

    draw(ctx, shadowPolygons = []) {
        //Draw slots
        this.slots.forEach(slot => slot.draw(ctx, shadowPolygons));

        //Draw Strings and Panels
        this.strings.forEach(string => string.draw(ctx, shadowPolygons));
    };
}