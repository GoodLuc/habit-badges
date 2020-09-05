const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

///////////////////////////////////////
/////// L O G S ///////////////////////
///////////////////////////////////////

//// Get logs
router.get('/:user/:year/:month', async (req, res) => {
  console.log("Year: " + req.params.year + ", Month: " + req.params.month)
  const month = await getMonth(req.params.user, req.params.year, req.params.month);
  res.send(await month.toArray());
});
async function getMonth(user, year, month) {
  console.log("Getting month for " + user + " on " + month + " on year " + year)
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
  
  return client.db('HeroBadge').collection('logs').find({ "user": user, "year": year, "month": month})
}

//// Add logs
router.post("/update/:user/:year/:month", async (req, res) => {
  console.log('Params are:')
  console.log(req.params)
  try {
    const logs = await getLogs();
    await logs.updateOne(
      // Filter
      { user: req.params.user, year: req.params.year, month: req.params.month },
      { $set: { days: req.body.load.days } },
      { upsert: true }
    );
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});
async function getLogs() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
  
  return client.db('HeroBadge').collection('logs')
}

//// Delete logs
router.delete('/:id', async (req, res) => {
  const logs = await getLogs();
  await logs.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
})


///////////////////////////////////////
/////// U S E R S /////////////////////
///////////////////////////////////////

//// New user
router.post("/makeuser", async (req, res) => {
  console.log('Making user. Body is:')
  console.log(req.body)
  try {
    const users = await getUsers();
    await users.insertOne(
      { ...req.body.user },
    );
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});
async function getUsers() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
  
  return client.db('HeroBadge').collection('users')
}

//// Get user
router.get('/user/:email', async (req, res) => {
  const user = await getUser(req.params.email, null, 'full');
  console.log('user got:')
  console.log(user)
  res.send(await user.toArray());
});
router.get('/checkuser/:email', async (req, res) => {
  const user = await getUser(req.params.email, null, 'check');
  console.log('user got:')
  console.log(user)
  if (user) {
    res.sendStatus(202)
  } else {
    res.sendStatus(204)
  }
});
//// Add logs
router.post("/validateuser", async (req, res) => {
  const user = await getUser(null, req.body, 'validate');
  console.log('user got:')
  console.log(user)
  if (user) {
    res.send(user)
  } else {
    res.sendStatus(401)
  }
});
async function getUser(email, token, action) {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
  let user
  if (email != null) {
    user = client.db('HeroBadge').collection('users').find({ email: email })
  } else if (token != null) {
    user = client.db('HeroBadge').collection('users').find({ _id: token })
  }
  
  if ((action === 'full')||(action === 'validate')) {
    return user
  } else if (action === 'check') {
    return (await user.toArray()).length
  }
}



module.exports = router;