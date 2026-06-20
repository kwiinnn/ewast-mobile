module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // ⚠️ DO NOT put "nativewind/babel" here.
      // If you use React Native Reanimated, keep its plugin here:
      // 'react-native-reanimated/plugin',
    ],
  };
};