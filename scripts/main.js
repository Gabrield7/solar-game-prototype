import { PanelSlot } from "./Objects/Roof/PanelSlot.js";
import { Roof } from "./Objects/Roof/Roof.js";
import { SolarTrajectory } from "./Objects/SolarTrajectory.js";
import { StringPV } from "./Objects/photovoltaic/strings.js";
import { Cylinder } from './Objects/shadows/Cylinder.js';
import { Parallelepiped } from "./Objects/shadows/Parallelepiped.js";

const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");
const sunControl = document.getElementById("sunControl");

const addString = document.getElementById("addString");
const finishString = document.getElementById("finishString");

let allowAddString = false;

//Solar Trajectory (line)
const solTrajConfig = {
    x: 1000,
    y: 800,
    angle: 60
};
const solTraj = new SolarTrajectory(...Object.values(solTrajConfig));

//Panel Slots (Roof)
const roofConfig = {
    sx: 200,
    sy: 500,
    base: 120,
    side: 70,
    rows: 3,
    column: 5,
    space: 20,
    angleX: -30,
    anglexY: 45, 
    index: 1
};

const roof = new Roof(...Object.values(roofConfig));

// Solar Panel
const mask = [
    [1,1,1,0,0],
    [0,0,1,0,1],
    [0,0,1,1,1]
];

const stringConfig = {
    sx: 200,
    sy: 500,
    mask,
    space: 20,
    base: 100,
    side: 50,
    angleX: -30,
    anglexY: 45, 
};
//const string = new StringPV(...Object.values(stringConfig));

// OBJECT SHADOWS
const pf = 0.5;

// Cylinder
const cylinderConfig = {
    x: 900,
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

//const strings = [];
// canvas.addEventListener("click", e => {
//     //const mouse = getMousePos(e);

//     // máscara 1×1 marcada em [0][0]
//     const string = new StringPV(stringConfig);
    
//     console.log(string);
//     strings.push(string);
//     redraw();
// });
canvas.addEventListener("click", e => {
    //if(!allowAddString) return;
    const mouse = getMousePos(e);

    if(roof.handleClick(mouse)) redraw();
    // roof.slots.forEach(slot => {
    //     if (slot.handleClick(mouse)) redraw();
    // });
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

    //Draw Roof/Slots/Strings/Panels, 
    roof.draw(ctx, shadows);
    //string.draw(ctx, shadows)
    //console.log(strings);

    // Draw shadow objects
    cylinder.draw(ctx, pos.x, pos.y);
    // parallelepiped.draw(ctx, pos.x, pos.y);

}

// function getRandomColor() {
//     // gera um rgba com hue aleatório
//     const h = Math.floor(Math.random()*360);
//     return `hsla(${h},100%,50%,0.6)`;
// }

addString.addEventListener('click', () => {
    allowAddString = true;
});

finishString.addEventListener('click', () => {
    allowAddString = false;
});

