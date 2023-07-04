import { H4, YStack } from "tamagui";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Pizza } from "../components/pizza.tsx";
import { Kite } from "../components/kite.tsx";
import { b } from "../components/shared.ts";

const padding = 0.05;

export function HomeScreen() {
	return (
		<YStack flex={1} bc="$background">
			<H4>Welcome</H4>
			<Canvas style={{ flex: 1 }}>
				<OrbitControls enableDamping enablePan enableRotate enableZoom />
				<ambientLight />
				{new Array(4).fill(0).map((_, i) => (
					<group
						rotation={[0, (i * Math.PI) / 2, 0]}
						position={[0, +padding + b, 0]}
					>
						<Pizza position={[0, 0, -padding]} />
						<group rotation={[0, Math.PI / 4, 0]}>
							<Kite
								colors={{
									top: [1, 1, 1],
									left: [1, 0, 0],
									right: [0, 0, 1],
								}}
								position={[0, 0, -padding * Math.SQRT2]}
							/>
						</group>
					</group>
				))}

				{new Array(4).fill(0).map((_, i) => (
					<group
						rotation={[0, (i * Math.PI) / 2, 0]}
						position={[0, -padding - b, 0]}
						scale={[1, -1, 1]}
					>
						<Pizza position={[0, 0, -padding]} />
						<group rotation={[0, Math.PI / 4, 0]}>
							<Kite
								colors={{
									top: [0, 1, 0],
									left: [1, 1, 0],
									right: [1, 0, 0],
								}}
								position={[0, 0, -padding * Math.SQRT2]}
							/>
						</group>
					</group>
				))}
			</Canvas>
		</YStack>
	);
}
