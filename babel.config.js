module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
};
