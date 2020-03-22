const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get logs
router.get('/', async (req, res) => {
  const logs = await getLogs();
  res.send(await logs.find({}).toArray());
});

// Get logs
router.get('/:user/:month/:day', async (req, res) => {
  console.log("Month is "+req.params.month)
  const today = await getToday(req.params.user, req.params.month);
  res.send(await today.toArray());
});

// Add logs
router.post('/', async (req, res) => {
  const logs = await getLogs();
  await logs.insertOne({
    text: req.body.text,
    createdAt: new Date()
  })
  res.status(201).send();
})

// Add logs
router.post("/update/:user/", async (req, res) => {
  try {
    const logs = await getLogs();
    await logs.updateOne(
      // Filter
      { user: req.params.user, month: req.body.load.month },
      { $set: { days: { [req.body.load.day]: req.body.load } } },
      { upsert: true }
    );
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});


// Delete logs
router.delete('/:id', async (req, res) => {
  const logs = await getLogs();
  await logs.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
})

async function getLogs() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
  
  return client.db('HeroBadge').collection('logs')
}

async function getToday(user, month) {
  console.log("Getting today for " + user + " on " + month)
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
  
  return client.db('HeroBadge').collection('logs').find({ "user": user, "month": parseInt(month)})
}


module.exports = router;