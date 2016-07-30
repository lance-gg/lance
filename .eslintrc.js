module.exports = {
    "extends": "google",
    "installedESLint": true,
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "comma-dangle": 0,
        "indent": ["error", 4],
        "linebreak-style": [2, "unix"],
        "max-len": ["error", {
            "code": 120
        } ],
        "no-console": 0
    }

};
