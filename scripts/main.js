import { SolarPanel } from "./Objects/Panel.js";
import { SolarTrajectory } from "./Objects/SolarTrajectory.js";
import { StringPV } from "./strings.js";
import { ObjectShadow } from './Objects/Object.js';

const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");
const sunControl = document.getElementById("sunControl");

//Solar Trajectory (line)
const tx = 800;
const ty = 500;
const angleTraj = 100;
const traj = new SolarTrajectory(tx, ty, angleTraj);

// Solar Panel (Parallelogram)
const rx = 300;
const ry = 500;
const base = 50;
const side = 100;
const panelAngle = 60;

const numberOfPanels = 5;
const space = 25;

const string = new StringPV(rx, ry, numberOfPanels, space, base, side, panelAngle);

// Object Shadow
const ox = 600;
const oy = 500;
const or = 100;
const objAngle = 120;
const oh = 100;
const obj = new ObjectShadow(ox, oy, or, oh, objAngle);

redraw();

sunControl.addEventListener("input", redraw);

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    traj.draw(ctx);
    // draw the blue handle at t∈[0,1]
    const t = sunControl.value / 100;
    traj.drawSun(ctx, t);
  
    // real-time coords:
    const pos = traj.getPointAt(ctx, t);
    console.log("sun at:", pos);

    obj.draw(ctx, pos.x, pos.y);

    // string.draw(ctx, cx, cy, radius, angle);
}

