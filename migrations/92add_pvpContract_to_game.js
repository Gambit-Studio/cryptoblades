const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const CryptoBlades = artifacts.require("CryptoBlades");
const PvpArena = artifacts.require("PvpArena");

module.exports = async function (deployer) {
  const game = await CryptoBlades.deployed();
  const pvpArena = await PvpArena.delpoted();
  const _game = await upgradeProxy(game.address, CryptoBlades, { deployer });
  _game.migrateTo_PvpArena(pvpArena.address);
};
