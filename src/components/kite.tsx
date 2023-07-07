import { MeshProps } from "@react-three/fiber";
import { c, e, f, g } from "./shared.ts";
import { useMemo } from "react";

const p = {
	bottomFront: [0, 0, 0],
	topFront: [0, c, 0],
	bottomBack: [0, 0, -f],
	topBack: [0, c, -f],
	bottomLeft: [-e, 0, -g],
	topLeft: [-e, c, -g],
	bottomRight: [+e, 0, -g],
	topRight: [+e, c, -g],
};

export function Kite(
	props: MeshProps & {
		colors: {
			top: [number, number, number];
			left: [number, number, number];
			right: [number, number, number];
		};
	}
) {
	const [positions, colors] = useMemo(() => {
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
			[
				p.topFront,
				p.topLeft,
				p.topBack,
				p.topRight,
				[0, 0, 1],
				props.colors.top,
			],
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
