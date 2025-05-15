import { SolarPanel } from "./Panel.js";
import { SolarTrajectory } from "./SolarTrajectory.js";

const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");

// Solar Trajectory (Circle)
const cx = 600;
const cy = 500;
const radius = 450;

const angle = 135; // line direction (degrees)
const tangentLineLength = 3000;

const circle = new SolarTrajectory(cx, cy, radius);

circle.draw(ctx);
circle.drawTangentLine(ctx, angle, tangentLineLength);

// Solar Panel (Rectangle)
const rx = 300;
const ry = 500;
const recW = 50;
const recH = 100;

const panel = new SolarPanel(rx, ry, recW, recH);
panel.draw(ctx);
panel.drawTangentLines(ctx, cx, cy, radius, angle);

