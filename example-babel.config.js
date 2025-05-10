// babel.config.js
module.exports = {
  presets: ["next/babel"],
  plugins: [
    /**
     * the plugin, by default, is enabled if
     * 
     * process.env.NODE_ENV === 'development'
     * 
     * you can pass the enabled parameter to fit your custom rules
     */
    ["babel-plugin-locate-source", { enabled: true }]
  ]
};