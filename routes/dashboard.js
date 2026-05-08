import { Router } from 'express';
import { requireLogin } from '../middleware/auth.js';
import { theftReportsData } from '../data/index.js';
import { getUserById } from '../data/users.js';
import { getParkingLocationsByIds } from '../data/locations.js';

const router = Router();

router.get('/dashboard', requireLogin, async (req, res) => {
  try {
    const reports = await theftReportsData.getReportsByUser(req.session.user._id);

    const user = await getUserById(req.session.user._id);
    const favoriteLocationIds = user.favoriteLocationIds || [];
    const favorites = await getParkingLocationsByIds(favoriteLocationIds);

    return res.render('dashboard', {
      title: `${req.session.user.username}'s Dashboard`,
      user: req.session.user,
      reports,
      favorites,
      hasReports: reports.length > 0,
      hasFavorites: favorites.length > 0
    });
  } catch (e) {
    return res.status(500).render('error', {
      title: 'Error',
      message: e
    });
  }
});

router.get('/missing-bikes', async (req, res) => {
  try {
    const isLoggedIn = !!req.session.user;
    const missingReports = await theftReportsData.getMissingReports();

    return res.render('missing-bikes', {
      title: 'Missing Bikes',
      reports: missingReports,
      hasReports: missingReports.length > 0,
      loggedIn: isLoggedIn
    });
  } catch (e) {
    return res.status(500).render('error', {
      title: 'Error',
      message: e
    });
  }
});

export default router;