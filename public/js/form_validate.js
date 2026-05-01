const nameForm = document.getElementById('name-form');


if (nameForm){
    nameForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const errorContainer = document.getElementById('name-error-container');
        errorContainer.style.display = 'none';

        const searchTerm = document.getElementById('search-term').value;

        try{

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
    
        coordinatesForm.submit();


    });

}