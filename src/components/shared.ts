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

export function adjust(p: Record<string, number[]>) {
    const pv = Object.values(p);
    const avg = [
        pv.reduce((a, b) => a + b[0], 0) / pv.length,
        pv.reduce((a, b) => a + b[1], 0) / pv.length,
        pv.reduce((a, b) => a + b[2], 0) / pv.length,
    ];

    for (const v of pv) {
        v[0] = v[0] - Math.sign(v[0] - avg[0]) * x * (Math.abs(v[0] - avg[0]) ** 2 / (Math.abs(v[0] - avg[0]) ** 2 + Math.abs(v[2] - avg[2]) ** 2));
        v[1] = v[1] - Math.sign(v[1] - avg[1]) * x;
        v[2] = v[2] - Math.sign(v[2] - avg[2]) * x * (Math.abs(v[2] - avg[2]) ** 2 / (Math.abs(v[0] - avg[0]) ** 2 + Math.abs(v[2] - avg[2]) ** 2));
    }
}

