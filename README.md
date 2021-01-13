## Days Since API
The Days Since API supports the Days Since application linked below by providing the models for users and resources as well as server routes so that information can be stored on a MongoDB database. The main functionality of the app is also in this API which allows for date calculation and comparrison.

### Relevant Links
[Days Since Client Repository](https://github.com/bchin224/days_since_client)
[API Live Server](https://nameless-crag-47108.herokuapp.com/)
[Live Application](https://bchin224.github.io/days_since_client/)

### Planning Story
1/6
- Set up github repository
- Renamed database name to days-since-database
- Build all CRUD action curl scripts
- Build all CRUD action routes

1/7
- Set up herokuapp
- Deployed API

1/8
- Adjusted show, update and delete routes to be owner specific

1/10
- Adjusted virtual to pull date from schema

1/11
- Adjusted virtual to account for leap years every 4 years
- Removed unneccesary comments

### Entity Relationship Diagram
![Days Since App Entity Relationship Diagram](https://i.imgur.com/HticGrG.jpg "Days Since ERD")

### Technologies Used
- Express
- MongoDB
- Mongoose

### Unsolved Problems
- Days since calculation is not 100% accurate. It currently treats all months
as being 30 days long.
