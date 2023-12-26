var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var Student = require('../models/student');

/* GET ALL STUDENT */
// router.get('/', function (req, res, next) {
//     console.log("111111111111111111111");
//     Student.find(function (err, student) {
//         if (err) return next(err);
//         res.json(student);
//     }).sort({ id: -1 });
// });

// working code
router.get("/", function (req, res, next) {
    console.log("student");
    Student.find().sort({ id: -1 }).exec()
      .then(student => {
        res.json(student);
      })
      .catch(err => {
        return next(err);
      });
  });


/* GET Limit skip */
router.get('/:skip/:limit', function (req, res, next) {
    Student.find(function (err, student) {
        if (err) return next(err);
        res.json(student);
    }).sort({ id: -1 }).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit));
});

// router.get("/:skip/:limit", function (req, res, next) {
//     console.log("22222222222");
//     Student.find(function (err, student) {
//     console.log("eroor in instr");
//     if (err) return next(err);
//     res.json(student);
//   })
//     .sort({ id: -1 })
//     .skip(parseInt(req.params.skip))
//     .limit(parseInt(req.params.limit));
// });








/* GET SINGLE STUDENT BY ID */
router.get('/:id', function (req, res, next) {
    console.log("333333333333");

    Student.findOne({ id: req.params.id }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE STUDENT */
// router.post('/', function (req, res, next) {
//     var image = req.body.file;
//     var datas = req.body;
//     console.log(datas,"dataasss");
//     console.log(image,"dataasss");
//     datas['file'] = datas['name'] + datas['nim'];
//     let student = new Student(datas)
//     student.save(function (err, data) {
//         if (err) {
//             return next(err);
//         }
//         if (image)
//             if (image.length > 100) {
//                 var file = image.replace(/^data:image\/\w+;base64,/, '');
//                 fs.writeFile(path.join(__dirname, '../public/images/upload/' + datas['name'] + datas['nim'] + '.png'), file, { encoding: 'base64' }, function (err) {
//                     console.log('sukses upload')
//                 });
//             }
//         res.json(data);
//     });
// });

router.post('/', async function (req, res, next) {
    try {
      const image = req.body.file;
      const datas = req.body;
      datas['file'] = datas['name'] + datas['nim'];
  
      const student = new Student(datas);
      const savedStudent = await student.save();
  
      if (image && image.length > 100) {
        const file = image.replace(/^data:image\/\w+;base64,/, '');
        await fs.writeFile(
          path.join(__dirname, '../public/images/upload/', datas['name'] + datas['nim'] + '.png'),
          file,
          { encoding: 'base64' }
        );
        console.log('Success upload');
      }
  
      res.json(savedStudent);
    } catch (err) {
    //   next(err);
    }
  });
  

/* UPDATE STUDENT */
router.put('/:id', function (req, res, next) {
    var image = req.body.file;
    var datas = req.body;
    datas['file'] = datas['name'] + datas['nim'];
    Student.findOneAndUpdate({ id: req.params.id }, datas, { upsert: true }, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (image)
            if (image.length > 100) {
                var file = image.replace(/^data:image\/\w+;base64,/, '');
                var pathFile = path.join(__dirname, '../public/images/upload/' + datas['name'] + datas['nim'] + '.png');
                fs.stat(pathFile, function (err, stat) {
                    if (err == null) {
                        fs.unlink(pathFile, function (err) {
                            if (err) return console.log(err);
                            fs.writeFile(pathFile, file, { encoding: 'base64' }, function (err) {
                                console.log('sukses upload replace')
                            });
                        });
                    } else if (err.code == 'ENOENT') {
                        fs.writeFile(pathFile, file, { encoding: 'base64' }, function (err) {
                            console.log('sukses upload')
                        });
                    } else {
                        fs.unlink(pathFile, function (err) {
                            if (err) return console.log(err);
                            fs.writeFile(pathFile, file, { encoding: 'base64' }, function (err) {
                                console.log('sukses upload replace')
                            });
                        });
                    }
                });
            }
        res.json(doc);
    });
});

/* DELETE STUDENT */
router.delete('/:id', function (req, res, next) {
    Student.findOneAndRemove({ id: req.params.id }, function (err, post) {
        if (err) return next(err);
        var pathFile = path.join(__dirname, '../public/images/upload/' + post.file + '.png');
        fs.stat(pathFile, function (err, stat) {
            if (err == null) {
                fs.unlink(pathFile, function (err) {
                    if (err) return console.log(err);
                    console.log('sukses delete image 1')
                });
            } else if (err.code == 'ENOENT') {
                console.log('sukses delete image 2')
            } else {
                fs.unlink(pathFile, function (err) {
                    if (err) return console.log(err);
                    console.log('sukses delete image 3')
                });
            }
        });
        res.json(post);
    });
});


/* UPDATE STUDENT */
router.put('/challenges/:id', function (req, res, next) {
    let data = JSON.parse(req.body.challenges);
    Student.findOneAndUpdate({ id: req.params.id }, { challenges: data }, { upsert: true }, function (err, doc) {
        if (err) return next(err);
        res.json(doc);
    });
});

module.exports = router;