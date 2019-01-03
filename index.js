const express = require('express');
const bodyParser = require('body-parser');
const lunr = require('elasticlunr');
const uuid = require('uuid/v4');

const fs = require('fs');

const dataFilePath = './data.json';
const content = fs.readFileSync(dataFilePath);
const documents = JSON.parse(content.toString()) || [];

var idx = lunr(function() {
    this.setRef('id');
    this.addField('name');
    this.addField('location');
    this.addField('comment');
});

documents.forEach((doc) => {
    idx.addDoc(doc, false);
});

const app = express();
const port = 8080;

app.use(bodyParser());
app.use(express.static('src'));

app.get('/data', (req, res) => {
    console.log('query ', req.query);
    const results = idx.search(req.query.query, { expand: true });
    res.send(results.map((result) => idx.documentStore.getDoc(result.ref)));
});

app.post('/data', (req, res) => {
    const doc = req.body;
    doc.id = uuid();
    console.log('add document ', doc);
    idx.addDoc(doc, true);

    const docs = idx.documentStore.toJSON().docs;
    const data = JSON.stringify(Object.keys(docs).map((key) => docs[key]));
    fs.writeFile(dataFilePath, data, () => {
        res.send(doc.id);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));