const test = require('ava');
const { parse } = require('../index.js')
const fs = require('fs')

test('Parse CODEOWNERS example', t => {
	const codeowners = fs.readFileSync(__dirname + '/CODEOWNERS.test', 'utf8')
	const parsedCodeowners = JSON.parse(fs.readFileSync(__dirname + '/CODEOWNERS.json'))
	t.deepEqual(parse(codeowners), parsedCodeowners)
});
