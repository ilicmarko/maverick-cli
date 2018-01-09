var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var cli = require("../lib/checkCLI");
var cliPath = require('../lib/localPath');

var fs = require('fs');
var path = require('path');

chai.should();
chai.use(require('chai-as-promised'));
chai.use(require('chai-fs'));

var maverickFile = path.join(cliPath.getTemplatePath('.'), '.maverick');

describe('It has to have a maverick file', () => {
	it('should allow to write a .maverick file', () => {
		fs.writeFileSync(maverickFile, '');
		expect(maverickFile).to.be.a.file();

	});

	it('should return `error` when the file is not present', (done) => {
	  	cli.isCli().should.eventually.equal(true).notify(done);
	  	fs.unlinkSync(maverickFile);
	});
});
