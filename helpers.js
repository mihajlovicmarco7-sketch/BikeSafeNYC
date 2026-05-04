//You can add and export any helper functions/validation functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from "mongodb";
import axios from "axios";

const exportedMethods = {
    checkId(id){
        if (id === undefined) throw 'No ID provided!';
        if (typeof id !== 'string') throw 'Bad Request!';
        if (!id) throw 'No ID provided!';
        id = id.trim();
        if (id.length === 0) throw 'Empty ID!';
        if (!ObjectId.isValid(id)) throw 'Invalid ObjectId!';

        return id;
    },

    checkString(value, name) {
        if (!value) throw `You must provide a ${name}`;
        if (typeof value !== 'string') throw `${name} must be a string`;
        value = value.trim();
        if (value.length === 0) throw `${name} cannot be an empty string or just spaces`;
        
        return value;  
    },

    checkNumeric(value, name) {
        if (!value) throw `You must provide a ${name}`;
        if (isNaN(parseFloat(value)) || !isFinite(value)) throw `${name} must be a number`;
        
        return value;  
    },

    checkIncidentDate(date) {
        if (typeof date !== 'string') throw 'Incident date must be a string';
        date = date.trim();
        if (date.length === 0) throw 'Incident date cannot be an empty string or just spaces';
        if (!/^[0-9\-]+$/.test(date)) throw 'Incident date are not digits';
        
        let localDate = date.replace(/-/g, '/');
        const incidentDate = new Date(localDate);
        const today = new Date();

        if (incidentDate > today) throw  'Incident date can not be in future';

        return date;
    },
    
    checkEmail(email) {
        email = this.checkString(email);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw 'Invalid email';
        
        return email;
    },

    checkNotes(value) {
        if (value === undefined || value === null) throw "You must provide Notes";
        if (typeof value !== 'string') throw `${name} must be a string`;
        value = value.trim();
        return value;  
    },

    checkStatus(value) {
        if (!value) throw new Error('status is required');
        if (typeof value !== 'string') throw new Error('Status must be a string');
        value = value.trim();
        if (value !== 'missing' && value !== 'recovered') {
            throw new Error("Invalid status");
        }
        return value;
    },

    getBoundingCoordinatesForDistance(latitude, longitude, distance){
        // Distance input is in miles

        const latitudeToRadians = latitude * Math.PI / 180;
        const latitudeDelta = distance / 69;
        const longitudeDelta = distance / (69 * Math.cos(latitudeToRadians));


        const latMin = latitude - latitudeDelta;
        const latMax = latitude + latitudeDelta;
        const longMin = longitude - longitudeDelta;
        const longMax = longitude + longitudeDelta;

        return {latMin, latMax, longMin, longMax};
    },

    getDistanceBetweenCoordinates(lat1, long1, lat2, long2){
        const latDelta = lat2 - lat1;
        const longDelta = (long2 - long1) * Math.cos(lat1 * Math.PI / 180);

        return Math.sqrt(latDelta ** 2 + longDelta ** 2);
    },

    async getCoordinatesForAddress(address){
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
            params: {
                q: address,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "bikesafe-nyc"
            }
            }
        );

        if (!response.data.length) {
            throw new Error("Address not found");
        }

        return {
            latitude: parseFloat(response.data[0].lat),
            longitude: parseFloat(response.data[0].lon)
        };

    }
};

export default exportedMethods