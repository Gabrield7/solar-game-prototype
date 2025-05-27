export function degToRad(deg) {
    return deg * (Math.PI / 180);
}

export function pad(n) {
    return String(n).padStart(2, '0');
};

export function decode(code) {
    const i = parseInt(code.slice(3, 5), 10);
    const j = parseInt(code.slice(5, 7), 10);
    return { i, j };
}

// Draw a line between two points
export function drawLine(ctx, p1, p2, { color = "black", width = 1 } = {}) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function drawPolyLines(ctx, P0, pts, {
    borderColor = "black",
    width = 1,
    fill = false,
    opacity = 1,
    fillColor
} = {}) {
    if (!pts || !pts.length) return;

    ctx.save();
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    for (let i = 0; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();

    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = width;
    ctx.stroke();
    

    ctx.restore();
}

// Draw an arc
export function drawArc(ctx, x, y, rx, ry, {
    rot = 0,
    startAngle = 0,
    endAngle = 360,
    width = 1,
    fill = false,
    fillColor = "blue",
    borderColor = "black",
} = {}) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, degToRad(startAngle), degToRad(endAngle));

    ctx.lineWidth = width;

    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = width;
    ctx.stroke();
};

export function polysIntersect(polyA, polyB) {
    const axes = [...getNormals(polyA), ...getNormals(polyB)];

    for (let axis of axes) {
        const [minA, maxA] = project(polyA, axis);
        const [minB, maxB] = project(polyB, axis);

        if (maxA < minB || maxB < minA) {
            return false;
        }
    }

    return true;
}

function getNormals(poly) {
    const normals = [];
    for (let i = 0; i < poly.length; i++) {
        const p1 = poly[i], p2 = poly[(i+1)%poly.length];
        const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
        const normal = { x: -edge.y, y: edge.x };
        const len = Math.hypot(normal.x, normal.y) || 1;
        normals.push({ x: normal.x/len, y: normal.y/len });
    }
    return normals;
}

function project(poly, axis) {
    let min = Infinity, max = -Infinity;
    for (let p of poly) {
        const proj = p.x*axis.x + p.y*axis.y;
        min = Math.min(min, proj);
        max = Math.max(max, proj);
    }
    return [min, max];
}

