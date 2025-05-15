import { SolarPanel } from "./Panel.js";
import { SolarTrajectory } from "./SolarTrajectory.js";

const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");

// Solar Trajectory (Circle)
const cx = 600;
const cy = 500;
const radius = 450;

let angle = 5; // line direction (degrees)
const tangentLineLength = 3000;

const circle = new SolarTrajectory(cx, cy, radius);

circle.draw(ctx);
circle.drawTangentLine(ctx, angle, tangentLineLength);

// Solar Panel (Rectangle)
const rx = 300;
const ry = 500;
const base = 50;
const side = 100;
const panelAngle = 60;

const panel = new SolarPanel(rx, ry, base, side, panelAngle);
panel.draw(ctx);
//panel.drawParallelogramByLengths(ctx, rx, ry, recW, recH, 60);
panel.drawOuterLines(ctx, cx, cy, radius, angle);

document.getElementById("angleControl").addEventListener("input", (e) => {
    angle = parseFloat(e.target.value);
    redraw();
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    circle.draw(ctx);
    circle.drawTangentLine(ctx, angle, tangentLineLength);
    // Exemplo: desenhar painel e tangentes
    panel.draw(ctx);
    panel.drawOuterLines(ctx, cx, cy, radius, angle);
}