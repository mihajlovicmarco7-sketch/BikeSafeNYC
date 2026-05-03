import { Router } from 'express';
import { mockReports, mockUser } from '../data/mockData.js';

const router = Router();
//  MAIN ROUTE (WAS MISSING)
router.get('/', async (req, res) => {
  const missingReports = mockReports.filter(
    (r) => r.status === 'missing'
  );

  return res.render('missing-bikes', {
    title: 'Missing Bikes Board',
    reports: missingReports,
    hasReports: missingReports.length > 0
  });
}); 

//  EDITS PAGE
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

//  EDITS SUBMIT
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

  if (!bikeDescription || !incidentDate || !contactEmail || !status) {
    return res.status(400).render('reports/edit', {
      title: 'Edit Report',
      report: {
        ...report,
        bikeDescription,
        incidentDate,
        contactEmail,
        contactPhone,
        notes,
        status
      },
      error: 'Bike description, incident date, contact email, and status are required.'
    });
  }

  report.bikeDescription = bikeDescription.trim();
  report.incidentDate = incidentDate;
  report.contactEmail = contactEmail.trim();
  report.contactPhone = contactPhone ? contactPhone.trim() : '';
  report.notes = notes ? notes.trim() : '';
  report.status = status;
  report.updatedAt = new Date().toISOString();

  return res.redirect('/dashboard');
});

//  DELETES
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
  return res.redirect('/dashboard');
});

//  MARK RECOVERED IT
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

  return res.redirect('/dashboard');
});

//  COMMENTS ADDED
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

  //  FIXED THE redirect
  return res.redirect('/reports');
});

export default router;