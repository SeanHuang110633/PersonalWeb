const router = require("express").Router();
const Journal = require("../models").journalModel;
const journalValidation = require("../validation").journalValidation;

router.use((req, res, next) => {
  console.log("A request is coming into api...");
  next();
});

router.post("/", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = journalValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, description } = req.body;
  // if (req.user.isAdmin()) {
  //   return res.status(400).send("Only User can post a new course.");
  // }

  let newJournal = new Journal({
    title,
    description,
    author: req.user._id,
  });

  try {
    await newJournal.save();
    res.status(200).send("New Journal has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save Journal.");
    console.log(err);
  }
});

router.get("/", (req, res) => {
  Journal.find({})
    .populate("author", ["username", "email"])
    .then((journal) => {
      res.send(journal);
    })
    .catch(() => {
      res.status(500).send("Error!! Cannot get course!!");
    });
});

router.get("/admin/:_id", (req, res) => {
  let { _admin_id } = req.params;
  Journal.find({ admin: _admin_id })
    .populate("author", ["username"])
    .then((journal) => {
      res.send(journal);
    })
    .catch((e) => {
      res.send(500).send("Cannot get journal data");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Journal.findOne({ _id })
    .populate("author", ["username"])
    .then((journal) => {
      res.send(journal);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.patch("/:_id", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = journalValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let journal = await Journal.findOne({ _id });
  if (!journal) {
    res.status(404);
    return res.json({
      success: false,
      message: "Journal not found.",
    });
  }

  if (journal.author.equals(req.user._id) || req.user.isAdmin()) {
    Journal.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Journal updated.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the author of this journal or web admin can edit this course.",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let journal = await Journal.findOne({ _id });
  if (!journal) {
    res.status(404);
    return res.json({
      success: false,
      message: "journal not found.",
    });
  }

  if (journal.author.equals(req.user._id) || req.user.isAdmin()) {
    journal
      .deleteOne({ _id })
      .then(() => {
        res.send("Journal deleted.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the author of this journal or web admin can delete this course.",
    });
  }
});

module.exports = router;
