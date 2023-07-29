import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FiberProvider } from "its-fine";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<FiberProvider>
			<App />
		</FiberProvider>
	</React.StrictMode>,
);
