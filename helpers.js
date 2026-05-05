import { ObjectId } from 'mongodb';
import axios from 'axios';

const exportedMethods = {
  eq: (a, b) => a === b,

  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatDateTimeLocal: (dateString) => {
    const date = new Date(dateString);

    const pad = (num) => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },

  safetyLetter: (rating) => {
    if (rating < 5) return 'A';
    if (rating < 10) return 'B';
    if (rating < 20) return 'C';
    return 'F';
  },
  
  safetyClass: (rating) => {
    if (rating < 5) return 'safety-a';
    if (rating < 10) return 'safety-b';
    if (rating < 20) return 'safety-c';
    return 'safety-d';
  },

  checkId(id) {
    if (id === undefined) throw 'No ID provided!';
    if (typeof id !== 'string') throw 'Bad Request!';

    id = id.trim();

    if (id.length === 0) throw 'Empty ID!';
    if (!ObjectId.isValid(id)) throw 'Invalid ObjectId!';

    return id;
  },

  checkString(str, fieldName) {
    if (!str || typeof str !== 'string') {
      throw `${fieldName} must be a valid string`;
    }

    str = str.trim();

    if (str.length === 0) {
      throw `${fieldName} cannot be empty`;
    }

    return str;
  },

  checkEmail(email, fieldName = 'Email') {
    email = this.checkString(email, fieldName).toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw `${fieldName} must be a valid email address`;
    }

    return email;
  },

  checkIncidentDate(incidentDate) {
    if (!incidentDate) throw 'Incident date is required';

    const date = new Date(incidentDate);

    if (Number.isNaN(date.getTime())) {
      throw 'Incident date must be a valid date';
    }

    if (date > new Date()) {
      throw 'Incident date cannot be in the future';
    }

    return incidentDate;
  },

  checkNotes(notes) {
    if (!notes) return '';

    if (typeof notes !== 'string') {
      throw 'Notes must be a string';
    }

    notes = notes.trim();

    if (notes.length > 500) {
      return notes.substring(0, 500);
    }

    return notes;
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

  getBoundingCoordinatesForDistance(latitude, longitude, distance) {
    const latitudeToRadians = latitude * Math.PI / 180;
    const latitudeDelta = distance / 69;
    const longitudeDelta = distance / (69 * Math.cos(latitudeToRadians));

    const latMin = latitude - latitudeDelta;
    const latMax = latitude + latitudeDelta;
    const longMin = longitude - longitudeDelta;
    const longMax = longitude + longitudeDelta;

    return { latMin, latMax, longMin, longMax };
  },

  getDistanceBetweenCoordinates(lat1, long1, lat2, long2) {
    const latDelta = lat2 - lat1;
    const longDelta = (long2 - long1) * Math.cos(lat1 * Math.PI / 180);

    return Math.sqrt(latDelta ** 2 + longDelta ** 2);
  },

  async getCoordinatesForAddress(address) {
    address = this.checkString(address, 'Address');

    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'bikesafe-nyc'
        }
      }
    );

    if (!response.data.length) {
      throw new Error('Address not found');
    }

    return {
      latitude: parseFloat(response.data[0].lat),
      longitude: parseFloat(response.data[0].lon)
    };
  }
};

export default exportedMethods;