import { MeshProps } from "@react-three/fiber";
import { a, adjust, b, c } from "./shared.ts";
import { useMemo } from "react";

export function Pizza({
	angle,
	...props
}: MeshProps & {
	colors: {
		top: [number, number, number];
		side: [number, number, number];
	};
	angle: number;
}) {
	const [positions, colors] = useMemo(() => {
		const p = {
			bottomFront: [0, 0, 0],
			topFront: [0, c, 0],
			bottomLeft: [-b, 0, -a],
			topLeft: [-b, c, -a],
			bottomRight: [+b, 0, -a],
			topRight: [+b, c, -a],
		};
		adjust(p, angle);

		const faces = [
			// [...Vertex[], Normal, Color]
			// Bottom face
			[p.bottomRight, p.bottomLeft, p.bottomFront, [0, 0, 1], [0, 0, 0]],
			// Top face
			[p.topLeft, p.topRight, p.topFront, [0, 0, 1], props.colors.top],
			// Back face
			[
				p.bottomRight,
				p.topRight,
				p.topLeft,
				p.bottomLeft,
				[0, -1, 0],
				props.colors.side,
			],
			// Left face
			[
				p.bottomLeft,
				p.topLeft,
				p.topFront,
				p.bottomFront,
				[-1, 0, 0],
				[0, 0, 0],
			],
			// Right face
			[
				p.bottomFront,
				p.topFront,
				p.topRight,
				p.bottomRight,
				[-1, 0, 0],
				[0, 0, 0],
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
	}, [props.colors, angle]);
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

			<meshPhysicalMaterial
				// side={THREE.DoubleSide}
				vertexColors
			/>
		</mesh>
	);
}
