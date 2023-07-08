import { toRad } from "../components/shared.ts";

export abstract class Piece {
	static currentId = 0;

	public abstract get angle(): number;

	public get angleInRadians() {
		return (this.angle * Math.PI) / 180;
	}

	id: number = Piece.currentId++;
}

export enum Color {
	White = "white",
	Green = "green",
	Orange = "orange",
	Yellow = "yellow",
	Red = "red",
	Blue = "blue",
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
	get angle() {
		return 30;
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
		return 60;
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
	static currentId = 0;
	id = Cube.currentId++;
	middle = true;
	top: Piece[] = [
		new KitePiece(Color.White, Color.Orange, Color.Yellow),
		new PizzaPiece(Color.White, Color.Yellow),
		new KitePiece(Color.White, Color.Yellow, Color.Red),
		new PizzaPiece(Color.White, Color.Red),
		new KitePiece(Color.White, Color.Red, Color.Blue),
		new PizzaPiece(Color.White, Color.Blue),
		new KitePiece(Color.White, Color.Blue, Color.Orange),
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

	getSliceIndex(position: "top" | "bottom") {
		let sum = 0;
		let index = 0;
		for (const piece of this[position]) {
			sum += piece.angle;
			index++;
			if (sum >= 180) {
				break;
			}
		}
		if (sum > 180) {
			alert("sum is greater than 180");
			throw new Error("sum is greater than 180");
		}
		return index;
	}

	moveMiddle(): State {
		const topSliceIndex = this.getSliceIndex("top");
		const bottomSliceIndex = this.getSliceIndex("bottom");
		const newCube = this.cloneWith((cube) => {
			cube.top = [
				...this.bottom.slice(0, bottomSliceIndex),
				...this.top.slice(topSliceIndex),
			];
			cube.middle = !this.middle;
			cube.bottom = [
				...this.top.slice(0, topSliceIndex),
				...this.bottom.slice(bottomSliceIndex),
			];
		});
		return [
			newCube,
			new Set([
				...this.top.slice(0, topSliceIndex),
				...this.bottom.slice(0, bottomSliceIndex),
			]),
			[-Math.PI, 0, 0],
			true,
			this,
		];
	}

	rotate(position: "top" | "bottom", antiClockwise: boolean): State {
		const moveIndex = this[position][
			antiClockwise ? "findIndex" : "findLastIndex"
		]((_, index) => {
			if (index === 0) return false;
			let sum = 0;
			for (let i = 0; i < this[position].length; i++) {
				sum += this[position][(i + index) % this[position].length].angle;
				if (sum === 180) return true;
				if (sum > 180) return false;
			}
			return false;
		});
		const newCube = this.cloneWith((cube) => {
			cube[position] = [
				...this[position].slice(moveIndex),
				...this[position].slice(0, moveIndex),
			];
		});
		return [
			newCube,
			new Set(newCube[position]),
			[
				0,
				toRad(
					this[position].slice(0, moveIndex).reduce((a, b) => a + b.angle, 0)
				) + (!antiClockwise ? -2 * Math.PI : 0),
				0,
			],
			false,
			this,
		];
	}

	get shapeId() {
		let id = 0;
		let value = 16384;
		if (!this.middle) {
			id += 32768
		}
		for (const piece of this.top) {
			if (piece instanceof PizzaPiece) {
				id += value
			}
			value /= 2;
		}
		for (const piece of this.bottom.slice(0,-1)) {
			if (piece instanceof PizzaPiece) {
				id += value
			}
			value /= 2;
		}

		return id;
	}

}

export type State = [
	currentCube: Cube,
	movingPieces: Set<Piece>,
	rotation: [number, number, number],
	movingMiddle: boolean,
	previousCube: Cube
];
