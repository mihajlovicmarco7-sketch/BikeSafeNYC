// Main file
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import exphbs from 'express-handlebars';

import configRoutes from './routes/index.js';
import helpers from './helpers/helpers.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use(
  session({
    name: 'BikeSafeAuth',
    secret: 'BikeSafeNYCSecretChangeThis',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/BikeSafeNYC'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true
    }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentUser = req.session.user || null;
  next();
});

app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    helpers
  })
);

app.set('view engine', 'handlebars');
app.set('views', './views');

configRoutes(app);

app.listen(3000, () => {
  console.log('BikeSafe NYC running on http://localhost:3000');
});