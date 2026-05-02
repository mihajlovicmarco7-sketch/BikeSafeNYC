import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { engine } from 'express-handlebars';

import constructorMethod from './routes/index.js';
import helpers from './helpers/helpers.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

// Handlebars setup
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    helpers
  })
);

app.set('view engine', 'handlebars');
app.set('views', './views');

// Session setup
app.use(
  session({
    name: 'AuthCookie',
    secret: 'BikeSafeNYCSecretChangeThis',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/BikeSafeNYC'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true
    }
  })
);

// Make user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Routes
constructorMethod(app);

// Server
app.listen(3000, () => {
  console.log('BikeSafe NYC running on http://localhost:3000');
});