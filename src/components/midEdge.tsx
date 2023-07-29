import { MeshProps } from "@react-three/fiber";
import { adjust } from "./shared.ts";
import { useMemo } from "react";

export function MidEdge(
	props: MeshProps & {
		colors: {
			left: [number, number, number];
			right: [number, number, number];
		};
	},
) {
	const [positions, colors] = useMemo(() => {
		const p = {
			bottomFront: [0, -1, -1],
			topFront: [0, 1, -1],
			bottomBack: [0, -1, -3],
			topBack: [0, 1, -3],
			bottomLeft: [-1, -1, -2],
			topLeft: [-1, 1, -2],
			bottomRight: [1, -1, -2],
			topRight: [1, 1, -2],
		};
		adjust(p);
		const faces = [
			// [...Vertex[], Normal, Color]
			// Bottom face
			[
				p.bottomBack,
				p.bottomLeft,
				p.bottomFront,
				p.bottomRight,
				[0, -1, 0],
				[0, 0, 0],
			],
			// Top face
			[p.topFront, p.topLeft, p.topBack, p.topRight, [0, 0, 1], [0, 0, 0]],
			// Back left face
			[
				p.bottomBack,
				p.topBack,
				p.topLeft,
				p.bottomLeft,
				[-Math.SQRT1_2, 0, Math.SQRT1_2],
				props.colors.left,
			],
			// Back right face
			[
				p.bottomRight,
				p.topRight,
				p.topBack,
				p.bottomBack,
				[Math.SQRT1_2, 0, Math.SQRT1_2],
				props.colors.right,
			],
			// Front left
			[
				p.bottomLeft,
				p.topLeft,
				p.topFront,
				p.bottomFront,
				[-Math.SQRT1_2, 0, -Math.SQRT1_2],
				[0, 0, 0],
			],
			// Front right
			[
				p.bottomFront,
				p.topFront,
				p.topRight,
				p.bottomRight,
				[Math.SQRT1_2, 0, -Math.SQRT1_2],
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
		<group scale={[Math.sqrt(2) / 3, 1 / 3, Math.sqrt(2) / 3]}>
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
		</group>
	);
}
