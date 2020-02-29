const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get logs
router.get('/', async (req, res) => {
  const logs = await getLogs();
  res.send(await logs.find({}).toArray());
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
  const logs = await getLogs();
  await logs.updateOne(
    // Filter
    { user: req.params.user, month: req.params.today.month },
    { $set: { days: { [req.params.today.day]: req.body.load } } },
		{ upsert: true }
	);
	res.status(201).send();
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


module.exports = router;