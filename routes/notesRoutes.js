var express = require('express');
var router = express.Router();
const store = require("../services/noteStore.js");


router.get("/notes", function(req, res, next) {
  store.all(function(err, notes) {
    res.json(notes);
  })
});

router.post("/notes", function(req, res) {
  store.add(req.body, function(err, note) {
    res.json(note); 
  });
});

router.post("/notes/:id", function(req, res) {
  store.put(req.params.id, req.body, function(err, note) {
    res.json(note); 
  });
});

router.get("/notes/:id", function(req, res) {
  store.get(req.params.id, function(err, note) {
    res.json(note); 
  })
});

module.exports = router;
