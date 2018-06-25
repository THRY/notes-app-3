var express = require('express');
var router = express.Router();
const store = require("../services/noteStore.js");

function sort(type, array) {
    function fn(a, b) {
      console.log('Type: ' + type);
      console.log(a[type]);
      if (a[type] > b[type]) {
        return -1;
      }
      if (a[type] < b[type]) {
        return 1;
      }
      return 0;
    }
    return array.sort(fn)
}


router.get("/notes", function(req, res, next) {
  let sortby = req.query.sortby; 
  let sortedNotes;

  console.log(sortby);

  store.all(function(err, notes) {
    if(sortby) {
      sortedNotes = sort(req.query.sortby, notes);
    } else {
      sortedNotes = sort('created', notes);
    }
    res.json(sortedNotes);
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
