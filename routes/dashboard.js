import { Router } from 'express';
import { mockUser, mockReports, mockFavorites } from '../data/mockData.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  return res.render('dashboard', {
    title: 'My Dashboard',
    user: mockUser,
    reports: mockReports,
    favorites: mockFavorites,
    hasReports: mockReports.length > 0,
    hasFavorites: mockFavorites.length > 0
  });
});

router.get('/missing-bikes', async (req, res) => {
  const missingReports = mockReports.filter(
    (report) => report.status === 'missing'
  );

  return res.render('missing-bikes', {
    title: 'Missing Bikes',
    reports: missingReports,
    hasReports: missingReports.length > 0
  });
});

export default router;