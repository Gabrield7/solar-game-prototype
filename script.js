const canvas = document.getElementById("solar-grid");
const ctx = canvas.getContext("2d");

// Rectangle
const rx = 475;
const ry = 450;
const recW = 50;
const recH = 100;
ctx.fillStyle = "blue";
ctx.fillRect(rx, ry, recW, recH);

const vertices = [
    [rx, ry],
    [rx + recW, ry],
    [rx, ry + recH],
    [rx + recW, ry + recH],
];

// Circle
ctx.beginPath();
const cx = rx + recW / 2;
const cy = ry + recH/ 2;
const angleDeg = 135; // line direction (degrees)
const angle = - angleDeg * Math.PI / 180;
const radius = 450;

ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
ctx.strokeStyle = "red";
ctx.lineWidth = 1;
ctx.stroke();

// Vector of the direction perpendicular to the direction of the lines
const perpDx = -Math.sin(angle);
const perpDy = Math.cos(angle);

// Projects each vertex onto the perpendicular direction → to measure the distance between lines
const projections = vertices.map(([x, y], i) => {
    const projection = x * perpDx + y * perpDy;
    return { index: i, projection, x, y };
});

// Finds the pair with the greatest projection distance
let maxDist = -Infinity;
let pair = [0, 1];

for (let i = 0; i < projections.length; i++) {
    for (let j = i + 1; j < projections.length; j++) {
        const d = Math.abs(projections[i].projection - projections[j].projection);
        if (d > maxDist) {
            maxDist = d;
            pair = [i, j];
        }
    }
}

// Function that returns the intersection point with the edge of the circle
function getIntersection(x0, y0, angle) {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    const a = dx * dx + dy * dy;
    const b = 2 * (dx * (x0 - cx) + dy * (y0 - cy));
    const c = (x0 - cx) ** 2 + (y0 - cy) ** 2 - radius * radius;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return null;

    const t = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x1 = x0 + dx * t;
    const y1 = y0 + dy * t;

    return { x0, y0, x1, y1 };
}

// Draws the two lines from the selected pair
[pair[0], pair[1]].forEach(i => {
    const { x, y } = projections[i];
    const line = getIntersection(x, y, angle);
    if (!line) return;

    ctx.beginPath();
    ctx.moveTo(line.x0, line.y0);
    ctx.lineTo(line.x1, line.y1);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.stroke();
});
