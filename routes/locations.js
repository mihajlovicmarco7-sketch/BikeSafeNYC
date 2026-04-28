import { Router } from "express";
const router = Router();
import { getAllParkingLocations, getParkingLocationById, searchParkingLocationsByName, getParkingLocationsByCoordinates} from "../data/locations.js";
import validation from '../helpers.js'


router
    .route("/")
    .get(async (req, res) => {
        try {
            const locations = await getAllParkingLocations(req.params.id);
            return res.render('locations/locations_search', { locations });
        } catch (e) {
            return res.status(500).render('error', { error: e });
        }
    });

router
    .route("/find/coordinates")
    .get(async (req, res) => {
        try {
            let {latitude, longitude, distance} = req.query;    
            // Example: http://localhost:3000/locations/find?latitude=40.0&longitude=-74.2&distance=0.5
            // Min: (Staten Island): 40.506011, -74.246361
            // Max: (Rye) 40.907993, -73.700283

            // Example for sorting: http://localhost:3000/locations/find?latitude=40.707&longitude=-73.973&distance=1
            // 102 S 6 ST Large Hoop is indexed earlier in the DB, but 50 DIVISION AV U Rack is closer by distance

            latitude = parseFloat(latitude);
            longitude = parseFloat(longitude);
            distance = distance ? parseFloat(distance) : .25;

            // if (!latitude || latitude === undefined) throw 'Missing latitude!';
            if (!longitude || latitude === longitude) throw 'Missing longitude!';
            if (!distance || distance === undefined) throw 'Missing distance!';



            const {latMin, latMax, longMin, longMax}  = validation.getBoundingCoordinatesForDistance(latitude, longitude, distance);

            const locations = await getParkingLocationsByCoordinates(latMin, latMax, longMin, longMax, latitude, longitude);

            const locationsMax = locations.length === 50; 

            const backLink = `/locations/find/coordinates?latitude=${latitude}&longitude=${longitude}&distance=${distance}`;

            return res.render('locations/locations_search_result', { 
                locations, 
                searchTerm: `${latitude}, ${longitude}`,
                locationsMax,
                backLink: encodeURIComponent(backLink)});
        } catch (e) {
            return res.status(404).json({error: e});
        }
    });

router
    .route("/find/address/:address")
    .get(async (req, res) => {
        try {
            // Example: http://localhost:3000/locations/find/address/89 E 42nd St, New York, NY 10017?distance=0.25

            const address = req.params.address;
            if (!address || address === undefined) throw 'Missing address!';

            // Relies on https://nominatim.openstreetmap.org/search API
            const {latitude, longitude} = await validation.getCoordinatesForAddress(address);
            const distance = parseFloat(req.query.distance);
            
            if (!latitude || latitude === undefined) throw 'Missing latitude!';
            if (!longitude || latitude === undefined) throw 'Missing longitude!';
            if (!distance || distance === undefined) throw 'Missing distance!';

            const {latMin, latMax, longMin, longMax}  = validation.getBoundingCoordinatesForDistance(latitude, longitude, distance);

            const locations = await getParkingLocationsByCoordinates(latMin, latMax, longMin, longMax, latitude, longitude);
            return res.json(locations);
        } catch (e) {
            return res.status(404).json({error: e});
        }
    });
router
    .route("/search")
    .get(async (req, res) => {
        /**
         * Note: Spaces in URLs are encoded as - %20
         * But express automatically decodes %20 back into spaces, so no additional handling needed
         * example: http://localhost:3000/locations/search/grand conc
         */

        if(!req.query.searchTerm){
            return res.render('locations/locations_search');
        }


        try {
            const locations = await searchParkingLocationsByName(req.query.searchTerm);

            // If > 50 locations are returned, we cap the display at 50 and display a tag in locations_search_result.handlebars
            const locationsMax = locations.length === 50; 

            const backLink = `/locations/search?searchTerm=${encodeURIComponent(req.query.searchTerm)}`;
            
            return res.render('locations/locations_search_result', { 
                locations, 
                searchTerm: req.query.searchTerm, 
                locationsMax,
                backLink: encodeURIComponent(backLink)
             });
        } catch (e) {
            console.log(e);
            return res.status(404).json({error: e});
        }
    });

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const location = await getParkingLocationById(req.params.id);
            // return res.json(locations);
            return res.render('locations/parking_location', { 
                location, 
                searchTerm:req.query.searchTerm,
                backLink: req.query.backLink ? decodeURIComponent(req.query.backLink) : '/locations/search'});
        } catch (e) {
            return res.status(404).json({error: e});
        }
    });







export default router;