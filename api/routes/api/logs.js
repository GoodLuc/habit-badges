const express = require('express');
const router = express.Router();
const mongoDB = require('mongodb');

const { nounProject, client } = require('./keys.js');



///////////////////////////////////////
/////// L O G S ///////////////////////
///////////////////////////////////////

//// Get logs
router.post('/getmonth', async (req, res) => {
  const month = await getMonth(req.body.load.user, req.body.load.date.year, req.body.load.date.month);
  res.send(await month.toArray());
});

async function getMonth(user, year, month) {
  return client.db('HeroBadge').collection('logs').find({ "user": user, "year": parseInt(year), "month": parseInt(month)})
}

async function getPoints(action, userID) {
  if (action == "collectAllPoints") {
    let logsall = client.db('HeroBadge').collection('logs').find({ "user": userID })
    logsall = await logsall.toArray()
    let points = 0
    logsall.forEach(function(month) {
      for (const day in month.days) {
        points += parseInt(month.days[day].points)
      }
    })
    return points
  } else if (action == "getSavedPoints") {
    let user = client.db('HeroBadge').collection('users').find({ "_id": new mongoDB.ObjectID(userID) })
    user = await user.toArray()
    return user[0].points
  }
}

//// Update logs
router.post("/update", async (req, res) => {
  try {
    const logs = await getLogs();
    await logs.updateOne(
      // Filter
      { user: req.body.load.user, year: parseInt(req.body.load.date.year), month: parseInt(req.body.load.date.month) },
      { $set: { days: req.body.load.monthLoad.days } },
      { upsert: true }
    );
    let points = await getPoints("collectAllPoints", req.body.load.user)
    const users = await getUsers();
    await users.updateOne(
      // Filter
      { _id: new mongoDB.ObjectID(req.body.load.user) },
      { $set: { points: parseInt(points) } },
      { upsert: true }
    );
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});

async function getLogs() {
  return client.db('HeroBadge').collection('logs')
}

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
      { ...req.body.user, habits: {}, points: 0 },
    );
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});
async function getUsers() {
  return client.db('HeroBadge').collection('users')
}

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

//// Get just point count
router.post('/getpoints', async (req, res) => {
  const points = await getPoints("getSavedPoints", req.body.user)
  res.send(await points.toString());
});

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
      { _id: new mongoDB.ObjectID(req.body.load.user) },
      habitsId,
    );
    console.log('Badge saved')
    res.status(201).send();
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;