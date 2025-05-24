import { SolarPanel } from "./Panel.js";
import { degToRad, drawPolyLines } from "../../utils.js";

export class StringPV {
    constructor(sx, sy, mask, space, base, side, angleX, angleY, color = "rgba(0,0,255,0.8)") {
        this.sx = sx;
        this.sy = sy;
        this.mask = mask;
        this.space = space;
        this.base = base;
        this.side = side;
        this.angleX = angleX;
        this.angleY = angleY;
        this.color = color;
        this.panels = this._createPanelsFromMask();
        //this.boundary = this._computeBoundaryEdges();
    }

    _createPanelsFromMask() {
        const panels = [];

        const α = -degToRad(this.angleX);
        const β = -degToRad(this.angleY);
        
        const rows = this.mask.length;
        const cols = this.mask[0]?.length || 0;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!this.mask[i][j]) continue;
                // deslocamento pela mask
                const rowDisp = i * (this.base + this.space);
                const colDisp = j * (this.side + this.space);
                const dx = rowDisp * Math.cos(α) + colDisp * Math.cos(β);
                const dy = rowDisp * Math.sin(α) + colDisp * Math.sin(β);
                const px = this.sx + dx;
                const py = this.sy + dy;

                panels.push(
                    new SolarPanel(
                        px, py, 
                        this.base, this.side, 
                        this.angleX, this.angleY, 
                        this.color
                    )
                );
            }
        }

        return panels;
    }

    // _computeBoundaryEdges() {
    //     const rows = this.mask.length;
    //     const cols = this.mask[0]?.length || 0;
    //     const borders = [];

    //     // helper to check if mask cell exists and is truthy
    //     const hasPanel = (i, j) => i >= 0 && j >= 0 && i < rows && j < cols && Boolean(this.mask[i][j]);

    //     // define neighbor offsets for each corner
    //     const cornerDirs = {
    //         bl: ['S', 'SO', 'O'],
    //         br: ['L', 'SE', 'S'],
    //         tr: ['N', 'NE', 'L'],
    //         tl: ['O', 'NO', 'N'],
    //     };

    //     // map directions to offsets
    //     const dirOffset = {
    //         N:  [-1,  0], NE: [-1, +1], NO: [-1, -1],
    //         S:  [+1,  0], SE: [+1, +1], SO: [+1, -1],
    //         L:  [ 0, +1], O:  [ 0, -1]
    //     };

    //     // opposite-corner mapping for curved cases
    //     const oppositeCorner = { O:'br', SO:'tr', S:'tl', L:'bl', SE:'br', N:'bl', NE:'br' };

    //     for (const { panel, position: {i, j} } of this.panels) {
    //         const verts = panel.vertices;

    //         for (const corner of Object.keys(cornerDirs)) {
    //             // gather neighbor occupancy
    //             const dirs = cornerDirs[corner];
    //             const vals = dirs.map(d => {
    //                 const [di, dj] = dirOffset[d];
    //                 return hasPanel(i + di, j + dj);
    //             });

    //             // determine if this corner should be part of boundary
    //             const falsy = [ [true,false,false], [false,false,true], [true,true,true] ];
    //             const isBoundary = !falsy.some(cond => cond.every((v,k) => v === vals[k]));
    //             if (!isBoundary) continue;

    //             let vertexPoint;
    //             const [a, b, c] = vals;
    //             if (a && b && !c) {
    //                 // pattern [true, true, false]
    //                 const mid = dirs[0];
    //                 const [mi, mj] = dirOffset[mid];
    //                 const neighbor = this.panels.find(p => p.position.i === i + mi && p.position.j === j + mj).panel;
    //                 vertexPoint = neighbor.vertices[oppositeCorner[mid]];
    //             } else if (!a && b && c) {
    //                 // pattern [false, true, true]
    //                 const mid = dirs[1];
    //                 const [mi, mj] = dirOffset[mid];
    //                 const neighbor = this.panels.find(p => p.position.i === i + mi && p.position.j === j + mj).panel;
    //                 vertexPoint = neighbor.vertices[oppositeCorner[mid]];
    //             } else {
    //                 // straight boundary
    //                 vertexPoint = verts[corner];
    //             }

    //             if (vertexPoint && !borders.includes(vertexPoint)) {
    //                 borders.push(vertexPoint);
    //             }
    //         }
    //     }

    //     // remove duplicates by coordinate key
    //     const unique = [];
    //     const seen = new Set();
    //     for (const v of borders) {
    //         const key = `${v.x.toFixed(2)},${v.y.toFixed(2)}`;
    //         if (!seen.has(key)) {
    //             seen.add(key);
    //             unique.push(v);
    //         }
    //     }

    //     return unique;
    // }

    sortPointsByAngle(points) {
        // 1) calcula o centroide
        let cx = 0, cy = 0;
        for (const p of points) {
            cx += p.x;
            cy += p.y;
        }
        cx /= points.length;
        cy /= points.length;

        // 2) ordena pelo ângulo polar
        return points.slice().sort((a, b) => {
            const angA = Math.atan2(a.y - cy, a.x - cx);
            const angB = Math.atan2(b.y - cy, b.x - cx);
            return angA - angB;
        });
    }

    draw(ctx, shadowPolygons = []) {
        // draw panels
        this.panels.forEach(p => p.draw(ctx, shadowPolygons));
    }
}

