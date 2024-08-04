import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  target: ["chrome58", "firefox57", "safari11", "edge16"],
  outfile: "dist/index.js",
});
