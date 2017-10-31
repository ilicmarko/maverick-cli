#!/usr/bin/env node
'use strict';

// @TODO: Ako ne unese nista onda ga pitaj redom: Ime projekta, Hoces instalaciju itd..

const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const slugify = require('slugify')
const localPath = require('../lib/localPath');
const fs = require("fs-extra");
const Listr = require('listr');
const execa = require('execa');

const isLocalPath = localPath.isLocalPath;
const getTemplatePath = localPath.getTemplatePath
const cliPath = path.join(path.dirname(fs.realpathSync(__filename)), '../');

const initMsg = chalk.gray('==========================================================================') +
                chalk.yellow(
                    '\n' +
                    '  Pocinje inicijalizacija template-a za front-end.' +
                    '\n'
                ) +
                chalk.gray('==========================================================================');
console.log(initMsg);

program
  .usage('<project-path> [project-name]')
  .option('-s, --skip-install', 'Preskoci istalaciju npm i bower paketa')
  .parse(process.argv);

const skipInstall = program.skipInstall;

program.on('--help', () => {
    console.log('Primer:');
    console.log(chalk.gray('# Pravljenje templata u trenutnom direktorijumu'));
    console.log(chalk.green('$ maverick init "Moj Projekat"\n'));
    console.log(chalk.gray('# Pravljenje templata u nekom direktorijumu'));
    console.log(chalk.green('$ maverick init ./projects/mojprojekat "Moj Projekat" \n'));
});


function help () {
    program.parse(process.argv)
    if (program.args.length < 1) return program.help()
}
help()

let argPath = program.args[0];
const hasPath = argPath.indexOf('/') > -1 || program.args[1];
const projectLocalPath = ( hasPath ) ? argPath : '.';

const projectPath = getTemplatePath(projectLocalPath);
const projectName = (hasPath) ? program.args[1] : argPath;

const name = path ? path.relative('../', process.cwd()) : rawName

const filesToEdit = {
    bower: {
        path: 'bower.json',
        replace: slugify(projectName, {lower: true})
    },
    vars: {
        path: 'src/views/inc/_vars.pug',
        replace: projectName
    }
    
}

const tasks = new Listr([
    {
        title: 'Pravljenje strukture',
        task: () => fs.copy(path.join(cliPath, 'structure'), projectPath)
            .catch(err => console.error(err))
    }, 
    {
        title: 'Izmena fajlova',
        task: () => {
            return new Listr([
                {
                    title: 'bower.json',
                    task: () => {
                        fs.readFile(path.join(projectPath, filesToEdit.bower.path), 'utf8', (err, data) => {
                            if (err) return console.error(err);
                
                            let result = data.replace(/<projectName>/g, filesToEdit.bower.replace);
                
                            fs.writeFile(path.join(projectPath, filesToEdit.bower.path), result, 'utf8', (err) => {
                                if (err) return console.error(err);
                            })
                        });
                    }
                },
                {
                    title: '_var.pug',
                    task: () => {
                        fs.readFile(path.join(projectPath, filesToEdit.vars.path), 'utf8', (err, data) => {
                            if (err) return console.error(err);
                
                            let result = data.replace(/<projectName>/g, filesToEdit.vars.replace);
                
                            fs.writeFile(path.join(projectPath, filesToEdit.vars.path), result, 'utf8', (err) => {
                                if (err) return console.error(err);
                            })
                        });
                    }
                }
            ])
        }
    },
    {
        title: 'Generisanje maverick fajla',
        task: () => {
            let now = new Date();
            const data = 'Projekat napravljen od strane CLI-a \n' +
                        'Projekat: ' + projectName + '\n'  +
                        'Datum: ' + now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear() + '\n' +
                        'CLI Verzija: ' + require('../package.json').version;
        
            fs.writeFile(path.join(projectPath, '.maverick'), data, (error) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
            });
        }
    },
    {
        title: 'Instalacija bower paketa',
        skip: () => { if ( skipInstall ) return 'Izabrana opcija --skip-install'; },
        task: () => execa('bower', ['install'])
    },
    {
        title: 'Instalacija npm paketa',
        skip: () => { if ( skipInstall ) return 'Izabrana opcija --skip-install'; },
        task: () => execa('npm', ['install'], { cwd: projectPath })
    }
]);

tasks.run().catch(err => {
	console.error(err);
});
