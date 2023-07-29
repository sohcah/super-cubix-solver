import { MeshProps } from "@react-three/fiber";
import { adjust } from "./shared.ts";
import { useMemo } from "react";

export function Edge(
	props: MeshProps & {
		colors: {
			top: [number, number, number];
			side: [number, number, number];
		};
	},
) {
	const [positions, colors] = useMemo(() => {
		const p = {
			bottomFrontLeft: [-1, -1, -1],
			bottomFrontRight: [1, -1, -1],
			topFrontLeft: [-1, 1, -1],
			topFrontRight: [1, 1, -1],
			bottomBackLeft: [-1, -1, -3],
			bottomBackRight: [1, -1, -3],
			topBackLeft: [-1, 1, -3],
			topBackRight: [1, 1, -3],
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
				p.topBackLeft,
				p.topBackRight,
				p.topFrontRight,
				p.topFrontLeft,
				[0, 0, 1],
				props.colors.top,
			],
			// Back face
			[
				p.topBackRight,
				p.topBackLeft,
				p.bottomBackLeft,
				p.bottomBackRight,
				[0, -1, 0],
				props.colors.side,
			],
			// Front face
			[
				p.topFrontLeft,
				p.topFrontRight,
				p.bottomFrontRight,
				p.bottomFrontLeft,
				[0, -1, 0],
				[0, 0, 0],
			],
			// Left face
			[
				p.topBackLeft,
				p.topFrontLeft,
				p.bottomFrontLeft,
				p.bottomBackLeft,
				[-1, 0, 0],
				[0, 0, 0],
			],
			// Right face
			[
				p.topFrontRight,
				p.topBackRight,
				p.bottomBackRight,
				p.bottomFrontRight,
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
						.flat(),
				)
				.flat(),
		);
		const colors = new Float32Array(
			faces
				.flatMap((face) => new Array(3 * (face.length - 4)).fill(face.at(-1)))
				.flat(),
		);

		return [positions, colors];
	}, [props.colors]);
	return (
		<group scale={[1 / 3, 1 / 3, 1 / 3]}>
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
		</group>
	);
}
