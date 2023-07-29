import { Canvas, CanvasProps } from "@react-three/fiber";
import { useContextBridge } from "its-fine";
import { Html } from "@react-three/drei";
import type { HtmlProps } from "@react-three/drei/web/Html";

export function BridgedCanvas({ children, ...props }: CanvasProps) {
	const Bridge = useContextBridge();
	return (
		<Canvas {...props}>
			<Bridge>{children}</Bridge>
		</Canvas>
	);
}

export function BridgedHtml({ children, ...props }: HtmlProps) {
	const Bridge = useContextBridge();
	return (
		<Html {...props}>
			<Bridge>{children}</Bridge>
		</Html>
	);
}
