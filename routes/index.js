import authRoutes from './authRoutes.js';

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    if (req.session.user) {
      return res.redirect('/dashboard');
    } else {
      return res.redirect('/login');
    }
  });

  app.use('/', authRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('error', {
      title: '404',
      error: 'Page not found'
    });
  });
};

export default constructorMethod;