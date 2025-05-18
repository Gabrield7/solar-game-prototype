export function degToRad(deg) {
    return deg * (Math.PI / 180);
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
    fillColor = "blue"
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

