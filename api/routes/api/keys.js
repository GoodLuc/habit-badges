const NounProject = require('the-noun-project'),
nounProject = new NounProject({
  key: '620cc0088f5f4b59a2124e6c2ddfc29f',
  secret: '86058a5c621043bb932faa9812360891'
});

const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://ombu_test:Kh5MQLgsUx8nVLGE@ombu-cluster1-3qjol.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, keepAlive: false });

module.exports = { nounProject, client }