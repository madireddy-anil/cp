import { ProvidePlugin, Configuration, SourceMapDevToolPlugin } from "webpack";
import "webpack-dev-server";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";
const { ModuleFederationPlugin } = require("webpack").container;
const Dotenv = require("dotenv-webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const stylesHandler = MiniCssExtractPlugin.loader;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const deps = require("./package.json").dependencies;

const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
// const TerserPlugin = require("terser-webpack-plugin");

type SentryOptions = { org: string; project: string; release: string };

type Environment = "dev" | "prd" | "tst";
let ENVIRONMENT = (process.env.REACT_APP_ENV ?? "dev") as Environment;
enum ENVIRONMENT_TYPE {
  dev = ".tst",
  prd = "",
  tst = ".tst"
}

// const LOCAL_PAYMENTS = `payments@http://localhost:3001/remoteEntry.js`;
// const LOCAL_PAYMENTS_MFE_URL = `new_payment@http://localhost:3001/remoteEntry.js`;
// const LOCAL_NEW_ACCOUNTS_MFE_URL = `newAccounts@http://localhost:3001/remoteEntry.js`;
// const LOCAL_NEW_PAYMENT_MFE_URL = `new_payment@http://localhost:3002/remoteEntry.js`;
// const LOCAL_CONVERSIONS_MFE_URL = `conversions@http://localhost:3001/remoteEntry.js`;
// const LOCAL_RECEIVABLE_MFE_URL= `receivable@http://localhost:3001/remoteEntry.js`;
// const LOCAL_SETTINGS_MFE_URL = `settings@http://localhost:3001/remoteEntry.js`;

const APP_STORE = `./src/app/ReduxWrapper.tsx`;
const NEW_PAYMENT_MFE_URL = `new_payment@https://new-payment${ENVIRONMENT_TYPE[ENVIRONMENT]}.getorbital.com/remoteEntry.js`;
const PAYMENTS_MFE_URL = `payments@https://payments${ENVIRONMENT_TYPE[ENVIRONMENT]}.getorbital.com/remoteEntry.js`;
const CRYPTO_ECOMMERCE_MFE_URL = `cryptoEcommerce@https://crypto-commerce-ui${ENVIRONMENT_TYPE[ENVIRONMENT]}.getorbital.io/remoteEntry.js`;
const NEW_ACCOUNTS_MFE_URL = `newAccounts@https://accounts-ui${ENVIRONMENT_TYPE[ENVIRONMENT]}.getorbital.io/remoteEntry.js`;
const CONVERSIONS_MFE_URL = `conversions@https://conversions${ENVIRONMENT_TYPE[ENVIRONMENT]}.getorbital.com/remoteEntry.js`;
const RECEIVABLE_MFE_URL = `receivable@https://receivable-ui${ENVIRONMENT_TYPE[ENVIRONMENT]}.getorbital.io/remoteEntry.js`;
const SETTINGS_MFE_URL = `settings@https://settings-ui${ENVIRONMENT_TYPE[ENVIRONMENT]}.getorbital.io/remoteEntry.js`;

const config: Configuration = {
  target: "web",
  mode: ENVIRONMENT === "prd" ? "production" : "development",
  entry: {
    main: path.resolve(__dirname, "src", "app", "index")
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name]-[contenthash].js",
    chunkFilename: "chunk-[name].[contenthash].js"
    // publicPath: "auto"
  },
  stats: {
    assets: true,
    chunks: true,
    modules: true,
    builtAt: true,
    hash: true
  },
  devServer: {
    open: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    },
    host: "localhost",
    watchFiles: [
      "src/**/*.tsx",
      "src/**/*.ts",
      "src/**/*.js",
      "src/**/*.css",
      "src/**/*.scss",
      "src/**/*.sass"
    ],
    hot: false,
    liveReload: true,
    // prevent not found page on refresh
    historyApiFallback: true,
    client: {
      // display server errors on the browser
      overlay: {
        errors: true,
        warnings: false
      }
    },
    port: 3000
  },
  plugins: [
    // Add your new modules here:
    new ModuleFederationPlugin({
      name: "clientPortal",
      filename: "remoteEntry.js",
      remotes: {
        payments: `${PAYMENTS_MFE_URL}?v=[Date.now()]`,
        new_payment: `${NEW_PAYMENT_MFE_URL}?v=[Date.now()]`,
        cryptoEcommerce: `${CRYPTO_ECOMMERCE_MFE_URL}?v=[Date.now()]`,
        newAccounts: `${NEW_ACCOUNTS_MFE_URL}?v=[Date.now()]`,
        conversions: `${CONVERSIONS_MFE_URL}?v=[Date.now()]`,
        receivable: `${RECEIVABLE_MFE_URL}?v=[Date.now()]`,
        settings: `${SETTINGS_MFE_URL}?v=[Date.now()]`
      },
      exposes: {
        "./hostStore": APP_STORE
      },
      shared: [
        {
          ...deps,
          react: { requiredVersion: deps.react, singleton: true },
          "react-dom": {
            requiredVersion: deps["react-dom"],
            singleton: true
          },
          "react-redux": {
            requiredVersion: deps["react-redux"],
            singleton: true
          },
          "react-router-dom": {
            requiredVersion: deps["react-router-dom"],
            singleton: true
          },
          "@auth0/auth0-react": {
            singleton: true,
            strictVersion: true
          },
          "@payconstruct/orbital-auth-provider": {
            singleton: true,
            strictVersion: false
          },
          "@payconstruct/design-system": {
            singleton: true,
            strictVersion: false
          }
        }
      ]
    }),
    new SourceMapDevToolPlugin({}),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html")
    }),
    new MiniCssExtractPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new Dotenv({
      path: path.resolve("env", "local.env"),
      safe: true,
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
      defaults: false
    }),
    new ESLintPlugin({
      extensions: [".tsx", ".ts", ".js"]
    }),

    new ProvidePlugin({
      React: "react"
    }),

    //* https://github.com/module-federation/module-federation-examples/issues/566
    new ExternalTemplateRemotesPlugin(),
    //https://github.com/relative-ci/bundle-stats/tree/master/packages/webpack-plugin
    // new BundleStatsWebpackPlugin({
    //   outDir: "./webpack-bundle-analysis"
    // })
    // Put the Sentry Webpack plugin after all other plugins
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "orbital",
      project: "client-portal",
      _experiments: {
        moduleMetadata: (options: SentryOptions) => ({
          ...options,
          team: "frontend"
        })
      }
    })
  ],
  resolve: {
    // if you don't use symlinks (e.g. npm link or yarn link).
    symlinks: false,
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      asset: path.resolve(__dirname, "src", "asset"),
      component: path.resolve(__dirname, "src", "component"),
      config: path.resolve(__dirname, "src", "config"),
      pages: path.resolve(__dirname, "src", "pages"),
      router: path.resolve(__dirname, "src", "router"),
      slice: path.resolve(__dirname, "src", "slice"),
      state: path.resolve(__dirname, "src", "state"),
      section: path.resolve(__dirname, "src", "section"),
      service: path.resolve(__dirname, "src", "service"),
      utils: path.resolve(__dirname, "src", "utils")
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                // mode: "local",
                auto: true,
                exportGlobals: true,
                localIdentName: "[name]--[hash:base64:5]",
                // localIdentContext: path.resolve(__dirname, "src"),
                // localIdentHashSalt: "my-custom-hash"
                exportLocalsConvention: "camelCase"
                // exportOnlyLocals: false,
                // namedExport: true
              }
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                exportGlobals: true,
                localIdentName: "[local]--[hash:base64:5]"
              }
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(ts|tsx|js|jsx)$/i,
        exclude: ["/node_modules/"],
        use: {
          loader: "babel-loader",
          options: {
            compact: true,
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: "> 0.25%, not dead"
                  }
                }
              ],
              "@babel/preset-react",
              "@babel/preset-typescript"
            ]
          }
        }
      }
    ]
  },
  optimization: {
    // minimize: true,
    // minimizer: [
    //   new TerserPlugin({
    //     terserOptions: {
    //       compress: {
    //         drop_console: true
    //       },
    //       mangle: true
    //     }
    //   })
    // ],
    splitChunks: {
      chunks: "async",
      // chunks: "all",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        svgGroup: {
          test(module: any) {
            // `module.resource` contains the absolute path of the file on disk.
            // Note the usage of `path.sep` instead of / or \, for cross-platform compatibility.
            const path = require("path");
            return (
              module.resource &&
              module.resource.endsWith(".svg") &&
              module.resource.includes(`${path.sep}cacheable_svgs${path.sep}`)
            );
          }
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    /*
      disable webpack base config `runtimeChunck: single`
      https://github.com/webpack/webpack/issues/11691
      This can be removed when #11843 is merged
      https://github.com/webpack/webpack/pull/11843
    */
    runtimeChunk: false
  }
};

module.exports = () => {
  if (ENVIRONMENT === "prd") {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};

export default config;
