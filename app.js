import express from 'express';
import exphbs from 'express-handlebars';
import dashboardRoutes from './routes/dashboard.js';
import reportsRoutes from './routes/reports.js';
import helpers from './helpers/helpers.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'));

app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    helpers: helpers
  })
);

app.set('view engine', 'handlebars');

app.use('/', dashboardRoutes);
app.use('/', reportsRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});