"use strict";

const archetype = require("electrode-archetype-react-app/config/archetype");
const AppMode = archetype.AppMode;
const Path = require("path");
const _ = require("lodash");
const logger = require("electrode-archetype-react-app/lib/logger");

module.exports = function(options) {
  if (options.HotModuleReload) {
    require("react-hot-loader/patch");
  }

  const clientVendor = Path.join(AppMode.src.client, "vendor/");
  const babelExclude = x => {
    if (x.indexOf("cart-components-container-ny") >= 0) return false;
    if (x.indexOf("cart-components-pos-ny") >= 0) return false;
    if (x.indexOf("cart-components-core") >= 0) return false;
    if (x.indexOf("order-summary-ny") >= 0) return false;
    if (x.indexOf("feds-ny-core") >= 0) return false;
    if (x.indexOf("feds-wmt-header") >= 0) return false;
    if (x.indexOf("feds-wmt-footer") >= 0) return false;
    if (x.indexOf("wmreact-base") >= 0) return false;
    if (x.indexOf("wmreact-analytics") >= 0) return false;
    if (x.indexOf("wmreact-tempo-analytics-utils") >= 0) return false;
    if (x.indexOf("wmreact-interactive") >= 0) return false;
    if (x.indexOf("transaction-analytics-core") >= 0) return false;
    if (x.indexOf("wmreact-layout") >= 0) return false;
    if (x.indexOf("feds-nuka-carousel") >= 0) return false;
    if (x.indexOf("wmreact-modal") >= 0) return false;
    if (x.indexOf("cc-banner-ny") >= 0) return false;
    if (x.indexOf("wmreact-shipping-threshold-bar-ny") >= 0) return false;
    if (x.indexOf("node_modules") >= 0) return true;
    if (x.indexOf(clientVendor) >= 0) return true;
    return false;
  };

   //console.log("logging the options in babeljs");
   //console.log(JSON.stringify(options.babel, null, 4));
   options.babel = {
     "plugins": [
       "syntax-dynamic-import",
       ["babel-plugin-transform-object-rest-spread", {
        "useBuiltIns": true
      }],
      "lodash"
     ],
     "env": {
       "node" : {
         "plugins": ["dynamic-import-node"]
       }
     },
     "presets": [
       ["env", {
         "loose": true,
         "useBuiltIns": true,
         "targets": {
           "browsers": ["> 5%"]
         },
         "debug": true,
         "exclude": [
           "transform-regenerator",
           "es7.string.pad-start",
           "es7.string.pad-end"
         ]
       }], "react", "flow"
     ]

   };
   options.babel.babelrc = false;


  const babelLoader = {
    _name: "babel",
    test: /\.jsx?$/,
    exclude: babelExclude,
    use: [
      {
        loader: "babel-loader",

        options: Object.assign(
          { cacheDirectory: Path.resolve(".etmp/babel-loader") },
          options.babel
        )
      }
    ].filter(_.identity)
  };

  if (options.HotModuleReload) {
    logger.info("Enabling Hot Module Reload support in webpack babel loader");
    babelLoader.include = Path.resolve(AppMode.src.client);
  }

  return {
    module: {
      rules: [_.assign({}, babelLoader, archetype.webpack.extendBabelLoader)]
    }
  };
};
