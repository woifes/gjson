import type { Config } from "@jest/types";
// Load the config which holds the path aliases.
const requireJSON5 = require("require-json5");

const config: Config.InitialOptions = {
    preset: "ts-jest",
};

export default config;
