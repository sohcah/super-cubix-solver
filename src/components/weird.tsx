import { MeshProps } from "@react-three/fiber";
import { a, adjust, b } from "./shared.ts";
import { useMemo } from "react";

export function Weird({
	padding,
	...props
}: MeshProps & {
	colors: {
		back: [number, number, number];
		side: [number, number, number];
		front: [number, number, number];
	};
	padding: number;
}) {
	const [positions, colors] = useMemo(() => {
		const p = {
			bottomFrontLeft: [-b, -b, a + padding],
			bottomFrontRight: [a + padding, -b, a + padding],
			bottomBackLeft: [b + padding, -b, -a - padding],
			bottomBackRight: [a + padding, -b, -a - padding],
			topFrontLeft: [-b, b, a + padding],
			topFrontRight: [a + padding, b, a + padding],
			topBackLeft: [b + padding, b, -a - padding],
			topBackRight: [a + padding, b, -a - padding],
		};
		adjust(p);

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
	}, [props.colors, padding]);
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
