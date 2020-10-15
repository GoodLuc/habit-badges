const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const NounProject = require('the-noun-project'),
nounProject = new NounProject({
    key: '620cc0088f5f4b59a2124e6c2ddfc29f',
    secret: '86058a5c621043bb932faa9812360891'
});

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
  const client = await mongodb.MongoClient.connect
  ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
  });
  console.log("Getting month for " + user + " on " + month + " on year " + year)
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
    useNewUrlParser: true, useUnifiedTopology: true
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
      { ...req.body.user, habits: {} },
    );
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});
async function getUsers() {
  const client = await mongodb.MongoClient.connect
  ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
  });
  return client.db('HeroBadge').collection('users')
}

//// Get user
/*router.get('/user/:email', async (req, res) => {
  const user = await getUser(req.params.email, null, 'full');
  console.log('user got:')
  console.log(user)
  res.send(await user.toArray());
});*/

router.get('/checkuser/:email', async (req, res) => {
  const user = await getUser(req.params.email, null, 'check');
  console.log('user got:')
  if (user) {
    res.sendStatus(202)
  } else {
    res.sendStatus(204)
  }
});

//// Add logs
router.post("/validateuser", async (req, res) => {
  const user = await getUser(req.body.email, req.body.password, 'full');
  if (user) {
    res.send(user) 
  } else {
    res.sendStatus(404)
  }
});

async function getUser(email, password, action) {
  const client = await mongodb.MongoClient.connect
  ('mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
  });

  if (action === 'full') {
    let user = client.db('HeroBadge').collection('users').find({ email: email, password: password })
    return await user.toArray()
  } else if (action === 'check') {
    let user = client.db('HeroBadge').collection('users').find({ email: email })
    user = await user.toArray()
    if (await user.length) {
      return true
    } else {
      return false
    }
  }
}

///////////////////////////////////////
/////// I C O N S /////////////////////
///////////////////////////////////////

//// Get icons
router.get('/icons/:term', async (req, res) => {
  console.log("Term: " + req.params.term)
  let icons
  nounProject.getIconsByTerm(req.params.term, {limit: 100}, async function (err, data) {
    if (!err) {
      icons = await data.icons
      res.send(await icons)
    } else {
      console.log("Error:")
      console.log(err)
      res.status(204).send()
    }
  })
});
//// Get icon
router.get('/icon/:id', async (req, res) => {
  console.log("ID: " + req.params.id)
  let icon
  nounProject.getIconById(req.params.id, async function (err, data) {
    if (!err) {
      icon = await data.icon
      res.send(await icon)
    } else {
      console.log("Error:")
      console.log(err)
    }
  })
});

///////////////////////////////////////
/////// B A D G E S ///////////////////
///////////////////////////////////////

//// New badge
router.post("/savebadge", async (req, res) => {
  console.log('Saving badge')
  console.log(req.body.load)
  try {
    const users = await getUsers();
    var habitsId = { $set: {} };
    habitsId.$set['habits.' + req.body.load.habit._id] = req.body.load.habit; 
    await users.updateOne(
      // Filter
      { _id: new mongodb.ObjectID(req.body.load.user) },
      habitsId,
    );
    console.log('Badge saved')
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});

//// update badge
router.post("/updatebadge/:id", async (req, res) => {
  console.log('Updating badge')
  console.log(req.body)
  console.log(req.params)
  try {
    const users = await getUsers();
    await users.updateOne(
      // Filter
      { _id: new mongodb.ObjectID(req.body.user), "habits._id": parseInt(req.params.id) },
      { $set: { "habits.$": req.body.load } },
    );
    console.log('Badge updated')
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;