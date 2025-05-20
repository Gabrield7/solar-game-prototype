export class ObjectShadow {
    constructor(cx, cy, height, color = "blue") {
        this.cx = cx;
        this.cy = cy;
        this.h = height;
        this.color = color;
    }

    // calculates light direction and elevation
    computeLightParams(sx, sy) {
        // the horizontal and vertical distances from shape center to light source
        const dx = sx - this.cx;
        const dy = sy - this.cy;
    
        // azimuth: angle from center to light source (in radians)
        const az = Math.atan2(dy, dx);
    
        // elevation: vertical angle between light source and top of the object
        const elev = Math.atan2(this.h, Math.hypot(dx, dy));
    
        return { az, elev };
    }

    // projects shadow points along the light direction
    shadowEnds(points, az, elev) {
        // Direction of the shadow is opposite to the light (add π radians)
        const dir = az + Math.PI;
    
        // Shadow length is proportional to the height and inversely proportional to light elevation
        const len = this.h / Math.tan(elev);
    
        // Project each point in the direction of the shadow
        return points.map(p => ({
            x: p.x + len * Math.cos(dir),
            y: p.y + len * Math.sin(dir)
        }));
    }

}