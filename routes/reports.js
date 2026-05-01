import { Router } from 'express';
import { mockReports, mockUser } from '../data/mockData.js';

const router = Router();

router.get('/reports/:id/edit', async (req, res) => {
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

router.post('/reports/:id/edit', async (req, res) => {
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

  // Basic temporary validation
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

  if (status !== 'missing' && status !== 'recovered') {
    return res.status(400).render('reports/edit', {
      title: 'Edit Report',
      report,
      error: 'Status must be either missing or recovered.'
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

router.post('/reports/:id/delete', async (req, res) => {
  const reportId = req.params.id;

  const reportIndex = mockReports.findIndex((r) => r._id === reportId);

  if (reportIndex === -1) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

  mockReports.splice(reportIndex, 1);

  return res.redirect('/dashboard');
});

router.post('/reports/:id/recovered', async (req, res) => {
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

router.post('/reports/:id/comments', async (req, res) => {
  const reportId = req.params.id;
  const { commentText } = req.body;

  const report = mockReports.find((r) => r._id === reportId);

  if (!report) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

  if (report.status !== 'missing') {
    return res.status(400).render('error', {
      title: 'Invalid Request',
      message: 'Comments can only be added to active missing bike reports.'
    });
  }

  const trimmedComment = commentText ? commentText.trim() : '';

  if (!trimmedComment || trimmedComment.length < 2 || trimmedComment.length > 500) {
    return res.status(400).render('error', {
      title: 'Invalid Comment',
      message: 'Comment must be between 2 and 500 characters.'
    });
  }

  report.comments.push({
    _id: `comment${Date.now()}`,
    userId: mockUser._id,
    username: mockUser.username,
    text: trimmedComment,
    createdAt: new Date().toISOString()
  });

  report.updatedAt = new Date().toISOString();

  return res.redirect('/missing-bikes');
});

export default router;