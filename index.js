const express = require('express')
const path = require('path')
var serveStatic = require('serve-static')
const PORT = process.env.PORT || 5000

var cacheRouter = require('./routes/cache');
var noCacheRouter = require('./routes/nocache');

var app = express();
// app.enable('etag');
// app.set('etag', 'strong');

app.use(serveStatic(path.join(__dirname, 'public'), {
    // maxAge: '1d',
    setHeaders: setCustomCacheControl
}));


app.use('/cache', cacheRouter);
app.use('/no-cache', noCacheRouter);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


function setCustomCacheControl (res, path) {

    /*if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=31557600')
    }*/
     console.log(path);
    if (serveStatic.mime.lookup(path) == 'application/javascript') {
        // Custom Cache-Control for HTML files
        console.log(serveStatic.mime.lookup(path));
        if(path.indexOf("cachecontent") >=0 ) {
            res.setHeader('Cache-Control', 'public, max-age=31557600000')
        }

        if(path.indexOf("nocache") >=0 ) {
            res.setHeader('Cache-Control', 'no-store,must-revalidate')
        }
    }
}

