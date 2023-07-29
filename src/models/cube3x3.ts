import { Color } from "./colors.ts";
import { toRad } from "../components/shared.ts";

type Tuple<T, N extends number> = N extends N
	? number extends N
		? T[]
		: _TupleOf<T, N, []>
	: never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
	? R
	: _TupleOf<T, N, [T, ...R]>;

export class PieceData<N extends number> {
	static currentId = 0;
	colors: Tuple<Color, N>;

	constructor(colors: Tuple<Color, N>) {
		this.colors = colors;
	}

	id: number = PieceData.currentId++;
}

export abstract class Piece<N extends number> {
	protected pieceData: PieceData<N>;

	protected constructor(pieceData: PieceData<N>) {
		this.pieceData = pieceData;
	}

	public get pieceId(): number {
		return this.pieceData.id;
	}

	protected get colors() {
		return this.pieceData.colors;
	}
}

export abstract class RotatablePiece<N extends number> extends Piece<N> {
	public rotation;

	constructor(pieceData: PieceData<N>, rotation = 0) {
		super(pieceData);
		this.rotation = rotation;
	}

	protected getColor(index: number) {
		return this.colors[
			(((index + this.rotation) % this.colors.length) + this.colors.length) %
				this.colors.length
		];
	}
}

export class EdgePiece extends RotatablePiece<2> {
	static Data = {
		WhiteBlue: new PieceData<2>([Color.White, Color.Blue]),
		WhiteRed: new PieceData<2>([Color.White, Color.Red]),
		WhiteGreen: new PieceData<2>([Color.White, Color.Green]),
		WhiteOrange: new PieceData<2>([Color.White, Color.Orange]),
		YellowRed: new PieceData<2>([Color.Yellow, Color.Red]),
		YellowBlue: new PieceData<2>([Color.Yellow, Color.Blue]),
		YellowOrange: new PieceData<2>([Color.Yellow, Color.Orange]),
		YellowGreen: new PieceData<2>([Color.Yellow, Color.Green]),

		OrangeBlue: new PieceData<2>([Color.Orange, Color.Blue]),
		BlueRed: new PieceData<2>([Color.Blue, Color.Red]),
		RedGreen: new PieceData<2>([Color.Red, Color.Green]),
		GreenOrange: new PieceData<2>([Color.Green, Color.Orange]),
	};

	get top() {
		return this.getColor(0);
	}

	get side() {
		return this.getColor(1);
	}

	cloneWith(fn: (piece: EdgePiece) => void) {
		const piece = new EdgePiece(this.pieceData);
		piece.rotation = this.rotation;
		fn(piece);
		return piece;
	}
}

export class CornerPiece extends RotatablePiece<3> {
	static Data = {
		WhiteOrangeBlue: new PieceData<3>([Color.White, Color.Orange, Color.Blue]),
		WhiteBlueRed: new PieceData<3>([Color.White, Color.Blue, Color.Red]),
		WhiteRedGreen: new PieceData<3>([Color.White, Color.Red, Color.Green]),
		WhiteGreenOrange: new PieceData<3>([
			Color.White,
			Color.Green,
			Color.Orange,
		]),
		YellowGreenRed: new PieceData<3>([Color.Yellow, Color.Green, Color.Red]),
		YellowRedBlue: new PieceData<3>([Color.Yellow, Color.Red, Color.Blue]),
		YellowBlueOrange: new PieceData<3>([
			Color.Yellow,
			Color.Blue,
			Color.Orange,
		]),
		YellowOrangeGreen: new PieceData<3>([
			Color.Yellow,
			Color.Orange,
			Color.Green,
		]),
	};

	get top() {
		return this.getColor(0);
	}

	get left() {
		return this.getColor(1);
	}

	get right() {
		return this.getColor(2);
	}

	cloneWith(fn: (piece: CornerPiece) => void) {
		const piece = new CornerPiece(this.pieceData);
		piece.rotation = this.rotation;
		fn(piece);
		return piece;
	}
}

export type AnyPiece = CornerPiece | EdgePiece;

export class Cube3x3 {
	static currentId = 0;
	id = Cube3x3.currentId++;

	static DEFAULT_TOP = [
		new CornerPiece(CornerPiece.Data.WhiteOrangeBlue),
		new EdgePiece(EdgePiece.Data.WhiteBlue),
		new CornerPiece(CornerPiece.Data.WhiteBlueRed),
		new EdgePiece(EdgePiece.Data.WhiteRed),
		new CornerPiece(CornerPiece.Data.WhiteRedGreen),
		new EdgePiece(EdgePiece.Data.WhiteGreen),
		new CornerPiece(CornerPiece.Data.WhiteGreenOrange),
		new EdgePiece(EdgePiece.Data.WhiteOrange),
	];
	static DEFAULT_MIDDLE = [
		new EdgePiece(EdgePiece.Data.OrangeBlue),
		new EdgePiece(EdgePiece.Data.BlueRed),
		new EdgePiece(EdgePiece.Data.RedGreen),
		new EdgePiece(EdgePiece.Data.GreenOrange),
	];
	middle: AnyPiece[] = Cube3x3.DEFAULT_MIDDLE;
	top: AnyPiece[] = Cube3x3.DEFAULT_TOP;
	static DEFAULT_BOTTOM = [
		new CornerPiece(CornerPiece.Data.YellowGreenRed),
		new EdgePiece(EdgePiece.Data.YellowRed),
		new CornerPiece(CornerPiece.Data.YellowRedBlue),
		new EdgePiece(EdgePiece.Data.YellowBlue),
		new CornerPiece(CornerPiece.Data.YellowBlueOrange),
		new EdgePiece(EdgePiece.Data.YellowOrange),
		new CornerPiece(CornerPiece.Data.YellowOrangeGreen),
		new EdgePiece(EdgePiece.Data.YellowGreen),
	];
	bottom: AnyPiece[] = Cube3x3.DEFAULT_BOTTOM;

