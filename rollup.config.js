import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
	input: "scripts/index.ts",
	output: [
		{
			file: ".build/index.cjs",
			format: "cjs",
		},
		{
			file: ".build/index.mjs",
			format: "esm",
		},
	],
	plugins: [
		typescript({
			tsconfig: "tsconfig.json",
			include: /\.[jt]sx?$/,
			exclude: /node_modules/,
		}),
	],
	external: ["crypto", "@duplojs/core", "cookie"],
});
