const fs = require('fs');
const pdfParse = require('pdf-parse');

console.log(typeof pdfParse);
if (typeof pdfParse === 'function') {
    console.log('It is a function');
} else {
    console.log('It is an object, keys:', Object.keys(pdfParse));
    console.log(typeof pdfParse.default);
}
