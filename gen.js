#!/usr/bin/env node

const { createWriteStream } = require('fs');
const { resolve: resolvePath } = require('path');

for (const stylesCount of [0x7FFF, 0x8000, 0xFFFF, 0x10000]) {
	const hex = `0x${stylesCount.toString(16)}`;
	const indexStream = createWriteStream(
		resolvePath(__dirname, 'dist', `${hex}/index.html`)
	);

	let styles = '';
	for (let i = 1; i <= 20; i++) {
		const styleName = `${String(i).padStart(2, 0)}.css`;
		styles += `\t\t<link rel="stylesheet" type="text/css" href="${styleName}">\n`

		const styleStream = createWriteStream(resolvePath(__dirname, 'dist', hex, styleName));

		const lines = new Array(stylesCount).fill('.dummy-rule {}');
		lines[0] = `body:before { content: "Hello from ${styleName}" } /* The first rule is unique for each stylesheet file */`;
		lines[1] += ` /* Other rules are here just to make the stylesheet bigger. */`
		lines[2] += ` /* There are total ${hex} rules in this stylesheet. */`

		styleStream.end(lines.join('\n'));
	}

	indexStream.write(`\
<!doctype html>
<html>
	<head>
		<title>Using stylesheets with ${hex} rules each</title>
		${styles.trim()}
	</head>
	<body></body>
</html>\
`);
}
