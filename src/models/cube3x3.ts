import { Color } from "./colors.ts";

export abstract class Piece {
	static currentId = 0;

	id: number = Piece.currentId++;
}

export class EdgePiece extends Piece {
	top: Color;
	side: Color;

	constructor(top: Color, side: Color) {
		super();
		this.top = top;
		this.side = side;
	}
}

export class CornerPiece extends Piece {
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

export class Cube3x3 {
	static SOLVED_FULL_ID = 0x10123456789abcden;
	static currentId = 0;
	id = Cube3x3.currentId++;

	static DEFAULT_TOP = [
		new CornerPiece(Color.White, Color.Orange, Color.Blue),
		new EdgePiece(Color.White, Color.Blue),
		new CornerPiece(Color.White, Color.Blue, Color.Red),
		new EdgePiece(Color.White, Color.Red),
		new CornerPiece(Color.White, Color.Red, Color.Green),
		new EdgePiece(Color.White, Color.Green),
		new CornerPiece(Color.White, Color.Green, Color.Orange),
		new EdgePiece(Color.White, Color.Orange),
	];
	static DEFAULT_MIDDLE = [
		new EdgePiece(Color.Orange, Color.Blue),
		new EdgePiece(Color.Blue, Color.Red),
		new EdgePiece(Color.Red, Color.Green),
		new EdgePiece(Color.Green, Color.Orange),
	];
	middle: Piece[] = Cube3x3.DEFAULT_MIDDLE;
	top: Piece[] = Cube3x3.DEFAULT_TOP;
	static DEFAULT_BOTTOM = [
		new CornerPiece(Color.Yellow, Color.Red, Color.Blue),
		new EdgePiece(Color.Yellow, Color.Blue),
		new CornerPiece(Color.Yellow, Color.Blue, Color.Orange),
		new EdgePiece(Color.Yellow, Color.Orange),
		new CornerPiece(Color.Yellow, Color.Orange, Color.Green),
		new EdgePiece(Color.Yellow, Color.Green),
		new CornerPiece(Color.Yellow, Color.Green, Color.Red),
		new EdgePiece(Color.Yellow, Color.Red),
	];
	bottom: Piece[] = Cube3x3.DEFAULT_BOTTOM;

	//"wobwbwbrwrwrgwgwgowo-obbrrggo-yrbybyboyoyogygygryr"

	static COLOUR_MAP = {
		w: Color.White,
	};

	// constructor(pieces?: string) {
	// 	if (pieces) {
	// 		pieces = pieces.replace(/_/g, "");
	// 		let allPieces = [...Cube3x3.DEFAULT_TOP, ...Cube3x3.DEFAULT_MIDDLE, ...Cube3x3.DEFAULT_BOTTOM];
	// 		this.top = [];
	// 		this.middle = [];
	// 		this.bottom = [];
	// 		let i = 0;
	// 		for (const count = 0; count<3;count++) {
	//
	// 		}
	//
	// 	}
	// }

	cloneWith(fn: (cube: Cube3x3) => void) {
		const cube = new Cube3x3();
		cube.top = this.top;
		cube.middle = this.middle;
		cube.bottom = this.bottom;
		fn(cube);
		return cube;
	}

	// rotate(position: "top" | "bottom", antiClockwise: boolean): State {
	//
	// }
}

export type State = [
	currentCube: Cube3x3,
	movingPieces: Set<Piece>,
	rotation: [number, number, number],
	movingMiddle: boolean,
	previousCube: Cube3x3,
];
