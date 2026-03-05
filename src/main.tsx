import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "@/app/App.tsx";
import { applyThemeToDocument, getStoredThemePreference } from "@/lib/theme";

applyThemeToDocument(getStoredThemePreference());

const container = document.getElementById("root");

if (!container) {
	throw new Error("Root container #root not found");
}

const app = (
	<StrictMode>
		<App />
	</StrictMode>
);

if (container.hasChildNodes()) {
	hydrateRoot(container, app);
} else {
	createRoot(container).render(app);
}
