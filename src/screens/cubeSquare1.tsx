import { Button, XStack, YStack } from "tamagui";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Pizza } from "../components/pizza.tsx";
import { Kite } from "../components/kite.tsx";
import { b, toRad } from "../components/shared.ts";
import { Weird } from "../components/weird.tsx";
import {
	CubeSquare1,
	KitePiece,
	Piece,
	PizzaPiece,
	State,
} from "../models/cubeSquare1.ts";
import { ReactNode, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Redo, Undo } from "@tamagui/lucide-icons";
import { solveForColours, solveForCube } from "../models/solver.ts";
import { Color, getColorValue } from "../models/colors.ts";

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

export function CubeDisplay({
	state: [, movingPieces, rotation, movingMiddle, cube],
}: {
	state: State;
}) {
	const animation = useSpring({
		rotationX: 0,
		rotationY: 0,
		rotationZ: 0,
	});
	const [previousRotation, setPreviousRotation] = useState<
		[number, number, number]
	>([0, 0, 0]);
	if (rotation !== previousRotation) {
		animation.rotationX.start(rotation[0]);
		animation.rotationY.start(rotation[1]);
		animation.rotationZ.start(rotation[2]);
		setPreviousRotation(rotation);
	}

	const Moving = ({
		piece,
		children,
	}: {
		piece: Piece;
		children: ReactNode;
	}) => {
		const moving = movingPieces.has(piece);
		return (
			<animated.group
				rotation-x={moving ? animation.rotationX : 0}
				rotation-y={moving ? animation.rotationY : 0}
				rotation-z={moving ? animation.rotationZ : 0}
			>
				{children}
			</animated.group>
		);
	};

	return (
		<>
			{/*<pointLight position={[10, 10, 10]} />*/}
			{cube.top.map((piece, index, array) => (
				<Moving piece={piece}>
					<group position={[0, +padding + b, 0]}>
						<PieceComponent
							key={piece.id}
							piece={piece}
							angle={array
								.slice(0, index)
								.reduce((a, b) => a + b.angleInRadians, 0)}
						/>
					</group>
				</Moving>
			))}
			<animated.group
				rotation-x={movingMiddle ? animation.rotationX : 0}
				rotation-y={movingMiddle ? animation.rotationY : 0}
				rotation-z={movingMiddle ? animation.rotationZ : 0}
			>
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
			</animated.group>
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

			<group rotation={[0, Math.PI, Math.PI]}>
				{cube.bottom.map((piece, index, array) => (
					<Moving piece={piece}>
						<group position={[0, padding + b, 0]}>
							<PieceComponent
								key={piece.id}
								piece={piece}
								angle={array
									.slice(0, index)
									.reduce((a, b) => a + b.angleInRadians, 0)}
							/>
						</group>
					</Moving>
				))}
			</group>
		</>
	);
}

const initialCube = new CubeSquare1("kpkpkpkp_pkpkpkpk");

export function CubeSquare1Screen() {
	const [state, setState] = useState<State>(() => [
		initialCube,
		new Set([]),
		[0, 0, 0],
		false,
		initialCube,
	]);

	// console.table({
	// 	full: state[0].fullId.toString(16).padStart(16, "0"),
	// 	rotationless: state[0].rotationlessId.toString(16).padStart(16, "0"),
	// 	shape: state[0].shapeId.toString(2).padStart(16, "0"),
	// 	rotationlessShape: state[0].rotationlessShapeId.toString(2).padStart(16, "0"),
	// })

	return (
		<YStack flex={1} bc="$color8">
			<XStack
				p="$2"
				bc="background"
				borderRadius="$4"
				alignSelf="center"
				flexWrap="wrap"
				justifyContent="center"
				gap="$2"
				position="absolute"
				top="$2"
				zIndex={1}
			>
				<XStack gap="$2">
					<Button
						icon={Undo}
						onPress={() => {
							setState(state[0].rotate("top", true));
						}}
					>
						Top
					</Button>
					<Button
						icon={Redo}
						onPress={() => {
							setState(state[0].rotate("top", false));
						}}
					>
						Top
					</Button>
					<Button
						onPress={() => {
							console.log(solveForCube(state[0]));
						}}
					>
						Solve
					</Button>
					<Button
						onPress={() => {
							console.log(solveForColours(state[0]));
						}}
					>
						Solve2
					</Button>
				</XStack>
				<Button
					icon={Redo}
					onPress={() => {
						setState(state[0].moveMiddle());
					}}
				>
					Middle
				</Button>
				<XStack gap="$2">
					<Button
						icon={Undo}
						onPress={() => {
							setState(state[0].rotate("bottom", true));
						}}
					>
						Bottom
					</Button>
					<Button
						icon={Redo}
						onPress={() => {
							setState(state[0].rotate("bottom", false));
						}}
					>
						Bottom
					</Button>
				</XStack>
			</XStack>
			<Canvas style={{ flex: 1 }}>
				<OrbitControls enableDamping enablePan enableRotate enableZoom />
				<ambientLight intensity={1} />
				<CubeDisplay key={state[0].id} state={state} />
			</Canvas>
		</YStack>
	);
}
