module.exports = {
    "extends": "google",
    "env": {
        "browser": true,
        "node": true,
        "mocha": true
    },
    "installedESLint": true,
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "arrow-parens": "off",
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "comma-dangle": "off",
        "quotes": ["error", "single"],
        "guard-for-in": "off",
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "max-len": "off",
        "max-statements-per-line": ["error", { "max": 2 }],
        "no-alert": "off",
        "no-console": "off",
        "no-warning-comments": "off",
        "object-curly-spacing": ["error", "always"],
        "padded-blocks": "off",
        "require-jsdoc": "off"
    }

};
