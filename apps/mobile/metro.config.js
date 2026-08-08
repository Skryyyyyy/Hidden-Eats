const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports for React Navigation v7+
config.resolver.unstable_enablePackageExports = true;
// Enable package imports
config.resolver.unstable_enablePackageImports = true;
// Add symlinks support for monorepo
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
