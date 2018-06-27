import express from 'express';
const router = express.Router();

import { store } from '../services/noteStore';


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
  if(req.query.delete == 'true') {
    store.remove(req.params.id, function(err, note) {
      res.json(note); 
    });
  } else {
    store.update(req.params.id, req.body, function(err, note) {
      res.json(note); 
    });
  }
  
});

router.get("/notes/:id", function(req, res) {
  store.get(req.params.id, function(err, note) {
    res.json(note); 
  })
});


export const notesRoutes = router;