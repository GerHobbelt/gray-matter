/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
var tomlParser = require("..");
var fs = require('fs');
require('should');

describe('parse TOML:', function() {
  it('should parse toml front matter', function() {
    var fixture = '---\ntitle = "TOML"\ndescription = "Front matter"\ncategories = "front matter toml"\n---\n\n# This file has toml front matter!\n';
    var actual = preliminaries.parse(fixture, {lang: 'toml'});
    actual.data.title.should.equal('TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should export a TOML parser', function() {
    var fixture = '---\ntitle = "TOML"\ndescription = "Front matter"\ncategories = "front matter toml"\n---\n\n# This file has toml front matter!\n';
    var actual = preliminaries.parse(fixture, {parser: tomlParser});
    actual.data.title.should.equal('TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect TOML as the language with no language defined after the first fence', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-no-lang-toml.md', 'utf8'));
    actual.data.title.should.equal('autodetect-no-lang');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect TOML as the language', function() {
    var actual = preliminaries.parse('---toml\ntitle = "autodetect-TOML"\n[props]\nuser = "jonschlinkert"\n---\nContent\n');
    actual.data.title.should.equal('autodetect-TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should NOT throw on TOML syntax errors when `strict` is NOT defined', function() {
    (function() {
      var fixture = '---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n';
      preliminaries.parse(fixture, {lang: 'toml'});
    }).should.not.throw();
  });

  it('should throw on TOML syntax errors when `strict` IS defined', function() {
    (function() {
      var fixture = '---toml\n[group]\nkey=1\n\n[group.key]\nval=2\n\n---\nContent\n';
      preliminaries.parse(fixture, {lang: 'toml', strict: true});
    }).should.throw('preliminaries parser [TOML]: Error: "key" is overriding existing value');
  });
});
