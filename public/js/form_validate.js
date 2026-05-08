const nameForm = document.getElementById('name-form');


if (nameForm){
    nameForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const errorContainer = document.getElementById('name-error-container');
        errorContainer.style.display = 'none';

        const searchTerm = document.getElementById('search-term').value;

        try{
            checkString(searchTerm, 'search term')
            nameForm.submit();
        }catch (error){
            errorContainer.textContent = error;
            errorContainer.style.display = 'block';
        }
    });
}


const coordinatesForm = document.getElementById('coordinates-form');


if (coordinatesForm){
    document.getElementById('use-my-location').addEventListener('click', () => {
        // Use the browser's geolocation API
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('latitude').value = position.coords.latitude;
                document.getElementById('longitude').value = position.coords.longitude;
            }, () => {
                const errorContainer = document.getElementById('coordinates-error-container');
                errorContainer.textContent = 'Error retreiving user location. Enter your coordinates manually on the search screen.'
                errorContainer.style.display = 'block';
            }
        )


    });


    coordinatesForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const errorContainer = document.getElementById('coordinates-error-container');
        errorContainer.style.display = 'none';

        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        const distance = document.getElementById('coord-distance').value;

        try{
            isValidCoordinate(latitude, longitude);
            isValidDistance(distance);
            coordinatesForm.submit();
        } catch (error){
            errorContainer.textContent = error;
            errorContainer.style.display = 'block';
        }
    


    });

}

const theftReportForm = document.getElementById('theft-report-form');

if (theftReportForm) {

    const errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'none';

    theftReportForm.addEventListener('submit', (event) => {

    try {

        checkString(document.getElementById('locationName').value, 'locationName');
        checkIncidentDate(document.getElementById('incidentDate').value);
        checkString(document.getElementById('bikeDescription').value, 'bikeDescription');
        checkEmail(document.getElementById('contactEmail').value, 'contactEmail');
        checkString(document.getElementById('contactPhone').value, 'contactPhone');
        checkNotes(document.getElementById('notes').value);

    } catch (e) {
            event.preventDefault();  
            errorContainer.textContent = e;
            errorContainer.style.display = 'block';
        }
    });
}

function checkString(value, name) {
    if (!value) throw `You must provide a ${name}`;
    if (typeof value !== 'string') throw `${name} must be a string`;
    value = value.trim();
    if (value.length === 0) throw `${name} cannot be an empty string or just spaces`;
    
    return value;  
}

function checkIncidentDate(date) {
    if (typeof date !== 'string') throw 'Incident date must be a string';
    date = date.trim();
    if (date.length === 0) throw 'Incident date cannot be an empty string or just spaces';
    if (!/^[0-9\-]+$/.test(date)) throw 'Incident date are not digits';
    
    let localDate = date.replace(/-/g, '/');
    const incidentDate = new Date(localDate);
    const today = new Date();

    if (incidentDate > today) throw  'Incident date can not be in future';

    return date;
}

function checkEmail(email) {
    email = checkString(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw 'Invalid email';
    
    return email;
}

function checkNotes(value) {
    if (value === undefined || value === null) throw "You must provide Notes";
    if (typeof value !== 'string') throw `${name} must be a string`;
    value = value.trim();
    return value;  
}

function checkStatus(value) {
    if (!value) throw new Error('status is required');
    if (typeof value !== 'string') throw new Error('Status must be a string');
    value = value.trim();
    if (value !== 'missing' && value !== 'recovered') {
        throw new Error("Invalid status");
    }
    return value;
}

function isValidCoordinate(lat, long){
    if (!lat || lat === undefined) throw 'Missing latitude';
    if (!long || long === undefined) throw 'Missing longitude';


    if (lat.trim().length === 0) throw 'Empty latitude';
    if (long.trim().length === 0) throw 'Empty latitude';

    if (isNaN(parseFloat(lat))) throw 'latitude must be a number';
    if (isNaN(parseFloat(long))) throw 'longitude must be a number';

    if (lat < -90 || lat > 90) throw 'Latitude must be within valid boundaries (-90 -> 90)';
    if (long < -180 || long > 180) throw 'Longitude must be within valid boundaries (-180 -> 180)';

    return [parseFloat(lat.trim()), parseFloat(long.trim())]
  }

function isValidDistance(distance){
    if (!distance) return 0.25;

    const distanceNumber = Number(distance);

    if (!isFinite(distanceNumber)) throw 'Distance must be a valid number';
    if (distanceNumber < 0) throw 'Distance must be >= 0';
    
    return distanceNumber;
  }


