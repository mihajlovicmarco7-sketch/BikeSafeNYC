import { Router } from 'express';
import { theftReportsData } from '../data/index.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

const userOwnsReport = (report, userId) => {
  return report.userId.toString() === userId.toString();
};

router.get('/:id/edit', requireLogin, async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await theftReportsData.getTheftReportsById(reportId);

    if (!userOwnsReport(report, req.session.user._id)) {
      return res.status(403).render('error', {
        title: 'Forbidden',
        message: 'You can only edit your own reports.'
      });
    }

    return res.render('reports/edit', {
      title: 'Edit Report',
      report
    });
  } catch (e) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }
});

router.post('/:id/edit', requireLogin, async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await theftReportsData.getTheftReportsById(reportId);

    if (!userOwnsReport(report, req.session.user._id)) {
      return res.status(403).render('error', {
        title: 'Forbidden',
        message: 'You can only edit your own reports.'
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

    if (status !== 'missing' && status !== 'recovered') {
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
        error: 'Status must be either missing or recovered.'
      });
    }

    await theftReportsData.updateReport(
      reportId,
      bikeDescription.trim(),
      incidentDate,
      contactEmail.trim(),
      contactPhone ? contactPhone.trim() : '',
      notes ? notes.trim() : '',
      status
    );

    return res.redirect('/dashboard');
  } catch (e) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });
  }
});

router.post('/:id/delete', requireLogin, async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await theftReportsData.getTheftReportsById(reportId);

    if (!userOwnsReport(report, req.session.user._id)) {
      return res.status(403).render('error', {
        title: 'Forbidden',
        message: 'You can only delete your own reports.'
      });
    }

    await theftReportsData.deleteReport(reportId);

    return res.redirect('/dashboard');
  } catch (e) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });
  }
});

router.post('/:id/recovered', requireLogin, async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await theftReportsData.getTheftReportsById(reportId);

    if (!userOwnsReport(report, req.session.user._id)) {
      return res.status(403).render('error', {
        title: 'Forbidden',
        message: 'You can only update your own reports.'
      });
    }

    await theftReportsData.updateReportStatus(reportId, 'recovered');

    return res.redirect('/dashboard');
  } catch (e) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });
  }
});

router.post('/:id/comments', requireLogin, async (req, res) => {
  const reportId = req.params.id;
  const commentText = req.body.commentText;

  const userId = req.session.user._id;
  const username = req.session.user.username;

  try {
    const report = await theftReportsData.getTheftReportsById(reportId);

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

    await theftReportsData.addComment(reportId, userId, username, trimmedComment);

    return res.redirect('/missing-bikes');
  } catch (e) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });
  }
});

export default router;