#!/usr/local/bin/node

var fs = require('fs'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();

var files = function(dir, callback) {
    var files = fs.readdirSync(dir);
    files.forEach(function(filename) {
        var content = fs.readFileSync(dir + '/' + filename, {encoding: 'utf-8'});
        callback(filename, content);
    });
};

var asXml = function(fileContent, callback) {
    parser.parseString(fileContent, function (err, result) {
        callback(result);
    });
};

var sentences = function(xmlDoc, callback) {
    xmlDoc.LCMC.text[0].file.forEach(function(file) {
        file.p.forEach(function(p) {
            p.s.forEach(function(s) {
                callback(s);
            });
        });
    });
};

var freq = {};

files('data/', function(filename, fileContent) {
    asXml(fileContent, function(xmlDoc) {
        sentences(xmlDoc, function(sentence) {
            (sentence.w || []).forEach(function(word) {
                var w = word._;
                freq[w] = freq[w] || 0;
                freq[w]++;
            });
        });
    });
});



var tuples = [];

for (var key in freq) {
    tuples.push([key, freq[key]]);
}

tuples.sort(function(a, b) { return b[1] - a[1]; });

// console.log(tuples.length, 'words');
// console.log('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n, r');

for (var i = 0; i < tuples.length; i++) {
    var key = tuples[i][0];
    var value = tuples[i][1];
}






