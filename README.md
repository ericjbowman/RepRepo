RepRepo is a full-stack web app, designed to allow a musicians to login, store a unique list of their repertoire, and compare it to other users’. The app is seeded with 1350 jazz standards that can be added to the user’s list. Once they are in the user’s list, they can only be deleted while tunes created by the user can be updated or deleted. The main purpose of the app is for users to get a list of shared tunes with other users. Musicians can create a set list of tunes everybody knows for jam sessions or gigs.

The app also has a search function that will return results for each list, including the list of users. Users must select their own user name to include themself in the shared repertoire list.

For the back end, I used ruby on rails. For the front end, I used html, css, bootstrap, javascript, and jquery. In future iterations, I would like to add a many-to-many relationship between users and the master list so that adding tunes from the master list doesn’t create new data. I would include a way for users to know which tunes are theirs and editable, and which ones are references to the master list.

I planned this app for a phone by making a wireframe for a vertical screen. Then I planned the tables that would be created in the back end. Once the resources were created, and the master tune-list was seeded, I created the backend for users to get, update, create, and destroy resources.

User Stories:
As an avid jazz musician, I would like to keep track of songs I know.
As a gigging musician, I would like to know which songs the whole band knows to create set lists.
As a musician who frequents jam sessions, I would like to an app to randomly generate a song that I know so that I don't have to think about what to call.
As a music educator, I want an app to keep track of my students repetoire.

Wireframe:
https://imgur.com/pAGbi9x

Api repository:
https://github.com/ericjbowman/RepRepo-api

Api deployemnt:
https://fast-fjord-28821.herokuapp.com

Deployment:
https://ericjbowman.github.io/RepRepo/
