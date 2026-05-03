import validation from '../helpers.js'
import { Router } from 'express';
const router = Router();

import {theftReportsData} from '../data/index.js';
import {updateSafetyRating} from '../data/locations.js';

router
  .route('/')
  .get(async (req, res) => {
    try {
      res.render('theftReports', { title: 'Report Stolen Bike', hasLocation: false });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
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
      // validate inputs
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
        return res.status(500).render('theftReports', { error: "Internal Server Error" });
      } 
      
      await updateSafetyRating(locationId, 0.5);
      return res.redirect('/dashboard'); 

    } catch (e) {
      return res.status(400).render('theftReports', { 
        error: e, 
        formData: req.body 
      });
    }
  });

router
    .route("/:locationId")
  .post(async (req, res) => {
    const locationId = req.params.locationId;
    const locationName = req.body.locationName;
    const address = req.body.address;

    return res.render('theftReports', 
      { title: 'Report Stolen Bike', 
        locationId: locationId, 
        locationName: locationName,
        address: address });

  });

export default router;