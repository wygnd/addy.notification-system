/** @type {import("prettier")} */
export default {
	trailingComma: 'all',
	semi: true,
	singleQuote: true,
	jsxSingleQuote: true,
	arrowParens: 'always',
	importOrderSeparation: false,
	importOrderSortSpecifiers: true,
	importOrderCaseInsensitive: true,
	importOrderParserPlugins: ['classProperties', 'decorators-legacy', 'typescript'],
	importOrder: ['<THIRD_PARTY_MODULES>', '@/(.*)$', '^../(.*)$', '^./(.*)$'],
	plugins: ['@trivago/prettier-plugin-sort-imports'],
}