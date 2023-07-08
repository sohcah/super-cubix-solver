import { H4, YStack } from "tamagui";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Pizza } from "../components/pizza.tsx";
import { Kite } from "../components/kite.tsx";
import { b, toRad } from "../components/shared.ts";
import { Weird } from "../components/weird.tsx";
import {
	Color,
	Cube,
	getColorValue,
	KitePiece,
	Piece,
	PizzaPiece,
} from "../models/cube.ts";

const padding = 0;

function PieceComponent({ piece, angle }: { piece: Piece; angle: number }) {
	const paddingOffset = Math.sqrt(1 + Math.abs(Math.sin(2 * angle)) ** 2);
	if (piece instanceof PizzaPiece) {
		return (
			<group rotation={[0, -angle - toRad(15), 0]}>
				<Pizza
					colors={{
						top: getColorValue(piece.top),
						side: getColorValue(piece.side),
					}}
					position={[0, 0, -padding * paddingOffset]}
				/>
			</group>
		);
	}
	if (piece instanceof KitePiece) {
		return (
			<group rotation={[0, -angle - toRad(30), 0]}>
				<Kite
					colors={{
						top: getColorValue(piece.top),
						left: getColorValue(piece.left),
						right: getColorValue(piece.right),
					}}
					position={[
						0,
						0,
						-padding * Math.sqrt(1 + Math.abs(Math.sin(2 * angle)) ** 2),
					]}
				/>
			</group>
		);
	}
	throw new Error("Unknown piece type");
}

export function HomeScreen() {
	const cube = new Cube();
	return (
		<YStack flex={1} bc="black">
			<H4>Welcome</H4>
			<Canvas style={{ flex: 1 }}>
				<OrbitControls enableDamping enablePan enableRotate enableZoom />
				<ambientLight intensity={1} />
				{/*<pointLight position={[10, 10, 10]} />*/}
				<group position={[0, +padding + b, 0]}>
					{cube.top.map((piece, index, array) => (
						<PieceComponent
							piece={piece}
							angle={array
								.slice(0, index)
								.reduce((a, b) => a + b.angleInRadians, 0)}
						/>
					))}
				</group>

				<group rotation={[cube.middle ? 0 : Math.PI, 0, 0]}>
					<group rotation={[0, (1 / 12) * Math.PI, 0]}>
						<Weird
							colors={{
								back: getColorValue(Color.Orange),
								side: getColorValue(Color.Yellow),
								front: getColorValue(Color.Red),
							}}
							position={[0, 0, 0]}
							rotation={[0, 0, 0]}
						/>
					</group>
				</group>
				<group rotation={[0, (1 / 12) * Math.PI, 0]}>
					<Weird
						colors={{
							back: getColorValue(Color.Red),
							side: getColorValue(Color.Blue),
							front: getColorValue(Color.Orange),
						}}
						position={[0, 0, 0]}
						rotation={[0, Math.PI, 0]}
					/>
				</group>

				<group position={[0, -padding - b, 0]} rotation={[0, Math.PI, Math.PI]}>
					{cube.bottom.map((piece, index, array) => (
						<PieceComponent
							piece={piece}
							angle={array
								.slice(0, index)
								.reduce((a, b) => a + b.angleInRadians, 0)}
						/>
					))}
				</group>
			</Canvas>
		</YStack>
	);
}
