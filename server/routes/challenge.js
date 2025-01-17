var express = require('express');
var path = require('path');
var fs = require('fs');

var router = express.Router();
var Challenge = require('../models/challenge');

/* GET ALL STUDENT */
// router.get('/', function (req, res, next) {
//     Challenge.find(function (err, challenge) {
//         if (err) return next(err);
//         res.json(challenge);
//     }).sort({ id: -1 });
// });

router.get("/", function (req, res, next) {
    console.log("Challenge");
    Challenge.find().sort({ id: -1 }).exec()
      .then(challenge => {
        res.json(challenge);
      })
      .catch(err => {
        return next(err);
      });
    });


/* GET Limit skip */
// router.get('/:skip/:limit', function (req, res, next) {
//     Challenge.find(function (err, challenge) {
//         if (err) return next(err);
//         res.json(challenge);
//     }).sort({ id: -1 }).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit));
// });

router.get("/:skip/:limit", function (req, res, next) {
    console.log("instructor1");
  Instructor.find(function (err, instructor) {
    console.log("eroor in instr");
    if (err) return next(err);
    res.json(instructor);
  })
    .sort({ id: -1 })
    .skip(parseInt(req.params.skip))
    .limit(parseInt(req.params.limit));
});


/* GET SINGLE STUDENT BY ID */
router.get('/:id', function (req, res, next) {
    Challenge.findOne({ id: req.params.id }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE STUDENT */
// router.post('/', function (req, res, next) {
//     console.log("inside the chalenge router");
//     var image = req.body.file;
//     var datas = req.body;
//     datas['file'] = datas['id'];
//     let challenge = new Challenge(datas)
//     challenge.save(function (err, data) {
//         if (err) {
//             return next(err);
//         }
//         if (image)
//             if (image.length > 50) {
//                 var file = image.replace(/^data:image\/\w+;base64,/, '');
//                 fs.writeFile(path.join(__dirname, '../public/images/challenge/' + datas['id'] + '.png'), file, { encoding: 'base64' }, function (err) {
//                     console.log('sukses upload')
//                 });
//             }
//         res.json(data);
//     });
// });

router.post('/', async function (req, res, next) {
    console.log("inside the challenge router");
    var image = req.body.file;
    var datas = req.body;
    datas['file'] = datas['id'];
    let challenge = new Challenge(datas);

    try {
        let data = await challenge.save();

        if (image && image.length > 50) {
            var file = image.replace(/^data:image\/\w+;base64,/, '');
            const decodedFile = Buffer.from(file, 'base64');
            await require('fs').promises.writeFile( // Directly use fs.promises here
                path.join(__dirname, '../public/images/challenge/' + datas['id'] + '.png'),
                decodedFile
            );
            console.log('sukses upload');
        }

        res.json(data);
    } catch (err) {
        return next(err);
    }
});


/* UPDATE STUDENT */
router.put('/:id', function (req, res, next) {
    var image = req.body.file;
    var datas = req.body;
    datas['file'] = datas['id'];
    datas['student_access'] = JSON.parse(datas['student_access'])
    Challenge.findOneAndUpdate({ id: req.params.id }, datas, { upsert: true }, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (image)
            if (image.length > 50) {
                var file = image.replace(/^data:image\/\w+;base64,/, '');
                var pathFile = path.join(__dirname, '../public/images/challenge/' + datas['id'] + '.png');
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
    Challenge.findOneAndRemove({ id: req.params.id }, function (err, post) {
        if (err) return next(err);
        var pathFile = path.join(__dirname, '../public/images/challenge/' + post.file + '.png');
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

module.exports = router;