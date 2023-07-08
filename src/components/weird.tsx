import { MeshProps } from "@react-three/fiber";
import { a, b, x } from "./shared.ts";
import { useMemo } from "react";

export function Weird({
	...props
}: MeshProps & {
	colors: {
		back: [number, number, number];
		side: [number, number, number];
		front: [number, number, number];
	};
}) {
	const [positions, colors] = useMemo(() => {
		const padding = x * Math.SQRT1_2;
		const p = {
			bottomFrontLeft: [-b + padding / 2, -b, a - padding],
			bottomFrontRight: [a - padding, -b, a - padding],
			bottomBackLeft: [b + padding, -b, -a + padding],
			bottomBackRight: [a - padding, -b, -a + padding],
			topFrontLeft: [-b + padding / 2, b, a - padding],
			topFrontRight: [a - padding, b, a - padding],
			topBackLeft: [b + padding, b, -a + padding],
			topBackRight: [a - padding, b, -a + padding],
		};
		// adjust(p, x * 2 / 3, 1);

		const faces = [
			// [...Vertex[], Normal, Color]
			// Bottom face
			[
				p.bottomFrontLeft,
				p.bottomFrontRight,
				p.bottomBackRight,
				p.bottomBackLeft,
				[0, 0, 1],
				[0, 0, 0],
			],
			// Top face
			[
				p.topFrontLeft,
				p.topBackLeft,
				p.topBackRight,
				p.topFrontRight,
				[0, 0, 1],
				[0, 0, 0],
			],
			// Back face
			[
				p.bottomBackLeft,
				p.bottomBackRight,
				p.topBackRight,
				p.topBackLeft,
				[0, 0, 1],
				props.colors.back,
			],
			// Front face
			[
				p.bottomFrontLeft,
				p.topFrontLeft,
				p.topFrontRight,
				p.bottomFrontRight,
				[0, 0, 1],
				props.colors.front,
			],
			// Inner face
			[
				p.bottomFrontLeft,
				p.bottomBackLeft,
				p.topBackLeft,
				p.topFrontLeft,
				[0, 0, 1],
				[0, 0, 0],
			],
			// Outer face
			[
				p.bottomFrontRight,
				p.topFrontRight,
				p.topBackRight,
				p.bottomBackRight,
				[0, 0, 1],
				props.colors.side,
			],
		];

		const positions = new Float32Array(
			faces
				.flatMap((face) =>
					new Array(face.length - 4)
						.fill(0)
						.map((_, i) => [face[0], face[i + 1], face[i + 2]].reverse())
						.flat()
				)
				.flat()
		);
		const colors = new Float32Array(
			faces
				.flatMap((face) => new Array(3 * (face.length - 4)).fill(face.at(-1)))
				.flat()
		);

		return [positions, colors];
	}, [props.colors]);
	return (
		<mesh {...props}>
			<bufferGeometry onUpdate={(self) => self.computeVertexNormals()}>
				<bufferAttribute
					attach="attributes-position"
					array={positions}
					count={positions.length / 3}
					itemSize={3}
				/>
				<bufferAttribute
					attach="attributes-color"
					array={colors}
					count={colors.length / 3}
					itemSize={3}
				/>
			</bufferGeometry>

			<meshLambertMaterial vertexColors />
		</mesh>
	);
}
