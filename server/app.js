var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
const dotenv=require("dotenv");
dotenv.config()

var mongoose = require('mongoose');

var cors = require('cors')

var index = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var hiringpartner = require('./routes/hiringpartner');
var instructor = require('./routes/instructor');
var student = require('./routes/student');
var challenge = require('./routes/challenge');
var category = require('./routes/category');
var upload = require('./routes/upload');
mongoose.Promise = global.Promise; 
var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', index);
app.use('/api/', auth);
app.use('/users', users);
app.use('/hiringpartner', hiringpartner);
app.use('/instructor', instructor);
app.use('/student', student);
app.use('/challenge', challenge);
app.use('/category', category);
app.use('/upload', upload);



// mongoose
// mongoose.connect('mongodb://localhost:27017/lmsdb');
const port = 3001;
const mongoDBConnectionString = 'mongodb://127.0.0.1:27017/LMS?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4';

// mongoose
//   .connect(process.env.MONGO_DB)
//   .then(() => {
//     // app.listen(process.env.PORT, () => {
//     //   console.log(`server running ${process.env.PORT}`);
      
//     // });
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });

//   })
//   .catch((err) => {
//     console.log("there is error");
//     console.error(err);
//   });

mongoose
  .connect(mongoDBConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Add this line
    useFindAndModify: false, 
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      
    });
  })
  .catch((err) => {
    console.log("There is an error connecting to MongoDB:");
    console.error(err);

  });

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
