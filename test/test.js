var assert = require('assert');
var chaiAsPromised = require('chai-as-promised');
var chai = require('chai');
var expect = chai.expect;
var cli = require("../lib/checkCLI");
const { getTemplatePath } = require('../lib/localPath');

chai.should();
chai.use(chaiAsPromised);

describe('It has to have a maverick file', function() {
	it('should return `error` when the file is not present', async function(){
	  return expect(cli.isCli()).to.eventually.equal(true);
	});
});
