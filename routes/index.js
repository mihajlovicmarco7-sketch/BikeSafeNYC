import dashboardRoutes from './dashboard.js';
import locationRoutes from './locations.js';
import theftReportsRoutes from './theftReports.js';
import reportsRoutes from './reports.js';
import favoritesRoutes from './favorites.js'

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/dashboard'); 
  });
  app.use('/', dashboardRoutes);
  app.use('/locations', locationRoutes);
  app.use('/theftReports', theftReportsRoutes);
  app.use('/reports', reportsRoutes);
  app.use('/favorites', favoritesRoutes);
  
  app.use((req, res) => {
    res.status(404).render('error', { title: '404', message: 'Page not found' });
  });

};

export default constructorMethod;