const express = require('express');
const router = express.Router();
const { db } = require('../firebaseAdmin'); // Adjust import as necessary
const crypto = require('crypto'); // For generating passwords

// Route for creating user account
router.post('/user/create', async (req, res) => {
  const { fname, lname, email, planId } = req.body;

  if (!fname || !lname || !email || !planId) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    // Check if the user already exists
    const userSnapshot = await db.collection('Users').where('email', '==', email).get();

    if (!userSnapshot.empty) {
      return res.status(400).send({ error: 'User already exists' });
    }

    // Define user details
    const userDetails = {
      firstName: fname,
      lastName: lname,
      email: email,
      password: '123456', // or generate a secure password
      company: "TSM",
      isAdmin: false, // Set true if needed
      selectedPlan: planId,
      paymentStatus: planId !== 'free', // True if not Free plan
      permitsCreated: 0,
      purchaseDate: new Date(),
    };

    // Create the user in the database
    await db.collection('Users').add(userDetails);

    return res.status(200).send({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;