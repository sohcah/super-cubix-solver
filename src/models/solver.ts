import { CubeSquare1 } from "./cubeSquare1.ts";

export function solveForCube(cube: CubeSquare1) {
	const expectedRotationlessShapeId = new CubeSquare1().rotationlessShapeId;

	const queue: [CubeSquare1, string[]][] = [[cube, []]];

	const visited = new Set<number>();

	let attempts = 0;
	while (queue.length) {
		attempts++;
		if (attempts > 100000) {
			throw new Error("Too many attempts");
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const [currentCube, moves] = queue.shift()!;

		if (currentCube.rotationlessShapeId === expectedRotationlessShapeId) {
			return moves;
		}

		if (visited.has(currentCube.rotationlessShapeId)) {
			continue;
		}

		visited.add(currentCube.rotationlessShapeId);

		let topRotations = -1;
		for (let topIndex = currentCube.top.length; topIndex > 0; topIndex--) {
			let topPossible = false;
			let bottomRotations = -1;
			for (
				let bottomIndex = currentCube.bottom.length;
				bottomIndex > 0;
				bottomIndex--
			) {
				const newCube = currentCube.swap(topIndex, bottomIndex);
				if (newCube) {
					bottomRotations++;
					if (!topPossible) {
						topRotations++;
						topPossible = true;
					}
					queue.push([
						newCube,
						[...moves, `${topRotations},${bottomRotations}`],
					]);
				}
			}
		}
	}
}

export function solveForColours(cube: CubeSquare1) {
	const expectedRotationlessId = new CubeSquare1().rotationlessId;

	const queue: [CubeSquare1, string[]][] = [[cube, []]];

	const visited = new Set<bigint>();

	let attempts = 0;
	while (queue.length) {
		attempts++;
		if (attempts > 100000) {
			throw new Error("Too many attempts");
		}
		if (attempts % 1000 === 0) {
			console.log(attempts);
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const [currentCube, moves] = queue.shift()!;

		if (currentCube.rotationlessId === expectedRotationlessId) {
			return moves;
		}

		if (visited.has(currentCube.rotationlessId)) {
			continue;
		}

		visited.add(currentCube.rotationlessId);

		let topRotations = -1;
		for (let topIndex = currentCube.top.length; topIndex > 0; topIndex--) {
			let topPossible = false;
			let bottomRotations = -1;
			for (
				let bottomIndex = currentCube.bottom.length;
				bottomIndex > 0;
				bottomIndex--
			) {
				const newCube = currentCube.swap(topIndex, bottomIndex);
				if (newCube) {
					bottomRotations++;
					if (!topPossible) {
						topRotations++;
						topPossible = true;
					}
					queue.push([
						newCube,
						[...moves, `${topRotations},${bottomRotations}`],
					]);
				}
			}
		}
	}
}
