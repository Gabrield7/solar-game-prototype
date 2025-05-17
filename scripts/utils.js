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

// Draw an arc
export function drawArc(ctx, x, y, radius, {
    startAngle = 0,
    endAngle = 360,
    color = "blue",
    width = 1,
    fill = false,
} = {}) {
    ctx.beginPath();
    ctx.arc(x, y, radius, degToRad(startAngle), degToRad(endAngle));
    ctx.lineWidth = width;

    if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

// Draw an rectangle
export function drawRect(ctx, x, y, width, height, {
    color = "blue",
    borderWidth = 1,
    fill = false
} = {}) {
    ctx.beginPath();
    if (fill) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(x, y, width, height);
    }
}
