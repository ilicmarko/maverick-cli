const fs = require('fs');
const path = require('path');
const cliPath = require('./localPath');

module.exports = {
    isCli() {
        return new Promise( (resolve, reject) => {
            fs.access( path.join( cliPath.getTemplatePath('.'), '.maverick'), fs.constants.F_OK, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        })
    }
}