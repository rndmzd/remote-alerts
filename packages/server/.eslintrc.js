module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescriptp-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommend',
        'prettier'
    ],
    env: {
        node: true,
        es6: true
    }
};