	get front() {
		return [
			this.top[6].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[5].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[4].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[2].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[0].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[7].cloneWith((r) => {
				r.rotation--;
			}),
			this.bottom[6].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[3],
		];
	}
	set front(pieces: AnyPiece[]) {
		this.top[6] = pieces[0].cloneWith((r) => {
			r.rotation--;
		});
		this.top[5] = pieces[1].cloneWith((r) => {
			r.rotation--;
		});
		this.top[4] = pieces[2].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[2] = pieces[3].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[0] = pieces[4].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[7] = pieces[5].cloneWith((r) => {
			r.rotation++;
		});
		this.bottom[6] = pieces[6].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[3] = pieces[7];
	}

	get back() {
		return [
			this.top[2].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[1].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[0].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[0].cloneWith((r) => {
				r.rotation--;
			}),
			this.bottom[4].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[3].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[2].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[1],
		];
	}

	set back(pieces: AnyPiece[]) {
		this.top[2] = pieces[0].cloneWith((r) => {
			r.rotation--;
		});
		this.top[1] = pieces[1].cloneWith((r) => {
			r.rotation--;
		});
		this.top[0] = pieces[2].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[0] = pieces[3].cloneWith((r) => {
			r.rotation++;
		});
		this.bottom[4] = pieces[4].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[3] = pieces[5].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[2] = pieces[6].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[1] = pieces[7];
	}

	get left() {
		return [
			this.top[0].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[7].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[6].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[3].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[6].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[5].cloneWith((r) => {
				r.rotation--;
			}),
			this.bottom[4].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[0],
		];
	}

	set left(pieces: AnyPiece[]) {
		this.top[0] = pieces[0].cloneWith((r) => {
			r.rotation--;
		});
		this.top[7] = pieces[1].cloneWith((r) => {
			r.rotation--;
		});
		this.top[6] = pieces[2].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[3] = pieces[3].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[6] = pieces[4].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[5] = pieces[5].cloneWith((r) => {
			r.rotation++;
		});
		this.bottom[4] = pieces[6].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[0] = pieces[7];
	}

	get right() {
		return [
			this.top[4].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[3].cloneWith((r) => {
				r.rotation++;
			}),
			this.top[2].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[1].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[2].cloneWith((r) => {
				r.rotation++;
			}),
			this.bottom[1].cloneWith((r) => {
				r.rotation--;
			}),
			this.bottom[0].cloneWith((r) => {
				r.rotation--;
			}),
			this.middle[2],
		];
	}

	set right(pieces: AnyPiece[]) {
		this.top[4] = pieces[0].cloneWith((r) => {
			r.rotation--;
		});
		this.top[3] = pieces[1].cloneWith((r) => {
			r.rotation--;
		});
		this.top[2] = pieces[2].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[1] = pieces[3].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[2] = pieces[4].cloneWith((r) => {
			r.rotation--;
		});
		this.bottom[1] = pieces[5].cloneWith((r) => {
			r.rotation++;
		});
		this.bottom[0] = pieces[6].cloneWith((r) => {
			r.rotation++;
		});
		this.middle[2] = pieces[7];
	}

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
		cube.top = [...this.top];
		cube.middle = [...this.middle];
		cube.bottom = [...this.bottom];
		fn(cube);
		return cube;
	}

	rotate(
		position: "top" | "bottom" | "front" | "back" | "left" | "right",
		antiClockwise: boolean,
	): State {
		const newCube = this.cloneWith((cube) => {
			if (antiClockwise) {
				cube[position] = [
					...this[position].slice(2),
					...this[position].slice(0, 2),
				];
			} else {
				cube[position] = [
					...this[position].slice(6),
					...this[position].slice(0, 6),
				];
			}
		});
		return [
			newCube,
			new Set(newCube[position].map((i) => i.pieceId)),
			[
				["left", "right"].includes(position)
					? toRad(90) * (antiClockwise === (position === "right") ? 1 : -1)
					: 0,
				["top", "bottom"].includes(position)
					? toRad(90) * (antiClockwise === (position === "top") ? 1 : -1)
					: 0,
				["front", "back"].includes(position)
					? toRad(90) * (antiClockwise === (position === "front") ? 1 : -1)
					: 0,
			],
			this,
		];
	}
}

export type State = [
	currentCube: Cube3x3,
	movingPieces: Set<number>,
	rotation: [number, number, number],
	previousCube: Cube3x3,
	allRotation?: [number, number, number],
];
