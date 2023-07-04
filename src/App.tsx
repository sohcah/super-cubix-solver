import {useState} from "react";
import tamaguiConfig from "./tamagui.config";
import {TamaguiProvider, Theme, YStack} from "tamagui";
import {HomeScreen} from "./screens/home.tsx";

function App() {
    const [colorScheme] = useState<"light" | "dark">("light");

    return (
        <TamaguiProvider config={tamaguiConfig}>
            <Theme name={colorScheme}>
                <Theme name={colorScheme === "dark" ? "green" : "blue"}>
                    <YStack height="100vh" bc="$background">
                        <HomeScreen/>
                    </YStack>
                </Theme>
            </Theme>
        </TamaguiProvider>
    );
}

export default App;
