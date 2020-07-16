module.exports = {
    "globals": {
        "process": true
    },
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "single"]
    },
    "overrides": [
        {
            "files": [
                "**/*.spec.js",
                "**/*.test.js"
            ],
            "env": {
                "jest": true
            }
        }
    ]
};
