### > Wollof 
An application that tracks someone and alerts a guardian if the individual has stepped outside a fixed geofence.

### > Motivation
In many cases, a lot of senior citizens and children want to step outside the house but are often not permitted due to their lack in ability to navigate and taking care of themselves. We have fixed the former part by allowing an SMS based alert system that will let a guardian know if the individual has lost his/her way.

### > Technologies Used

 - ReactJS
 - Redux
 - Twilio (for SMS)
 - NodeJS with Express
 - MongoDB
 
### > How To Install & Run
Open the cloned directory and run `npm install` in root directory and also in the client directory.

    npm install && cd client && npm install

You will need :
 - A mongoDB set up locally or on Atlas and substitue the URI of it in server.js file instead of the local link in the code.
 - A Firebase account with the mobile auth feature enabled to use it for OTP service. Substitute your firebase details in the client/src/firebase.js file.
 - A Twilio account setup to send SMSes.

### > How To Use

   #### 1. Tracking Side ( The one who will be tracked)
   - Signup first and then login.
   - Setup a geofence from the home dashboard page.
   - Share unique id with guardian accounts from left drawer so they can search you.
   - Accept/Decline requests from guardians.
   - Remove guardians who have been added previously.
 
#### 2. Guardian Side

- Signup or login
- In the search page, use the unique id from a tracking account and send them a request.
- You can then track added account from the home page of the dashboard
- You can also remove added accounts from home page.
 
### > What Needs To Be Worked On

 - User interface and designs.

### > How To Contribute ?
Simply raise an issue or make a PR and if valid, i'll merge it to master.

### > Usage Permissions
You can freely edit and clone the code. For personal or commercial use, mail me on dsouzaian2000@gmail.com.

