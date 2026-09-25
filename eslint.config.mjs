import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The three.js scenes mutate objects every frame and build random geometry
    // once (the React Three Fiber idiom). They opt out of the React Compiler
    // with "use no memo", so its purity and immutability rules don't apply.
    files: ["src/app/(tabs)/_components/space/**/*.tsx", "src/app/_components/Warp.tsx"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
