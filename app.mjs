//var createError = require('http-errors');
import createError from 'http-errors';
//var express = require('express');
import express from 'express';
//var path = require('path');
import path from 'path';
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');
import logger from 'morgan';

import { notesRoutes } from './routes/notesRoutes';


const app = express();

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.resolve('public')));

app.use("/", notesRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

const hostname = 'localhost';
const port = 3000;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});