export function camelToFirstUpper(str) {
	return str.replace(/([A-Z])/g, ' $1')
		.toLowerCase()
	  .replace(/^./, (first) => first.toUpperCase())
}