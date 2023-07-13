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
