import locationRoutes from './locations.js';
import theftReportsRoutes from './theftReports.js';

const constructorMethod = (app) => {
  app.use('/locations', locationRoutes);
  app.use('/theftReports', theftReportsRoutes);

  app.use((req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;