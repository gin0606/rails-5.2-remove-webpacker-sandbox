const glob = require("glob");
const path = require("path");
const ManifestPlugin = require("webpack-manifest-plugin");

const packs = path.join(__dirname, "app", "javascript", "packs");

const targets = glob.sync(path.join(packs, "**/*.{js,jsx,ts,tsx}"));
const entry = targets.reduce((entry, target) => {
  const bundle = path.relative(packs, target);
  const ext = path.extname(bundle);

  return Object.assign({}, entry, {
    // Input: "application.js"
    // Output: { "application": "./application.js" }
    [bundle.replace(ext, "")]: "./" + bundle
  });
}, {});

const config = {
  context: packs,
  entry,
  output: {
    filename: "[name]-[chunkhash].js",
    chunkFilename: "[name]-[chunkhash].chunk.js",
    path: path.join(__dirname, "public", "packs"),
    publicPath: "/packs/"
  },
  resolve: {
    extensions: [
      ".jsx",
      ".js",
      ".sass",
      ".scss",
      ".css",
      ".module.sass",
      ".module.scss",
      ".module.css",
      ".png",
      ".svg",
      ".gif",
      ".jpeg",
      ".jpg"
    ],
    modules: [path.join(__dirname, "app", "javascript"), "node_modules"]
  },
  resolveLoader: { modules: ["node_modules"] },
  devtool: "nosources-source-map",
  stats: "normal",
  entry: {
    application: path.join(
      __dirname,
      "app",
      "javascript",
      "packs",
      "application"
    ),
    hello_react: path.join(
      __dirname,
      "app",
      "javascript",
      "packs",
      "hello_react"
    )
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: { cacheDirectory: "tmp/cache/webpacker/babel-loader" }
          }
        ]
      }
    ]
  },
  plugins: [
    new ManifestPlugin({
      fileName: "manifest.json",
      publicPath: "/packs/",
      writeToFileEmit: true
    })
  ]
};
module.exports = config;
