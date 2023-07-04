import {MeshProps} from "@react-three/fiber";
import {c, e, f, g} from "./shared.ts";

const p = {
    bottomFront: [0, 0, 0],
    topFront: [0, +c, 0],
    bottomBack: [0, 0, -f],
    topBack: [0, +c, -f],
    bottomLeft: [-e, 0, -g],
    topLeft: [-e, +c, -g],
    bottomRight: [+e, 0, -g],
    topRight: [+e, +c, -g],
};

const faces = [
    // [...Vertex[], Normal, Color]
    // Bottom face
    [p.bottomBack, p.bottomLeft, p.bottomFront, p.bottomRight, [0, 0, 1], [1, 0, 0]],
    // Top face
    [p.topFront, p.topLeft, p.topBack, p.topRight, [0, 0, 1], [0, 1, 0]],
    // Back left face
    [p.bottomBack, p.topBack, p.topLeft, p.bottomLeft, [-1, 0, 0], [0, 0, 1]],
    // Back right face
    [p.bottomRight, p.topRight, p.topBack, p.bottomBack, [-1, 0, 0], [0, 1, 1]],
    // Front left
    [p.bottomLeft, p.topLeft, p.topFront, p.bottomFront, [1, 0, 0], [1, 0, 1]],
    // Front right
    [p.bottomFront, p.topFront, p.topRight, p.bottomRight, [1, 0, 0], [1, 1, 0]],
];

const positions = new Float32Array(faces.flatMap(face => new Array(face.length - 4).fill(0).map((_, i) => [face[0], face[i + 1], face[i + 2]]).flat()).flat());
const normals = new Float32Array(faces.flatMap(face => new Array(3 * (face.length - 4)).fill(face.at(-2))).flat());
const colors = new Float32Array(faces.flatMap(face => new Array(3 * (face.length - 4)).fill(face.at(-1))).flat());

export function Kite(props: MeshProps) {
    return (
        <mesh
            scale={[1, -1, 1]}
            {...props}
        >
            <bufferGeometry>
                <bufferAttribute
                    attach='attributes-position'
                    array={positions}
                    count={positions.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach='attributes-normal'
                    array={normals}
                    count={normals.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach='attributes-color'
                    array={colors}
                    count={colors.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>

            <meshStandardMaterial
                // side={THREE.DoubleSide}
                vertexColors/>
        </mesh>
    )
}
