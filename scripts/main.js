import { SolarPanel } from "./Objects/Panel.js";
import { SolarTrajectory } from "./Objects/SolarTrajectory.js";
import { StringPV } from "./strings.js";
import { Cylinder } from './Objects/shadows/Cylinder.js';
import { Parallelepiped } from "./Objects/shadows/Parallelepiped.js";
import { drawPolyLines, polysIntersect } from "./utils.js";

const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");
const sunControl = document.getElementById("sunControl");

//Solar Trajectory (line)
const tx = 1000;
const ty = 800;
const angleTraj = 60;
const traj = new SolarTrajectory(tx, ty, angleTraj);

// Solar Panel (Parallelogram)
const rx = 200;
const ry = 500;
const base = 50;
const side = 100;
const panelAngle = 60;

const numberOfPanels = 5;
const space = 25;

const string = new StringPV(rx, ry, numberOfPanels, space, base, side, panelAngle);

// OBJECT SHADOWS
const pf = .5;
//Cylinder
const ox = 800;
const oy = 500;
const orx = 100;
const oh = 100;
//const objAngle = 120;
const cylinder = new Cylinder(ox, oy, orx, pf, oh);

//rec
const recx = 700;
const recy = 500;
const recW = 120;
const recH = 80;
const recAngleZ = 20;
const rh = 100;
const parall = new Parallelepiped(recx, recy, recW, recH, recAngleZ, pf, rh)//, recAngleX);

redraw();

sunControl.addEventListener("input", redraw);

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    traj.draw(ctx);
    const t = sunControl.value / 100;
    traj.drawSun(ctx, t);
    const pos = traj.getPointAt(ctx, t);
      // coleta sombras numa lista
    const shadows = [
        cylinder.drawShadow(ctx, pos.x, pos.y),
        // parallelepiped.drawShadow(ctx, pos.x, pos.y)
    ].filter(p => p);

    // desenha todos os painéis + destaque interno
    string.panels.forEach(panel => {
        panel.draw(ctx, shadows);
    });

    cylinder.draw(ctx, pos.x, pos.y);
    //parall.draw(ctx, pos.x, pos.y);
}



