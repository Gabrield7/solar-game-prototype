import { PanelSlot } from "./Objects/Roof/PanelSlot.js";
import { SolarTrajectory } from "./Objects/SolarTrajectory.js";
import { StringPV } from "./Objects/photovoltaic/strings.js";
import { Cylinder } from './Objects/shadows/Cylinder.js';
import { Parallelepiped } from "./Objects/shadows/Parallelepiped.js";

const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");
const sunControl = document.getElementById("sunControl");

//Solar Trajectory (line)
const solTrajConfig = {
    x: 1000,
    y: 800,
    angle: 60
};
const solTraj = new SolarTrajectory(...Object.values(solTrajConfig));

//Panel Slot
const panelSlotConfig = {
    sx: 200,
    sy: 500,
    base: 70,
    side: 120,
    angleX: -30,
    anglexY: 45,
    space: 20
};

const slot = new PanelSlot(...Object.values(panelSlotConfig));

// Solar Panel
const stringConfig = {
    sx: 200,
    sy: 500,
    count: 5,
    space: 20,
    base: 50,
    side: 100,
    angleX: -30,
    anglexY: 45, 
};
const string = new StringPV(...Object.values(stringConfig));

// OBJECT SHADOWS
const pf = 0.5;

// Cylinder
const cylinderConfig = {
    x: 800,
    y: 500,
    rx: 100,
    pf,
    h: 100
};
const cylinder = new Cylinder(...Object.values(cylinderConfig));

// Parallelepiped
const parallelepipedConfig = {
    x: 700,
    y: 500,
    w: 120,
    h: 80,
    angleZ: 20,
    pf,
    rh: 100
};
const parallelepiped = new Parallelepiped(...Object.values(parallelepipedConfig));

//Mouse handle
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

canvas.addEventListener("click", e => {
    const mouse = getMousePos(e);
    if (slot.handleClick(mouse)) redraw();
});

redraw();

sunControl.addEventListener("input", redraw);

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw solar trajectory
    const t = sunControl.value / 100;
    solTraj.draw(ctx, t);
    const pos = solTraj.getPointAt(ctx, t);

    // put shadows on a list
    const shadows = [
        cylinder.drawShadow(ctx, pos.x, pos.y),
        // parallelepiped.drawShadow(ctx, pos.x, pos.y)
    ].filter(p => p);

    slot.draw(ctx, shadows);
    // Draw string of panels
    //string.draw(ctx, shadows)

    // Draw shadow objects
    cylinder.draw(ctx, pos.x, pos.y);
    // parallelepiped.draw(ctx, pos.x, pos.y);

}

