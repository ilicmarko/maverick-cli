# Maverick CLI
[![Build Status](https://travis-ci.org/ilicmarko/maverick-cli.svg?branch=master)](https://travis-ci.org/ilicmarko/maverick-cli) [![npm version](https://badge.fury.io/js/maverick-cli.svg)](https://badge.fury.io/js/maverick-cli)![CLI Logo](https://raw.githubusercontent.com/ilicmarko/maverick-cli/master/logo.png)

Maverick CLI lets you create a scaffolding for your next project with ease. Maverick CLI is based on a popular [Yeoman](http://yeoman.io/) generator [**webapp**](https://github.com/yeoman/generator-webapp), with some changes.

## Features

* enable [ES2015 features](https://babeljs.io/docs/learn-es2015/) using [Babel](https://babeljs.io)
* CSS Autoprefixing
* Built-in preview server with BrowserSync
* Automagically compile Sass with [libsass](http://libsass.org)
* Automagically compile Pug
* Automagically lint your scripts
* Map compiled CSS to source stylesheets with source maps
* Awesome image optimization
* Automagically wire-up dependencies installed with [Bower](http://bower.io)

## Instalation

On macOS, Linux, or Windows run the following:

```bash
npm install -g maverick-cli
```

**That is it!**

## Gulp Commands

* `gulp serve` to preview and watch for live changes
* `gulp` or `gulp build` to build the app for production
* `gulp serve:dist` to preview the production build

## CLI Commands

### Init

`maverick init <path> [Project name] [options]` - to scaffold your webapp *(<path> is optinal)*

**Options**:

`--skip-install` to skip the execution of `bower` and `npm` installation after scaffolding.

### SCSS

`maverick scss [options] [File name]` - create a SCSS file.

**Options:**

Options argument is **required**.

* `-c` or `--component` to add a component, *this also adds a css selector*.
* `-e` or `--element` to add an element
* `-t` or `--tool` to add a tool
* `-u` or `utility` to add a utility

**Example**

```bash
maverick scss -c "responsive-img"
```
##  Pug @TODO

`maverick pug [File name]` to create a pug page

## Project Structure 

There is a well defined project structure that must be respected

```
src
├───fonts
├───images
├───js
├───sass
│   ├───components
│   ├───elements
│   ├───generic
│   ├───tools
│   └───utilities
└───views
    ├───inc
    └───layouts
```

**SASS Folder**

This is where all the `.scss` files are found, gulp will watch for changes in this folder.

* `/components` - Complete chunks of UI, like *navigation, cards, panels* etc..
* `/elements` - Unclassed HTML elements, like *a, h1, body, blockquote* etc..
* `/generic` - Reset and normalize css.
* `/tools` - Mixins and functions
* `/utilities` - Override and helper functions, they are usually high-priority *(!important)*

> **SCSS files shouldn't be created manually, CLI should be used for that.**

**Views folder**

This is where all the `.pug` files are found, gulp will watch for changed in this folder.

* `inc` - Page parts that are included by a template, like *header, footer, navigation* etc...
* `layouts`- Templates that are extended by the pages.

In the root of the `views` is where the pages are located.



