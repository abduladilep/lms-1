var express = require("express");
var router = express.Router();
var Instructor = require("../models/instructor");

/* GET ALL STUDENT */
router.get("/", function (req, res, next) {
  Instructor.find(function (err, instructor) {
    if (err) return next(err);
    res.json(instructor);
  }).sort({ id: -1 });
});
// router.get("/", function (req, res, next) {
//     console.log("innnnnnn");
//     Instructor.find().sort({ id: -1 }).exec()
//       .then(instructor => {
//         res.json(instructor);
//       })
//       .catch(err => {
//         return next(err);
//       });
//   });
   
// GET Limit skip */
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


router.get("/", async function (req, res, next) {
    console.log("skipppppppp");
    try {
      console.log("Before find");
      const instructors = await Instructor.find().sort({ id: -1 }).exec();
      console.log("After find");
      res.json(instructors);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });
  

/* GET SINGLE STUDENT BY ID */
router.get("/:id", function (req, res, next) {
    console.log("instructor2");

  Instructor.findOne({ id: req.params.id }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE STUDENT */
router.post("/", function (req, res, next) {
  console.log("INSIDE THE INSTROECTOR");
  let instructor = new Instructor(req.body);
  console.log(instructor, "details of instructor");
  
  instructor.save()
//   instructor.save(function (err, data) {
//     if (err) return next(err);
//     res.json(data);
//   });
});

/* UPDATE STUDENT */
router.put("/:id", function (req, res, next) {
  Instructor.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { upsert: true },
    function (err, doc) {
      if (err) return next(err);
      res.json(doc);
    }
  );
});

/* DELETE STUDENT */
router.delete("/:id", function (req, res, next) {
  Instructor.findOneAndRemove({ id: req.params.id }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
