const {
  str,
  sequenceOf,
  choice,
  char,
  pipeParsers,
  everythingUntil,
  endOfInput,
  many1,
  sepBy,
  whitespace,
} = require('arcsecond')

const Comment = (c) => { return { Comment: c } }
const Line = (d, o) => { return { Directory: d, Owners: o } }
const Team = (o, t) => { return { Org: o, Team: t} }
const Username = (u) => { return { Username: u } }
const Email = (e) => { return { Email: e } }

const newLine = many1(char('\n'))

const newLineOrEOF = choice([
  newLine,
  endOfInput
])

const directory = sequenceOf([
  everythingUntil(whitespace),
  whitespace
]).map(([dir, _]) => dir)

const endOfWord = choice([whitespace, newLineOrEOF])
const anyString = everythingUntil(endOfWord)

const githubUsername = sequenceOf([
  char('@'),
  everythingUntil(choice([char('/'), endOfWord])),
]).map(([_1, name]) => Username(name))

const githubTeam = sequenceOf([
  char('@'),
  everythingUntil(choice([char('/'), endOfWord])),
  char('/'),
  anyString
]).map(([_1, org, _2, team]) => Team(org, team))

const email = anyString.map(Email)

const githubOwner = choice([
  githubTeam,
  githubUsername,
  email
])

const comment = pipeParsers([
  char('#'),
  everythingUntil(newLineOrEOF)
]).map(Comment)

const directive = sequenceOf([
  directory,
  sepBy (many1(char(' '))) (githubOwner)
]).map(([dir, usernames]) => Line(dir, usernames))

const process = sepBy (newLine) (choice([
  comment,
  directive,
  newLineOrEOF
]))

module.exports.parse = (codeowners) => process.run(codeowners).result
