import { useState } from "react";
import tamaguiConfig from "./tamagui.config";
import { Button, H1, TamaguiProvider, Theme, XStack, YStack } from "tamagui";
import { CubeSquare1Screen } from "./screens/cubeSquare1.tsx";
import { Cube3x3Screen } from "./screens/cube3x3.tsx";

function Screens() {
	const [screen, setScreen] = useState<"square1" | "3x3">("3x3");

	let currentScreen: JSX.Element;
	switch (screen) {
		case "square1":
			currentScreen = <CubeSquare1Screen />;
			break;
		case "3x3":
			currentScreen = <Cube3x3Screen />;
			break;
		default:
			currentScreen = <H1>Unknown Screen</H1>;
			break;
	}

	return (
		<YStack flex={1}>
			<XStack>
				<Button flex={1} onPress={() => setScreen("3x3")}>
					3x3
				</Button>
				<Button flex={1} onPress={() => setScreen("square1")}>
					Square 1
				</Button>
			</XStack>
			{currentScreen}
		</YStack>
	);
}

function App() {
	const [colorScheme] = useState<"light" | "dark">("light");

	return (
		<TamaguiProvider config={tamaguiConfig}>
			<Theme name={colorScheme}>
				<Theme name={colorScheme === "dark" ? "green" : "blue"}>
					<YStack height="100vh" bc="$background">
						<Screens />
					</YStack>
				</Theme>
			</Theme>
		</TamaguiProvider>
	);
}

export default App;
