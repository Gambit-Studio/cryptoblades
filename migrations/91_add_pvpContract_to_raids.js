const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const { artifacts } = require("hardhat");

const Raid1 = artifacts.require("Raid1");
const PvpArena = artifacts.require("PvpArena");

module.exports = async function (deployer) {
  const raids = await Raid1.deployed();
  const pvpArena = await PvpArena.deployed();
  const _raids = await upgradeProxy(raids.address, Raid1, { deployer });
  _raids.migrateTo_PvpArena(pvpArena.address);
};
