#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require("fs-extra");
const prompt = require('co-prompt');
const co = require('co');
const localPath = require('../lib/localPath');
const { isCli } = require('../lib/checkCLI');

const getTemplatePath = localPath.getTemplatePath
const projectPath = getTemplatePath('.');
/**
 * CORE
 * Define program usage and options
 */

require('commander')
    .usage('[options] <name>')
    .option('-t, --title <Page title>', 'Create a new page with title')
    .parse(process.argv);

/**
 * HELP
 * If there are no arguments show help
 */

program.on('--help', () => {
    console.log('\nExample:');
    console.log(chalk.gray('# Creating a new page'));
    console.log(chalk.green('$ maverick pug index -t "Home"\n'));
});
 
  
function help () {
    program.parse(process.argv)
    if (program.args.length < 1) return program.help()
}
help()

const fileName = program.args[0]

/**
 * Before I even do anything, we need to check if this is my CLI.
 */

isCli()
.then( () => {
    const views = path.join(projectPath, 'src/views');
    let title = program.title || '';
    const filePath = path.join(views, fileName + '.pug');
    
    fs.access( filePath, fs.constants.F_OK, (err) => {
        if (err) {
            createPugPage(filePath, title);
        } else {
            // Ask if the user wants to overwrite the existing file
            co(function *(){
                const answer = yield prompt.confirm(chalk.red('The file already exists. Do you want to overwrite it? (y/n) '));
                if (answer) {
                    createPugPage(filePath, title);
                }
                process.stdin.pause();
                
            });
        }
    });
  }
)
.catch(error => console.log(chalk.red('This project is not initialized by ') + chalk.bold('Maverick CLI')));

/**
 * Create the pug file, add the same boring content.
 * @param {String} filePath [Path to the file to be created]
 * @param {String} title [Title to add the page]
 */

function createPugPage(filePath, title) {    
    let data = 
        'extends layouts/default' + '\n\n' +
        'block vars' + '\n' +
        '   -pageTitle = "' + title +'";' + '\n\n' +
        
        'block content' + '\n';
   
    fs.writeFile( filePath , data)
        .catch( err => console.error(err) );
}