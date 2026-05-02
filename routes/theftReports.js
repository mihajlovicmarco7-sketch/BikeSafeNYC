import { Router } from 'express';
const router = Router();

import {theftReportsData} from '../data/index.js';

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

    const userId = '69f4d5e9b696a915a905cb6e';
    if (req.session.member) {
        userName = req.session.member.userName;
        // TODO: find userid by name
    }      

    try {

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

      if (result) {
        return res.redirect('/dashboard'); 
      } else {
        return res.status(500).render('theftReports', { error: "Internal Server Error" });
      }

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