import { Router } from 'express';
import { mockUser,  mockFavorites } from '../data/mockData.js';
import {theftReportsData} from '../data/index.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  
  const reports = await theftReportsData.getReportsByUser(mockUser._id);

  return res.render('dashboard', {
    title: 'My Dashboard',
    user: mockUser,
    reports: reports,
    favorites: mockFavorites,
    hasReports: reports.length > 0,
    hasFavorites: mockFavorites.length > 0
  });
});

router.get('/missing-bikes', async (req, res) => {
  
  const missingReports = await theftReportsData.getMissingReports();

  return res.render('missing-bikes', {
    title: 'Missing Bikes',
    reports: missingReports,
    hasReports: missingReports.length > 0
  });
});

export default router;