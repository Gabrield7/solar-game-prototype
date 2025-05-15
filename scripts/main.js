import { SolarPanel } from "./Panel.js";
import { SolarTrajectory } from "./SolarTrajectory.js";
import { StringPV } from "./strings.js";

const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");

// Solar Trajectory (Circle)
const cx = 600;
const cy = 500;
const radius = 450;
const tangentLineLength = 3000;
let angle = 5; // line direction (degrees)

const circle = new SolarTrajectory(cx, cy, radius);

// Solar Panel (Parallelogram)
const rx = 300;
const ry = 500;
const base = 50;
const side = 100;
const panelAngle = 60;

const numberOfPanels = 5;
const space = 25;

const string = new StringPV(rx, ry, numberOfPanels, space, base, side, panelAngle);


redraw();

document.getElementById("angleControl").addEventListener("input", (e) => {
    angle = parseFloat(e.target.value);
    redraw();
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    circle.draw(ctx);
    circle.drawTangentLine(ctx, angle, tangentLineLength);

    string.draw(ctx, cx, cy, radius, angle);
}