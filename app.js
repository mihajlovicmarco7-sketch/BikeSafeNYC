// Main file
import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';

import configRoutes from './routes/index.js';
import dashboardRoutes from './routes/dashboard.js';
import reportsRoutes from './routes/reports.js';
import helpers from './helpers/helpers.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

// Session setup
app.use(
  session({
    name: 'BikeSafeAuth',
    secret: 'replace_this_with_a_real_secret_later',
    resave: false,
    saveUninitialized: false
  })
);

app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    helpers
  })
);

app.set('view engine', 'handlebars');

configRoutes(app);

app.use('/', dashboardRoutes);
app.use('/', reportsRoutes);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});