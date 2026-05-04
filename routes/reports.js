import { Router } from 'express';
import {theftReportsData} from '../data/index.js';

const router = Router();

router.get('/:id/edit', async (req, res) => {
  const reportId = req.params.id;
  
  try {
    const report = await theftReportsData.getTheftReportsById(reportId);
    return res.render('reports/edit', {
      title: 'Edit Report',
      report: report
    });
  } catch (e) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: 'Report not found.'
    });
  }

});

router.post('/:id/edit', async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await theftReportsData.getTheftReportsById(reportId);

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
      status); 

    return res.redirect('/dashboard');

  } catch (e) {
    return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });
  }
});

router.post('/:id/delete', async (req, res) => {
  const reportId = req.params.id;

    try {
        result = await theftReportsData.deleteReport(reportId);
        return res.redirect('/dashboard');        
    } catch (e) {
      return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });

    }
});

router.post('/:id/recovered', async (req, res) => {
  const reportId = req.params.id;

  try {
    await theftReportsData.updateReportStatus(reportId, 'recovered');
    return res.redirect('/dashboard');

  } catch (e) {
      return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });

  }
});

router.post('/:id/comments', async (req, res) => {
  const reportId = req.params.id;
  const commentText = req.body.commentText;

  if (!req.session.user) {
      return res.status(404).render('error', {
      title: 'Comment Post Error',
      message: "Sign in to post"
    });
  }      

  let userId = req.session.user._id;
  let userName = req.session.user.username;

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

    await theftReportsData.addComment(reportId, userId, userName, trimmedComment);

    return res.redirect('/missing-bikes');    
  } catch (e) {
      return res.status(404).render('error', {
      title: 'Not Found',
      message: e
    });
  }

});

export default router;