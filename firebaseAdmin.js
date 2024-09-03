const admin = require('firebase-admin');
const serviceAccount = require('./permit-to-work-software-firebase-adminsdk-37qoo-17fec4a36b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

const db = admin.firestore();

module.exports = { db };
