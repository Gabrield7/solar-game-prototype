import { ObjectShadow } from './ObjectShadow.js';

export class Cylinder extends ObjectShadow {
    constructor(cx, cy, rx, pf, height, color) {
        super(cx, cy, height, color);
        this.rx = rx;
        this.pf = Math.max(0, Math.min(1, pf));
    }

    edgePoints(az) {
        const ry = this.rx * this.pf;
        const perp = az - Math.PI/2;
        
        // Return two points on the ellipse edge perpendicular to the light direction
        return [
            { x: this.cx + this.rx * Math.cos(perp), y: this.cy + ry * Math.sin(perp) },
            { x: this.cx - this.rx * Math.cos(perp), y: this.cy - ry * Math.sin(perp) }
        ];
    }

    drawShadow(ctx, sx, sy) {
        // Compute light azimuth (az) and elevation angle (elev) based on light source (sx, sy)
        const { az, elev } = this.computeLightParams(sx, sy);
    
        // If the elevation is below the horizon, don't draw a shadow
        if (elev <= 0) return;
    
        // Get the two edge points of the shape facing the light direction
        const pts = this.edgePoints(az);
    
        // Calculate the projected ends of the shadow based on light direction and elevation
        const ends = this.shadowEnds(pts, az, elev);
    
        // Begin drawing the shadow shape
        ctx.save(); // Save current canvas state
        ctx.globalAlpha = 0.6; // Set transparency for the shadow
    
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);        // Move to first edge point
        ctx.lineTo(ends[0].x, ends[0].y);      // Draw line to first shadow end
    
        // Calculate midpoint between the two shadow ends
        const mx = (ends[0].x + ends[1].x) * 0.5;
        const my = (ends[0].y + ends[1].y) * 0.5;
    
        // Define start and end angles for the curved part of the shadow
        const start = az + Math.PI - Math.PI / 2;
        const end = az + Math.PI + Math.PI / 2;
    
        // Draw an elliptical arc to simulate the curved shadow
        ctx.ellipse(mx, my, this.rx, this.rx * this.pf, 0, start, end);
    
        ctx.lineTo(ends[1].x, ends[1].y);      // Connect to the second shadow end
        ctx.lineTo(pts[1].x, pts[1].y);        // Return to second edge point
        ctx.closePath();                       // Close the shadow path
    
        ctx.fillStyle = "black";               // Set fill color to black
        ctx.fill();                            // Fill the shadow shape
        ctx.restore();                         // Restore previous canvas state
    }    

    drawBody(ctx) {
        const ry = this.rx * this.pf;
    
        ctx.save();
        ctx.fillStyle = this.color;         // Fill color of the object
        ctx.strokeStyle = "black";          // Outline color
        ctx.lineWidth = 2;                  // Outline thickness
    
        // --- Draw the cylindrical side body ---
        ctx.beginPath();
        ctx.ellipse(this.cx, this.cy, this.rx, ry, 0, 0, Math.PI);
        ctx.lineTo(this.cx - this.rx, this.cy - this.h);
        ctx.ellipse(this.cx, this.cy - this.h, this.rx, ry, 0, Math.PI, 0, true);
        ctx.lineTo(this.cx + this.rx, this.cy);
    
        ctx.closePath();
        ctx.fill();   // Fill the side body
        ctx.stroke(); // Outline the side body
    
        // --- Draw the top cover (full ellipse) ---
        ctx.beginPath();
        ctx.ellipse(this.cx, this.cy - this.h, this.rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();   // Fill the top cover
        ctx.stroke(); // Outline the top cover
    
        ctx.restore();
    }
    

    draw(ctx, sx, sy) {
        this.drawShadow(ctx, sx, sy);
        this.drawBody(ctx);
    }
}

