import {theftReportsData} from './data/index.js';
import { ObjectId } from 'mongodb';
import {closeConnection} from './config/mongoConnection.js';
import {getAllParkingLocations} from './data/locations.js';

async function main(){

    let result = undefined;
    let id = undefined;
    let locationId = undefined;
    let userId = undefined;

    console.log("---------------------------------------");
    console.log("getAllTheftReports");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.getAllTheftReports();
        id = result[2]._id;
        locationId = result[2].locationId;
        userId = result[2].userId;
        console.dir(result, {depth: null});
        //console.log(result);
    } catch (e) {
        console.log(e);
    }
    console.log("---------------------------------------");
    console.log("getTheftReportsById");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.getTheftReportsById(id);
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }
 
    console.log("---------------------------------------");
    console.log("getReportsByLocation");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.getReportsByLocation(locationId);
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }
 
    console.log("---------------------------------------");
    console.log("getReportsByUser");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.getReportsByUser(userId);
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("getMissingReports");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.getMissingReports();
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }


    console.log("---------------------------------------");
    console.log("createReport");
    console.log("---------------------------------------");

    try {
    const result = await theftReportsData.createReport(
            userId,
            locationId,
            'Gym Parking Lot',
            '2026-04-02T19:30:00.000Z',
            'Grey Cannondale MTB',
            'fitness@fit.com',
            '(555)-123-1234',
            'CREATED REPORT'
        );

        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("updateReportStatus");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.updateReportStatus(id, "UPDATED!!!")
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("deleteReport");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.deleteReport(id);
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    await closeConnection();

    console.log("------------------TEST END-----------------");
}

main();
