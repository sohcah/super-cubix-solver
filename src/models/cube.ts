export abstract class Piece {
    public abstract get angle(): number;
    public get angleInRadians() {
        return this.angle * Math.PI / 180;
    }
}

export enum Color {
    White = "white",
    Green = "green",
    Orange = "orange",
    Yellow = "yellow",
    Red = "red",
    Blue = "blue"
}

export function getColorValue(color: Color): [number, number, number] {
    switch (color) {
        case Color.White:
            return [1, 1, 1];
        case Color.Green:
            return [0, 1, 0];
        case Color.Orange:
            return [1, 0.1, 0];
        case Color.Yellow:
            return [1, 1, 0];
        case Color.Red:
            return [1, 0, 0];
        case Color.Blue:
            return [0, 0, 1];

    }
}

export class PizzaPiece extends Piece {
    get angle(){
        return 30
    }
    top: Color;
    side: Color;
    constructor(top: Color, side: Color) {
        super();
        this.top = top;
        this.side = side;
    }
}

export class KitePiece extends Piece {
    get angle() {
        return 60
    }

    top: Color;
    left: Color;
    right: Color;

    constructor(top: Color, left: Color, right: Color) {
        super();
        this.top = top;
        this.left = left;
        this.right = right;
    }
}
export class Cube {
    middle = false;
    top: Piece[] = [
        new KitePiece(Color.White, Color.Blue, Color.Orange),
        new KitePiece(Color.White, Color.Orange, Color.Yellow),
        new PizzaPiece(Color.White, Color.Yellow),
        new KitePiece(Color.White, Color.Yellow, Color.Red),
        new PizzaPiece(Color.White, Color.Red),
        new KitePiece(Color.White, Color.Red, Color.Blue),
        new PizzaPiece(Color.White, Color.Blue),
        new PizzaPiece(Color.White, Color.Orange),
    ];
    bottom: Piece[] = [
        new PizzaPiece(Color.Green, Color.Red),
        new KitePiece(Color.Green, Color.Red, Color.Yellow),
        new PizzaPiece(Color.Green, Color.Yellow),
        new KitePiece(Color.Green, Color.Yellow, Color.Orange),
        new PizzaPiece(Color.Green, Color.Orange),
        new KitePiece(Color.Green, Color.Orange, Color.Blue),
        new PizzaPiece(Color.Green, Color.Blue),
        new KitePiece(Color.Green, Color.Blue, Color.Red),
    ];
    cloneWith(fn: (cube: Cube) => void) {
        const cube = new Cube();
        cube.top = this.top;
        cube.middle = this.middle;
        cube.bottom = this.bottom;
        fn(cube);
        return cube;
    }
}
