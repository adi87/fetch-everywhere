/*global fetch*/
"use strict";

require('es6-promise').polyfill();
require('../fetch-npm-node');
var expect = require('chai').expect;
var fetchMock = require('fetch-mock');
var good = 'hello world. 你好世界。';
var bad = 'good bye cruel world. 再见残酷的世界。';

function responseToText(response) {
	if (response.status >= 400) throw new Error("Bad server response");
	return response.text();
}

describe('fetch', function() {

	before(function() {
		fetchMock.get('https://mattandre.ws/succeed.txt', {
			status: 200,
			body: good,
		});
		fetchMock.get('https://mattandre.ws/fail.txt', {
			status: 400,
			body: bad,
		});
	});

	it('should be defined', function() {
		expect(fetch).to.be.a('function');
	});

	it('should facilitate the making of requests', function(done) {
		fetch('https://mattandre.ws/succeed.txt')
			.then(responseToText)
			.then(function(data) {
				expect(data).to.equal(good);
				done();
			})
			.catch(done);
	});

	it('should do the right thing with bad requests', function(done) {
		fetch('https://mattandre.ws/fail.txt')
			.then(responseToText)
			.catch(function(err) {
				expect(err.toString()).to.equal("Error: Bad server response");
				done();
			})
			.catch(done);
	});

});
