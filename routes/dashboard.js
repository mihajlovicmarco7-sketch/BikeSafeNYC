import { Router } from 'express';
import { mockUser,  mockFavorites } from '../data/mockData.js';
import {theftReportsData} from '../data/index.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  
  const reports = await theftReportsData.getReportsByUser(req.session.user._id);

  return res.render('dashboard', {
    title: 'My Dashboard',
    user: req.session.user,
    reports: reports,
    favorites: mockFavorites,
    hasReports: reports.length > 0,
    hasFavorites: mockFavorites.length > 0
  });
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