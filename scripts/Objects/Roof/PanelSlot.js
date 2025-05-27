import { pad } from "../../utils.js";
import { PanelBase } from "../PanelBase.js";
//import { StringPV } from "../photovoltaic/strings.js";

export class PanelSlot extends PanelBase{
    constructor(rx, ry, base, side, angleX, angleY, space, position = {i, j}, color = "rgba(255,0,0,0.9)"){
        super(rx, ry, base, side, angleX, angleY);
        this.color = color;
        this.space = space;
        this.data = {
            code: `PST${pad(position.i)}${pad(position.j)}`, 
            string: null, //store the string code when panel id added to PST
            panel: null   //store the panel code (associated to string) when panel id added to PST
        }
    }

    //Draws the slot and its attached strings
    draw(ctx) {
        // Draw the slot shape
        this.drawShape(ctx, this.color);
    }
}