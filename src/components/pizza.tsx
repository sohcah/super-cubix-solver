import { MeshProps } from "@react-three/fiber";
import { a, b, c } from "./shared.ts";

const p = {
	bottomFront: [0, 0, 0],
	topFront: [0, +c, 0],
	bottomLeft: [-b, 0, -a],
	topLeft: [-b, +c, -a],
	bottomRight: [+b, 0, -a],
	topRight: [+b, +c, -a],
};

const faces = [
	// [...Vertex[], Normal, Color]
	// Bottom face
	[p.bottomRight, p.bottomLeft, p.bottomFront, [0, 0, 1], [1, 0, 0]],
	// Top face
	[p.topLeft, p.topRight, p.topFront, [0, 0, 1], [0, 1, 0]],
	// Back face
	[p.bottomRight, p.topRight, p.topLeft, p.bottomLeft, [0, -1, 0], [0, 0, 1]],
	// Left face
	[p.bottomLeft, p.topLeft, p.topFront, p.bottomFront, [-1, 0, 0], [0, 1, 1]],
	// Right face
	[p.bottomFront, p.topFront, p.topRight, p.bottomRight, [-1, 0, 0], [1, 0, 1]],
];

const positions = new Float32Array(
	faces
		.flatMap((face) =>
			new Array(face.length - 4)
				.fill(0)
				.map((_, i) => [face[0], face[i + 1], face[i + 2]])
				.flat()
		)
		.flat()
);
const normals = new Float32Array(
	faces
		.flatMap((face) => new Array(3 * (face.length - 4)).fill(face.at(-2)))
		.flat()
);
const colors = new Float32Array(
	faces
		.flatMap((face) => new Array(3 * (face.length - 4)).fill(face.at(-1)))
		.flat()
);

export function Pizza(props: MeshProps) {
	return (
		<mesh scale={[1, -1, 1]} {...props}>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					array={positions}
					count={positions.length / 3}
					itemSize={3}
				/>
				<bufferAttribute
					attach="attributes-normal"
					array={normals}
					count={normals.length / 3}
					itemSize={3}
				/>
				<bufferAttribute
					attach="attributes-color"
					array={colors}
					count={colors.length / 3}
					itemSize={3}
				/>
			</bufferGeometry>

			<meshStandardMaterial
				// side={THREE.DoubleSide}
				vertexColors
			/>
		</mesh>
	);
}
