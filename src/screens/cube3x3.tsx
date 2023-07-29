import { Button, XStack, YStack } from "tamagui";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Edge } from "../components/edge.tsx";
import { Corner } from "../components/corner.tsx";
import { toRad, x } from "../components/shared.ts";
import {
	Cube3x3,
	CornerPiece,
	EdgePiece,
	State,
	AnyPiece,
} from "../models/cube3x3.ts";
import { ReactNode, useState } from "react";
import { useSpring, animated, SpringValue } from "@react-spring/three";
import { Redo, Undo } from "@tamagui/lucide-icons";
import { getColorValue } from "../models/colors.ts";
import { MidEdge } from "../components/midEdge.tsx";

const padding = 0;

function PieceComponent({
	piece,
	angle,
	middle,
}: {
	piece: AnyPiece;
	angle: number;
	middle?: boolean;
}) {
	const paddingOffset = Math.sqrt(1 + Math.abs(Math.sin(2 * angle)) ** 2);
	if (piece instanceof EdgePiece && middle) {
		return (
			<group rotation={[0, -angle, 0]}>
				<MidEdge
					colors={{
						left: getColorValue(piece.top),
						right: getColorValue(piece.side),
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
	if (piece instanceof EdgePiece) {
		return (
			<group rotation={[0, -angle, 0]}>
				<group rotation={middle ? [0, -Math.PI / 4, 0] : undefined}>
					<group
						position={middle ? [-Math.SQRT1_2 + (5 / 3) * x, 0, 0] : undefined}
					>
						<group
							rotation={
								middle ? [Math.PI, Math.PI, (3 * Math.PI) / 2] : undefined
							}
						>
							<Edge
								colors={{
									top: getColorValue(piece.top),
									side: getColorValue(piece.side),
								}}
								position={[0, 0, -padding * paddingOffset]}
							/>
						</group>
					</group>
				</group>
			</group>
		);
	}
	if (piece instanceof CornerPiece) {
		return (
			<group rotation={[0, -angle, 0]}>
				<Corner
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

export function CubeDisplayInternal({
	state: [, movingPieces, rotation, cube],
	allAnimation,
}: {
	state: State;
	allAnimation: {
		rotationX: SpringValue<number>;
		rotationY: SpringValue<number>;
		rotationZ: SpringValue<number>;
	};
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
		piece: AnyPiece;
		children: ReactNode;
	}) => {
		const moving = movingPieces.has(piece.pieceId);
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
		<animated.group
			rotation-x={allAnimation.rotationX}
			rotation-y={allAnimation.rotationY}
			rotation-z={allAnimation.rotationZ}
		>
			{/*<pointLight position={[10, 10, 10]} />*/}
			{cube.top.map((piece, index) => (
				<Moving piece={piece} key={piece.pieceId}>
					<group position={[0, +padding + 2 / 3, 0]}>
						<PieceComponent
							key={piece.pieceId}
							piece={piece}
							angle={toRad(45) * index - toRad(45)}
						/>
					</group>
				</Moving>
			))}

			{cube.middle.map((piece, index) => (
				<Moving piece={piece} key={piece.pieceId}>
					<group position={[0, 0, 0]}>
						<PieceComponent
							key={piece.pieceId}
							piece={piece}
							angle={toRad(45) * (index * 2) - toRad(45)}
							middle
						/>
					</group>
				</Moving>
			))}

			{cube.bottom.map((piece, index) => (
				<Moving piece={piece} key={piece.pieceId}>
					<group rotation={[0, Math.PI, Math.PI]}>
						<group position={[0, padding + 2 / 3, 0]}>
							<PieceComponent
								key={piece.pieceId}
								piece={piece}
								angle={toRad(45) * index + toRad(45)}
							/>
						</group>
					</group>
				</Moving>
			))}
		</animated.group>
	);
}

const initialCube = new Cube3x3();

function CubeDisplay({ state }: { state: State }) {
	const allAnimation = useSpring({
		rotationX: state[4]?.[0] ?? 0,
		rotationY: state[4]?.[1] ?? 0,
		rotationZ: state[4]?.[2] ?? 0,
	});
	return (
		<CubeDisplayInternal
			key={state[0].id}
			state={state}
			allAnimation={allAnimation}
		/>
	);
}

export function Cube3x3Screen() {
	const [state, actualSetState] = useState<State>(() => [
		initialCube,
		new Set([]),
		[0, 0, 0],
		initialCube,
		[0, 0, 0],
	]);

	function setState(newState: State) {
		newState[4] ??= state[4];
		actualSetState(newState);
	}

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
				</XStack>
				<XStack gap="$2">
					<Button
						icon={Undo}
						onPress={() => {
							const topRotation = state[0].rotate("top", false);
							const bottomRotation = topRotation[0].rotate("bottom", true);
							console.log(state[4]);
							const newState: State = [
								bottomRotation[0],
								new Set([...topRotation[1], ...bottomRotation[1]]),
								topRotation[2],
								topRotation[3],
								[
									state[4]?.[0] ?? 0,
									(state[4]?.[1] ?? 0) + Math.PI / 2,
									state[4]?.[2] ?? 0,
								],
							];
							setState(newState);
						}}
					>
						Middle
					</Button>
					<Button
						icon={Redo}
						onPress={() => {
							const topRotation = state[0].rotate("top", true);
							const bottomRotation = topRotation[0].rotate("bottom", false);
							const newState: State = [
								bottomRotation[0],
								new Set([...topRotation[1], ...bottomRotation[1]]),
								topRotation[2],
								topRotation[3],
								[
									state[4]?.[0] ?? 0,
									(state[4]?.[1] ?? 0) - Math.PI / 2,
									state[4]?.[2] ?? 0,
								],
							];
							setState(newState);
						}}
					>
						Middle
					</Button>
				</XStack>
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
				<XStack gap="$2">
					<Button
						icon={Undo}
						onPress={() => {
							setState(state[0].rotate("front", true));
						}}
					>
						Front
					</Button>
					<Button
						icon={Redo}
						onPress={() => {
							setState(state[0].rotate("front", false));
						}}
					>
						Front
					</Button>
				</XStack>
				<XStack gap="$2">
					<Button
						icon={Undo}
						onPress={() => {
							setState(state[0].rotate("back", true));
						}}
					>
						Back
					</Button>
					<Button
						icon={Redo}
						onPress={() => {
							setState(state[0].rotate("back", false));
						}}
					>
						Back
					</Button>
				</XStack>
				<XStack gap="$2">
					<Button
						icon={Undo}
						onPress={() => {
							setState(state[0].rotate("left", true));
						}}
					>
						Left
					</Button>
					<Button
						icon={Redo}
						onPress={() => {
							setState(state[0].rotate("left", false));
						}}
					>
						Left
					</Button>
				</XStack>
				<XStack gap="$2">
					<Button
						icon={Undo}
						onPress={() => {
							setState(state[0].rotate("right", true));
						}}
					>
						Right
					</Button>
					<Button
						icon={Redo}
						onPress={() => {
							setState(state[0].rotate("right", false));
						}}
					>
						Right
					</Button>
				</XStack>
			</XStack>
			<Canvas style={{ flex: 1 }}>
				<OrbitControls enableDamping enablePan enableRotate enableZoom />
				<ambientLight intensity={1} />
				<CubeDisplay state={state} />
			</Canvas>
		</YStack>
	);
}