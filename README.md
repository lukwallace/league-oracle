# Notes
## On .env files
Environment variables are filled by the .env files which are found *where the file executed from.*
Example: 
  ```
  // Will try to use a nonexistant .env file in the root directory
  node server/server.js

  // Will use the .env file located in the server/ folder.
  cd server/
  node server.js
  ``` 

# Roadmap
~* Build out server side to properly query data~
* Build out mocks for frontend display (In progress)
* Setup database to store query data -- Redis
* Set up scheduling system to call worker scripts
* Integrate the two
* Bust out responsive web augments
* Edit for scalablility





