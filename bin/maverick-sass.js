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
    .option('-c, --component', 'Napravi komponentu')
    .option('-e, --element', 'Napravi element')
    .option('-t, --tool', 'Napravi novu funkciju ili mixin')
    .option('-u, --utility', 'Napravi novi utility')
    .option('-p, --plugin', 'New plugin')
    .parse(process.argv);

/**
 * HELP
 * If there are no arguments show help
 */

program.on('--help', () => {
  console.log(chalk.bold('\nPotrebno je navesti tacno jednu opciju'));
  console.log('\nPrimer:');
  console.log(chalk.gray('# Pravljenje componente'));
  console.log(chalk.green('$ maverick sass -c moja-komponenta\n'));
});


function help () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

/**
 * Check options
 * Check if the user specified any options.
 */

const options = program.opts() ;
const optionCount = Object.values(options).reduce( (count, val) => val === true ? count + 1 : count, 0);
const fileName = program.args[0].toLowerCase();

if (optionCount > 1) {
  console.log(chalk.bold.red('Uneto vise od jedne opcije, moguce je uneti samo jednu opciju.'));
  process.exit(0);
}

if (optionCount < 1) {
  console.log(chalk.bold.red('Mora da se unese bar jedna opcija'));
  process.exit(0);
}


/**
 * Create a filename, based on the type and name.
 * @param {String} component [Component type, comes from the options]
 * @param {String} name [Filename]
 */

function createFileName(component, name) {
  return '_' + component + '-' + name + '.scss'
}

/**
 * Create a class selector, based on the type and name.
 * @param {String} component [Component type, comes from the options]
 * @param {String} name [Class name]
 */

function createClass(component, name) {
  return "'." + component + "-" + name + "'";
}

/**
 * Create a SCSS import statment
 * @param {String} component [Component type, comes from the options]
 * @param {String} name [Class name]
 */

function createImport(component, fileName) {
  return '@import \'' + component + '-' + fileName + '\';\n'
}


const sassPath = path.join(projectPath, 'src/sass');

const sass = {
  components: path.join(sassPath, '/components'),
  elements: path.join(sassPath, '/elements'),
  tools: path.join(sassPath, '/tools'),
  utilities: path.join(sassPath, '/utilities'),
  plugins: path.join(sassPath, '/plugins')
}

/**
 * Before I even do anything, we need to check if this is my CLI.
 */

isCli()
  .then( () => {
      if ( program.component ) addComponent();
      if ( program.element ) addScssFile(sass.elements, 'elements');
      if ( program.tool ) addScssFile(sass.tools, 'tools');
      if ( program.utility ) addScssFile(sass.utilities, 'utilities');
      if ( program.plugin ) addScssFile(sass.plugins, 'plugins');
    }
  )
  .catch(error => console.log(chalk.red('This project is not initialized by ') + chalk.bold('Maverick CLI')));

/**
 * Create a file in the directory and add it to global SCSS file.
 * @param {String} filePath [Path to the component folder]
 * @param {String} fileName [Name of the component]
 * @param {String} rootFile [Global components file where the component should be imported]
 * @param {String} data [Data that should be inserted in the file]
 * @param {Char} component [Component prefix, defualt value is the first letter of `rootFile`]
 */

function createFileWithContent(filePath, fileName, rootFile, data = '', component = rootFile.charAt(0)) {
  // Component path with the new filename
  const componentPath = path.join(filePath, createFileName(component, fileName));
  // Create a SCSS file with root class
  fs.writeFile( componentPath , data)
    .catch( err => console.error(err) );

  // Add the created SCSS file to the global SCSS file
  fs.appendFile(path.join(filePath, '_' + rootFile + '.scss'), createImport(component, fileName))
    .catch ( err => console.log(err) );
}

/**
 * Add a SCSS component
 */

function addComponent() {
  // Component prefix
  const component = 'c'
  
  // Component path with the new filename
  const componentPath = path.join(sass.components, createFileName(component, fileName));

  let data = 
    '$root:    ' + createClass(component, fileName) + ';\n' +
    '\n\n#{$root} {\n}';

  // Check if this component already exists
  fs.access( componentPath, fs.constants.F_OK, (err) => {
    if (err) {
      createFileWithContent(sass.components, fileName, 'components', data);
    } else {
      // Ask if the user wants to overwrite the existing file
      co(function *(){
        const answer = yield prompt.confirm(chalk.red('The file already exists. Do you want to overwrite it? (y/n) '));
        if (answer) {
          createFileWithContent(sass.components, fileName, 'components', data);
        }
        process.stdin.pause();
        
      });
    } 
  });
}

/**
 * This is a general function to create a SCSS file for elements, tools and utilities
 * @param {String} rootFile 
 * @param {Char} component 
 */

function addScssFile(folder, rootFile, component = rootFile.charAt(0) ) {
  // Element path with the new filename
  const elementPath = path.join(folder, createFileName(component, fileName));

  // Check if this element already exists
  fs.access( elementPath, fs.constants.F_OK, (err) => {
    if (err) {
      createFileWithContent(folder, fileName, rootFile);
    }
    else {
      // Ask if the user wants to overwrite the existing file
      co(function *(){
        const answer = yield prompt.confirm(chalk.red('The file already exists. Do you want to overwrite it? (y/n) '));
        if (answer) {
          createFileWithContent(folder, fileName, rootFile);
        }
        process.stdin.pause();
        
      });

    } 
  });
}
