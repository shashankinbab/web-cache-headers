const express = require('express')
const path = require('path')
var serveStatic = require('serve-static')
const PORT = process.env.PORT || 5000

var cacheRouter = require('./routes/cache');
var noCacheRouter = require('./routes/nocache');

var app = express();

app.use(serveStatic(path.join(__dirname, 'public'), {
    etag: false,
    cacheControl: false,
    setHeaders: setCustomCacheControl
}));


app.use('/cache', cacheRouter);
app.use('/no-cache', noCacheRouter);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.get('/mytest', function (req, res) {
    res.set('Last-Modified', new Date().toUTCString());
    res.json({ hello: 'world', teaTime: new Date().toISOString()});
});


app.get('/mytest2', function (req, res) {
    res.set('Cache-Control', 'no-cache, no-store');
    res.send(
        '<html>' +
        '<head>' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js" integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>' +
        '<script>$.getJSON( "/all.json", function( data ) { document.getElementById(\'mydiv\').innerText = data.testEtag });</script>' +
        '</head>' +
        '<body><div id="mydiv"></div></body>' +
        '</html>');
});


function setCustomCacheControl (res, path) {

    /*if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=31557600')
    }*/
     console.log(serveStatic.mime.lookup(path));


    if (serveStatic.mime.lookup(path) == 'application/json') {
        res.removeHeader('Cache-Control');
    }

    if (serveStatic.mime.lookup(path) == 'application/javascript') {
        // Custom Cache-Control for HTML files
        console.log(serveStatic.mime.lookup(path));
        if(path.indexOf("cachecontent") >=0 ) {
           // res.setHeader('Cache-Control', 'public, max-age=31557600000')
        }

        if(path.indexOf("nocache") >=0 ) {
            // res.setHeader('Cache-Control', 'no-store,must-revalidate')
        }
    }
}

