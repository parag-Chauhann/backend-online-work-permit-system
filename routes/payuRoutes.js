const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { PAYU_KEY, PAYU_SALT } = process.env;
const { db } = require('../firebaseAdmin'); // Ensure this is correctly set up

// Route to generate the hash
router.post('/hash', (req, res) => {
  const { fname, lname, email, amount, transactionId, productinfo } = req.body;

  if (!fname || !lname || !email || !amount || !transactionId || !productinfo) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  if (amount <= 0) {
    return res.status(400).send({ error: 'Amount must be greater than zero' });
  }

  const key = PAYU_KEY;
  const salt = PAYU_SALT;
  const txnid = transactionId;
  const firstname = fname;
  const emailAddr = email;
  const udf1 = '';
  const udf2 = '';
  const udf3 = '';
  const udf4 = '';
  const udf5 = '';

  // Construct the hash string as per the formula provided
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${emailAddr}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  
  console.log('Hash String:', hashString);

  const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  
  console.log('Generated Hash:', hash);

  return res.status(200).send({
    hash: hash,
    transactionId: transactionId,
  });
});


// Route for successful payment
router.post('/success', async (req, res) => {
  console.log('Received request body:', req.body); // Log the request body

  const { txnid, email, amount, productinfo, firstname, status } = req.body;

  if (!txnid || !email || !amount || !productinfo || !firstname || !status) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    // Update Firestore with payment details
    const userDocRef = db.collection('Users').where('email', '==', email).limit(1);
    const userSnapshot = await userDocRef.get();

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userId = userDoc.id;

      await userDoc.ref.update({
        paymentStatus: status === 'success', // Assuming 'success' indicates payment completion
        selectedPlan: productinfo, // Assuming productinfo contains plan details
        purchaseDate: new Date(),
        isAdmin: true
      });
    }

    return res.redirect('https://online-permit-to-work.vercel.app//success');
  } catch (error) {
    console.error('Error updating Firestore:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route for failed payment
router.post('/failure', (req, res) => {
  return res.redirect('https://online-permit-to-work.vercel.app//failure');
});

module.exports = router;
