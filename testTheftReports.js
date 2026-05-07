import {theftReportsData} from './data/index.js';
import { ObjectId } from 'mongodb';
import {closeConnection} from './config/mongoConnection.js';
import {getAllParkingLocations, getParkingLocationById, updateSafetyRating} from './data/locations.js';
import {getUserByUsernameOrEmail, addFavoriteLocation, removeFavoriteLocation} from './data/users.js';

async function main(){

    let result = undefined;
    let id = undefined;
    let locationId = undefined;
    let userId = undefined;

    console.log("---------------------------------------");
    console.log("getAllParkingLocations");
    console.log("---------------------------------------");

    try {
        result = await getAllParkingLocations()
        result = result.slice(0, 3);
        result[0]._id = result[0]._id.toString();
        result[1]._id = result[1]._id.toString();
        result[2]._id = result[2]._id.toString();
        locationId = result[0]._id;
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("getParkingLocationById");
    console.log("---------------------------------------");

    try {
        result = await getParkingLocationById(locationId);
        result._id = result._id.toString();
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("getAllTheftReports");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.getAllTheftReports();
        id = result[2]._id;
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
            'Yellow Cannondale MTB 18',
            'fitness@fit.com',
            '(555)-123-1234',
            'CREATED REPORT'
        );

        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("updateReport");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.updateReport(
            id,   
            "UPDATED bikeDescription",
            "01/01/1980",
            "contact@Email.com",
            "UPDATED contactPhone",
            "UPDATED notes",
            "recovered");

        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }



    console.log("---------------------------------------");
    console.log("updateReportStatus");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.updateReportStatus(id, "missing")
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("addComment");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.addComment(id, userId, "MARCO", "FIRST COMMENT!!!");
        console.dir(result, {depth: null});
        result = await theftReportsData.addComment(id, userId, "TOM", "SECOND COMMENT!!!");
        console.dir(result, {depth: null});

    } catch (e) {
        console.log(e);
    }

/*
    console.log("---------------------------------------");
    console.log("deleteReport");
    console.log("---------------------------------------");

    try {
        result = await theftReportsData.deleteReport(id);
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }
*/
    console.log("---------------------------------------");
    console.log("getAllParkingLocations");
    console.log("---------------------------------------");

    try {
        result = await getAllParkingLocations()
        result[0]._id = result[0]._id.toString();
        console.dir(result[0], {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("updateSafetyRating");
    console.log("---------------------------------------");

    try {
        result = await updateSafetyRating(locationId, 0.5);
        result._id = result._id.toString();
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("getUserByUsernameOrEmail");
    console.log("---------------------------------------");

    try {
        result = await getUserByUsernameOrEmail('marco');
        result.favoriteLocationIds = result.favoriteLocationIds.map((id) => { return id = id.toString()});
        userId = result._id;
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("addFavoriteLocation");
    console.log("---------------------------------------");

    try {
        result = await addFavoriteLocation(userId, locationId);
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    console.log("---------------------------------------");
    console.log("getUserByUsernameOrEmail");
    console.log("---------------------------------------");

    try {
        result = await getUserByUsernameOrEmail('marco');
        result.favoriteLocationIds = result.favoriteLocationIds.map((id) => {return id = id.toString()});

        userId = result._id;
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
    console.log("removeFavoriteLocation");
    console.log("---------------------------------------");

    try {
        result = await removeFavoriteLocation(userId, locationId);
        console.dir(result, {depth: null});
    } catch (e) {
        console.log(e);
    }

    await closeConnection();

    console.log("------------------TEST END-----------------");
}

main();
