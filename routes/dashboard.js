import { Router } from 'express';
import { requireLogin } from '../middleware/auth.js';
import { theftReportsData } from '../data/index.js';

const router = Router();

router.get('/dashboard', requireLogin, async (req, res) => {
  try {
    const reports = await theftReportsData.getReportsByUser(req.session.user._id);

    return res.render('dashboard', {
      title: 'My Dashboard',
      user: req.session.user,
      reports,
      favorites: [],
      hasReports: reports.length > 0,
      hasFavorites: false
    });
  } catch (e) {
    return res.status(500).render('error', {
      title: 'Error',
      message: e
    });
  }
});

router.get('/missing-bikes', async (req, res) => {
  let isLoggedIn = !!req.session.user;
  const missingReports = await theftReportsData.getMissingReports();

  return res.render('missing-bikes', {
    title: 'Missing Bikes',
    reports: missingReports,
    hasReports: missingReports.length > 0,
    loggedIn: isLoggedIn
  });
});

export default router;