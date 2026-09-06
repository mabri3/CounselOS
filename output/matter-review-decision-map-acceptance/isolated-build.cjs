// Isolate build output while retaining the repository's actual Next config and defaults.
const configPath = require.resolve('../../frontend/node_modules/next/dist/server/config');
const original = require(configPath);
const replacement = { ...original, default: async (...args) => {
  const config = await original.default(...args);
  return { ...config, distDir: '.next-decision-map-build', distDirRoot: '.next-decision-map-build' };
}};
Object.defineProperty(replacement, '__esModule', { value: true });
require.cache[configPath].exports = replacement;
