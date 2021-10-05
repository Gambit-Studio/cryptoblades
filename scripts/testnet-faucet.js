const SkillToken = artifacts.require('SkillToken');
const argv = require('yargs')(process.argv.slice(2)).demandOption('to').string('to').argv

/**
 * Usage: `truffle exec scripts/testnet-faucet.js --to=0x01 [--network <name>] [--compile]`
 */
async function testnetFaucet() {
  const accs = await web3.eth.getAccounts();
  const to = argv.to;

  const skillToken = await SkillToken.deployed();

  console.log(skillToken.address);

  const balance = await skillToken.balanceOf(accs[0]);
  console.log(`balance`, web3.utils.fromWei(balance));

  await skillToken.transfer(to, web3.utils.toWei('1', 'ether'));

  const recipientBalance = await skillToken.balanceOf(to);
  console.log(`recipientBalance`, web3.utils.fromWei(recipientBalance));

}

module.exports = (callback) => {
  return testnetFaucet().catch(console.error).finally(callback);
};
