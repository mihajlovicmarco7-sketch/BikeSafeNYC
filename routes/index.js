import authRoutes from './authRoutes.js';
import reportsRoutes from './reports.js';
import favoritesRoutes from './favorites.js';
import locationsRoutes from './locations.js';

const constructorMethod = (app) => {
  // Root redirect
  app.get('/', (req, res) => {
    if (req.session.user) {
      return res.redirect('/dashboard');
    } else {
      return res.redirect('/login');
    }
  });

  // Auth routes (login + dashboard handled here)
  app.use('/', authRoutes);

  // the other routes
  app.use('/reports', reportsRoutes);
  app.use('/favorites', favoritesRoutes);
  app.use('/locations', locationsRoutes);

  // 404 error
  app.use('*', (req, res) => {
    res.status(404).render('error', {
      title: '404',
      error: 'Page not found'
    });
  });
};

export default constructorMethod;