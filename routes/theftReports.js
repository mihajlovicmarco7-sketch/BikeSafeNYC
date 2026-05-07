import validation from '../helpers.js'
import { Router } from 'express';
import { requireLogin } from '../middleware/auth.js';
import {theftReportsData} from '../data/index.js';
import {updateSafetyRating} from '../data/locations.js';

const router = Router();

// Show blank stolen bike report form
router
  .route('/')
  .get(requireLogin, async (req, res) => {
    try {
      return res.render('theftReports', {
        title: 'Report Stolen Bike',
        hasLocation: false
      });
    } catch (e) {
      return res.status(500).render('error', {
        title: 'Error',
        message: e
      });
    }
  })
  .post(requireLogin, async (req, res) => {
    let {
      locationId,
      locationName,
      incidentDate,
      bikeDescription,
      contactEmail,
      contactPhone,
      notes
    } = req.body;

    let userId = req.session.user._id;

    try {
      userId = validation.checkId(userId);
      locationId = validation.checkId(locationId);
      locationName = validation.checkString(locationName, 'locationName');
      incidentDate = validation.checkIncidentDate(incidentDate);
      
      bikeDescription = validation.checkString(bikeDescription, 'bikeDescription');
      if (bikeDescription.length > 500) {
        bikeDescription = bikeDescription.substring(0, 500);
      }
      
      contactEmail = validation.checkEmail(contactEmail, 'contactEmail');
      contactPhone = validation.checkString(contactPhone, 'contactPhone');
      
      notes = validation.checkNotes(notes);
      if (notes.length > 500) {
        notes = notes.substring(0, 500);
      }

      const result = await theftReportsData.createReport(
        userId,
        locationId,
        locationName,
        incidentDate,
        bikeDescription,
        contactEmail,
        contactPhone,
        notes
      );

      if (!result) {
        return res.status(500).render('theftReports', {
          title: 'Report Stolen Bike',
          error: 'Internal Server Error',
          ...req.body
        });
      }

      await updateSafetyRating(locationId, 0.5);

      return res.redirect('/dashboard');
    } catch (e) {
      return res.status(400).render('theftReports', {
        title: 'Report Stolen Bike',
        error: e,
        ...req.body
      });
    }
  });

// Show stolen bike report form pre-filled from a selected location
router
  .route('/:locationId')
  .post(requireLogin, async (req, res) => {
    let locationId = req.params.locationId;
    let locationName = req.body.locationName;
    let address = req.body.address;

    try {
      locationId = validation.checkId(locationId);
      locationName = validation.checkString(locationName, 'locationName');
      address = validation.checkString(address, 'address');

      return res.render('theftReports', {
        title: 'Report Stolen Bike',
        locationId,
        locationName,
        address,
        hasLocation: true
      });
    } catch (e) {
      return res.status(400).render('theftReports', {
        title: 'Report Stolen Bike',
        error: e
      });
    }
  });

export default router;