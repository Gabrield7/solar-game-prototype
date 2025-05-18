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
export function drawArc(ctx, x, y, rx, ry, {
    rot = 0,
    startAngle = 0,
    endAngle = 360,
    color = "blue",
    width = 1,
    fill = false,
} = {}) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, degToRad(startAngle), degToRad(endAngle));

    ctx.lineWidth = width;

    if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.stroke();
    }
};

// export function drawIsometricCircle(ctx, x, y, radius, color = "red") {
//     //ctx.save(); // salva o estado atual do canvas

//     // Mover o "ponto de origem" do desenho para o centro do círculo
//     ctx.translate(x, y);

//     // Rotacionar o sistema de coordenadas em 45° (π/4 rad)
//     ctx.rotate(0);

//     // Desenhar uma elipse achatada (altura menor que largura)
//     ctx.beginPath();
//     ctx.ellipse(0, 0, radius, radius * 0.5, 0, 0, 2 * Math.PI);
//     ctx.fillStyle = color;
//     ctx.fill();

//     //ctx.restore(); // restaura o estado original do canvas
// }

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
