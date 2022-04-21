# Progressive learning webapplication

Progressive learning is a general purpose knowledge management system.
The main features of the app are: 
* Enable users to create learning-goals and categorize them.
* Users can store, manage and refer to their resource link URL's in a central place instead of constantly looking them up.

The app is developed using the SERN(Sequelize, Express, React, Node) stack
and with MYSQL as the database. It consists of a server and front-end module
which are run separately.

## Features

* Create learning-goals and structure them in several 'learning' units(e.g. chapters, parts).
* Add resource URL's/images related to a unit.
* Write summaries about a unit and the related material.
* Keep track of progress on learning-goals by marking units as complete or incomplete.
* Organize learning-goals into subjects.

## Usage

In order to build the app yourself follow these steps: 

1. Clone the repository. 
2. Add a `.env` file and configure the following environment variables: 
    * `DB_USER`, `DB_PASS`, `PORT`, `JWT_SECRET`, `JWT_EXPIRATION`, `COOKIE_SECRET`
    * By default the `mysql` database is used, you can however switch to a `sqlite` database if you do not wish to persist data.        
4. Navigate to the `server` folder and enter the following command: `node start`.
5. Navigate to the `front-end` folder and enter the following command: 
``ng serve``.
6. Navigate in your browser to the following URL: `localhost:3000`.
7. The app is now ready for use.



