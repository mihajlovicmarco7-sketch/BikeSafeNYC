import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { engine } from 'express-handlebars';
import constructorMethod from './routes/index.js';

const app = express();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(session({
  name: 'AuthCookie',
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
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

constructorMethod(app);

app.listen(3000, () => {
  console.log('BikeSafe NYC running on http://localhost:3000');
});