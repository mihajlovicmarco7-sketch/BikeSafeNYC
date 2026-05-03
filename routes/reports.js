import { Router } from 'express';
import { mockReports, mockUser } from '../data/mockData.js';

const router = Router();

// 🔥 NEW: helper validation functions
const isValidEmail = (email) => {
  return typeof email === 'string' && email.includes('@') && email.includes('.');
};

const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

// 🔥 MAIN ROUTE
router.get('/', async (req, res) => {
  console.log("Reports route loaded"); // visible change

  const missingReports = mockReports.filter(
    (r) => r.status === 'missing'
  );

  return res.render('missing-bikes', {
    title: 'Missing Bikes Board',
    reports: missingReports,
    hasReports: missingReports.length > 0
  });
});

// 🔥 EDIT PAGE
router.get('/:id/edit', async (req, res) => {
  const reportId = req.params.id;
  const report = mockReports.find((r) => r._id === reportId);

  if (!report) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

  return res.render('reports/edit', {
    title: 'Edit Report',
    report
  });
});

// 🔥 EDIT SUBMIT
router.post('/:id/edit', async (req, res) => {
  const reportId = req.params.id;
  const report = mockReports.find((r) => r._id === reportId);

  if (!report) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

  const {
    bikeDescription,
    incidentDate,
    contactEmail,
    contactPhone,
    notes,
    status
  } = req.body;

  // 🔥 IMPROVED VALIDATION
  if (!bikeDescription || !incidentDate || !contactEmail || !status) {
    return res.status(400).render('reports/edit', {
      title: 'Edit Report',
      report: { ...report, ...req.body },
      error: 'All required fields must be filled.'
    });
  }

  if (!isValidEmail(contactEmail)) {
    return res.status(400).render('reports/edit', {
      title: 'Edit Report',
      report: { ...report, ...req.body },
      error: 'Invalid email format.'
    });
  }

  if (!isValidDate(incidentDate)) {
    return res.status(400).render('reports/edit', {
      title: 'Edit Report',
      report: { ...report, ...req.body },
      error: 'Invalid date format.'
    });
  }

  // 🔥 CLEAN DATA
  report.bikeDescription = bikeDescription.trim();
  report.incidentDate = incidentDate;
  report.contactEmail = contactEmail.trim();
  report.contactPhone = contactPhone ? contactPhone.trim() : '';
  report.notes = notes ? notes.trim() : '';
  report.status = status;
  report.updatedAt = new Date().toISOString();

  console.log(`Report ${reportId} updated`);

  return res.redirect('/dashboard');
});

// 🔥 DELETE
router.post('/:id/delete', async (req, res) => {
  const reportId = req.params.id;
  const index = mockReports.findIndex((r) => r._id === reportId);

  if (index === -1) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

  mockReports.splice(index, 1);
  console.log(`Report ${reportId} deleted`);

  return res.redirect('/dashboard');
});

// 🔥 MARK RECOVERED
router.post('/:id/recovered', async (req, res) => {
  const reportId = req.params.id;
  const report = mockReports.find((r) => r._id === reportId);

  if (!report) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

  report.status = 'recovered';
  report.updatedAt = new Date().toISOString();

  console.log(`Report ${reportId} marked as recovered`);

  return res.redirect('/dashboard');
});

// 🔥 COMMENTS
router.post('/:id/comments', async (req, res) => {
  const reportId = req.params.id;
  const { commentText } = req.body;

  const report = mockReports.find((r) => r._id === reportId);

  if (!report) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

  const trimmed = commentText ? commentText.trim() : '';

  if (!trimmed || trimmed.length < 2 || trimmed.length > 500) {
    return res.status(400).render('error', {
      title: 'Invalid Comment',
      message: 'Comment must be between 2 and 500 characters.'
    });
  }

  report.comments.push({
    _id: `comment${Date.now()}`,
    userId: mockUser._id,
    username: mockUser.username,
    text: trimmed,
    createdAt: new Date().toISOString()
  });

  report.updatedAt = new Date().toISOString();

  console.log(`Comment added to report ${reportId}`);

  return res.redirect('/reports');
});

export default router;