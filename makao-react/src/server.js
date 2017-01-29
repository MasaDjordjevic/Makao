import path from 'path';
import http from 'http';
import express from 'express';
import logger from 'morgan';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import bodyParser from 'body-parser';
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

let app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/test', function(req, res){
    let t = {
        name: 'traa',
        no: 12
    };
    res.send(t);
});

app.post('/test2', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

   // res.send({res: "dobio sam email: " + email + ", pass: " + password});
    res.send("test");
});

app.use(function(req, res) {
  match(
    { routes: routes, location: req.url },
    function(err, redirectLocation, renderProps) {

      if (err) {
        return res.status(500).send(err.message);
      }

      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      const muiTheme = getMuiTheme({ userAgent: req.headers['user-agent'] });
      let markup;
      if (renderProps) {
        markup = ReactDOM.renderToString(
          <MuiThemeProvider muiTheme={muiTheme}>
            <RouterContext {...renderProps}/>
          </MuiThemeProvider>
          );
      }

      return res.render('index', { markup });
    }
  );
});



app.listen(1337, function() {
  console.log('Listening on port 1337.');
});
