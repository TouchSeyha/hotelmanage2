/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
    plugins: ['prettier-plugin-tailwindcss'],
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    arrowParens: 'always',
    endOfLine: 'lf',
    bracketSpacing: true,
    jsxSingleQuote: false,
};
