import authRoutes from './authRoutes.js';
import locationsRoutes from './locations.js';
import reportsRoutes from './reports.js';
import favoritesRoutes from './favorites.js';

const constructorMethod = (app) => {
  // Root redirect
  app.get('/', (req, res) => {
    return req.session.user
      ? res.redirect('/dashboard')
      : res.redirect('/login');
  });

  // Auth routes (login, signup, dashboard handled here)
  app.use('/', authRoutes);

  // feature routes (primary endpoints)
  app.use('/locations', locationsRoutes);
  app.use('/reports', reportsRoutes);
  app.use('/favorites', favoritesRoutes);

  // Alias for UI compatibility (Missing Bikes Board → reports)
  app.use('/missing-bikes', reportsRoutes);

  // Optional: redirect alias (cleaner UX if you want one canonical route)
  app.get('/missing-bikes', (req, res) => {
    return res.redirect('/reports');
  });

  // 404 handler (must be last)
  app.use('*', (req, res) => {
    res.status(404).render('error', {
      title: '404',
      error: 'Page not found'
    });
  });
};

export default constructorMethod;