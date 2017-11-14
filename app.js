var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var busboy = require('connect-busboy');
var path = require('path');
var fs = require('fs-extra');

var index = require('./routes/index');
var users = require('./routes/users');

var oauth2 = require('./oauth2.js');
var picasa = require('./picasaAPI.js');
var googl = require('goo.gl');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, '.tmp'))); //TODO


console.log('remove upload folder\'s files...');
fs.readdir('./upload', (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink('./upload/' + file, err => {
      if (err) throw err;
    });
  }
  console.log('remove complete');
});


app.get("/string", function(req, res) {
    var strings = ["rad", "bla", "ska"];
    var n = Math.floor(Math.random() * strings.length);
    res.send(strings[n]);
});

app.use('/', index);
//app.use('/users', users);

app.route('/upload')
  .post(function (req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      var stream = fs.createWriteStream(__dirname + '/upload/' + filename);
      file.pipe(stream);
      stream.on('close', function () {
        console.log('File ' + filename + ' is uploaded');
        var project_key = JSON.parse(fs.readFileSync('./project_key.json').toString('utf-8'));
        //토큰이 만료되거나 만료가 임박하면, 갱신
        if(project_key.expires_in*1 - new Date().getTime() < 600)
        {
          var new_token = oauth2.refreshAccessToken(project_key.client_id, project_key.client_secret, project_key.refresh_token);
          project_key.access_token = new_token.access_token;
          project_key.expires_in = new_token.expires_in;
          // fs.writeFileSync('./project_key.json', JSON.stringify(project_key), null);
        }
        var uploadedMedia = picasa.mediaUpload( './upload/'+ filename, project_key.access_token, project_key.public_album_id, filename);

        googl.setKey(project_key.goo_gl_key);
        var url = null;
        var sync = true;
        googl.shorten(uploadedMedia.content.src).then(function (shortUrl) {
          sync = false;
          url = shortUrl;
        });
        while(sync){require('deasync').sleep('10');}
        res.json({result:url});
        fs.unlinkSync('./upload/'+ filename);
      });
    });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
