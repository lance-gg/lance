module.exports = {
    "extends": "google",
    "installedESLint": true,
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "comma-dangle": "off",
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "max-len": ["error", {
            "code": 120
        } ],
        "no-console": "off",
        "padded-blocks": "off"
    }

};
