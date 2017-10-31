#!/usr/bin/env node

require('commander')
    .version(require('../package.json').version)
    .usage('<command> [options]')
    .command('init', 'generate a new project from a template')
    .command('sass', 'Create a new SASS file')
    .command('pug', 'Create a new PUG file')
    .parse(process.argv)