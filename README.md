# BikeSafe NYC - Group 23 CS546WN

BikeSafe NYC is a data-driven web application designed to help cyclists in New York City find safe and reliable bike racks to secure their bicycles to. Using data from the city of New York, users will have access to a list of all bike racks available in the city, and can find the nearest bike parking to their location.


## Usage
1. Clone the `main` branch of this repo
2. Once the project is open, run `npm install`
3. Seed the database with data using `npm run seed`
4. Run the application using `npm run start`
5. Visit `http://localhost:3000/` in your browser


## Core Features

* Browse/Search Bike Parking Locations  
  * View a list of official NYC bike parking locations  
  * Search or filter locations by area  
  * Find nearest bike parking using current location or an entered address  
  * Each location displays its address and current safety rating score  
* Report Stolen Bike  
  * Users can submit a report for a stolen bike  
  * Reports will have a negative impact on the bike parking safety score of a location  
  * Reports will include location, time of theft, bike information, contact information  
* User Dashboard  
  * View all theft reports submitted by a user  
  * Allow users to edit their previously submitted reports  
  * Users can delete their reports if desired  
* Location Detail Page:  
  * Display location name and address  
  * Show safety rating score for the location  
  * Show all theft reports submitted by users for that location  
  * “Report Stolen Bike” button, which creates a pre-filled form for users to submit a stolen bike request for that location  
* Board of Currently Missing Bikes  
  * When a user reports a bike stolen, it will be displayed on the site in a list of currently missing bikes  
  * If the bike is recovered, the user can update their report, and the listing will be removed  
  * Allows users to comment on other user’s missing bike posts

## Additional Feature
* Favorite Locations  
  * Users can add a number of locations to their favorites  
  * Users can then quickly access to the location detail pages of their favorite bike parking locations  
  * Favorited locations will have a higher priority suggestion when a user is searching or creating reports