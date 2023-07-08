export const cubeSize = 2;
export const a = cubeSize / 2;
export const b = a * Math.tan(Math.PI / 12);
export const c = a - b;
export const d = a / Math.cos(Math.PI / 12);
export const e = d * Math.sin(Math.PI / 6);
export const f = a * Math.SQRT2;
export const g = Math.sqrt(d * d - e * e);

export const x = 0.025;

export function toDeg(rad: number) {
    return rad * (180 / Math.PI);
}
export function toRad(deg: number) {
    return deg * (Math.PI / 180);
}

export function adjust(p: Record<string, number[]>, angle: number, m = x) {
    const pv = Object.values(p);
    const avg = [
        pv.reduce((a, b) => a + b[0], 0) / pv.length,
        pv.reduce((a, b) => a + b[1], 0) / pv.length,
        pv.reduce((a, b) => a + b[2], 0) / pv.length,
    ];
    // const ravg = [
    //     pv.reduce((a ,b) => a + b[0] * Math.cos(angle) - b[2] * Math.sin(angle), 0) / pv.length,
    //     pv.reduce((a ,b) => a + b[0] * Math.sin(angle) + b[2] * Math.cos(angle), 0) / pv.length,
    // ]
    // console.log(ravg);

    for (const v of pv) {
        // const xy = [v[0], v[2]];
        // // Rotated xy
        // const rxy = [
        //     xy[0] * Math.cos(angle) - xy[1] * Math.sin(angle),
        //     xy[0] * Math.sin(angle) + xy[1] * Math.cos(angle),
        // ];
        // rxy[0] = rxy[0] - Math.sign(rxy[0] - ravg[0]) * m;
        // rxy[1] = rxy[1] - Math.sign(rxy[1] - ravg[1]) * m;
        // console.log(rxy);
        // const unrxy = [
        //     rxy[0] * Math.cos(-angle) - rxy[1] * Math.sin(-angle),
        //     rxy[0] * Math.sin(-angle) + rxy[1] * Math.cos(-angle),
        // ]

        // v[0] = unrxy[0];
        // v[2] = unrxy[1];

        v[0] = v[0] - Math.sign(v[0] - avg[0]) * m * (Math.abs(v[0] - avg[0]) ** 2 / (Math.abs(v[0] - avg[0]) ** 2 + Math.abs(v[2] - avg[2]) ** 2));
        v[1] = v[1] - Math.sign(v[1] - avg[1]) * m;
        v[2] = v[2] - Math.sign(v[2] - avg[2]) * m * (Math.abs(v[2] - avg[2]) ** 2 / (Math.abs(v[0] - avg[0]) ** 2 + Math.abs(v[2] - avg[2]) ** 2));
        // v[0] = v[0] - Math.sign(v[0] - avg[0]) * m;
        // v[1] = v[1] - Math.sign(v[1] - avg[1]) * m;
        // v[2] = v[2] - Math.sign(v[2] - avg[2]) * m;
    }
}

