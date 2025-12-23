const mock = require('../utils/mockData');

async function getMemberships(){
  if(process.env.USE_MOCK === '1') return mock.memberships;
  // No real memberships table by default — return mock
  return mock.memberships;
}

module.exports = { getMemberships };
