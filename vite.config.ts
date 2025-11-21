import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage } from "http";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	const PORT = `${env.VITE_PORT ?? "3000"}`;
	const API_KEY = `${env.VITE_API_KEY ?? ""}`;

	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		build: {
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						if (
							assetInfo.name &&
							/\.(png|jpe?g|webp|svg)$/.test(assetInfo.name)
						) {
							return "assets/images/[name]-[hash][extname]";
						}
						return "assets/[name]-[hash][extname]";
					},
				},
			},
		},
		server: {
			port: parseInt(PORT),
			proxy: {
				"/api": {
					target: "https://api.musixmatch.com",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
					configure: (proxy, _options) => {
						proxy.on(
							"proxyReq",
							(proxyReq: any, req: IncomingMessage, _res: any) => {
								const url = new URL(req.url!, "http://localhost");
								url.searchParams.set("apikey", API_KEY);
								proxyReq.path = url.pathname + url.search;
								// console.log(proxyReq.path);
							},
						);
					},
				},
			},
		},
	};
});
