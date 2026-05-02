import authRoutes from './authRoutes.js';
import locationsRoutes from './locations.js';
import reportsRoutes from './reports.js';
import favoritesRoutes from './favorites.js';

const constructorMethod = (app) => {
  // Root redirects
  app.get('/', (req, res) => {
    return req.session.user
      ? res.redirect('/dashboard')
      : res.redirect('/login');
  });

  // Auth routes (for login, signup, dashboard handled here)
  app.use('/', authRoutes);

  // Feature routes
  app.use('/locations', locationsRoutes);
  app.use('/reports', reportsRoutes);
  app.use('/favorites', favoritesRoutes);

  // 404 handles (last)
  app.use('*', (req, res) => {
    res.status(404).render('error', {
      title: '404',
      error: 'Page not found'
    });
  });
};

export default constructorMethod;