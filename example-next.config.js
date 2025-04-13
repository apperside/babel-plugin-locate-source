/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  webpack: (config, { dev, isServer }) => {
    // Only add debug source plugin in development mode
    if (dev) {
      // Find the rule with oneOf (Next.js 12+)
      const jsRule = config.module.rules.find(
        rule => rule.oneOf && Array.isArray(rule.oneOf)
      );
      
      if (jsRule && jsRule.oneOf) {
        // Find the rule that handles JSX/TSX files
        const babelRule = jsRule.oneOf.find(
          rule => rule.test && rule.test.toString().includes('jsx|tsx')
        );
        
        if (babelRule && babelRule.use && babelRule.use.options) {
          // Add our plugin to the existing babel plugins
          babelRule.use.options.plugins = babelRule.use.options.plugins || [];
          babelRule.use.options.plugins.push(
            require.resolve('./custom-babel-plugin')
          );
        }
      } 
    }
    
    // Always return the config
    return config;
  },
};

module.exports = nextConfig; 