const biotCore = require('biot-core');
const Channel = require('biot-core/lib/Channel');
const ChannelsManager = require('biot-core/lib/ChannelsManager');

let minAmount = 5000;
let peerPairingCode = 'A/btqLlcKH48tArT0MFtOv4pFdxwlpcyCLXJ/yBGECAG@byteball.org/bb-test#test';
let peerDeviceAddress = '024ENIFM6JNZQJ4M5B53EMVIW7YDR4SCW';

async function start() {
	await biotCore.init('test');
	const device = require('byteballcore/device');
	let myDeviceAddress = device.getMyDeviceAddress();
	let wallets = await biotCore.getMyDeviceWallets();
	let arrAddresses = await biotCore.getAddressesInWallet(wallets[0]);

	await biotCore.addCorrespondent(peerPairingCode);

	const channelsManager = new ChannelsManager(wallets[0]);
	let list = await channelsManager.list();
	if (list.length) {
		let channel = channelsManager.restoreChannel(list[0]);
		channel.events.on('error', error => {
			console.error('channelError', channel.id, error);
		});
		channel.events.on('start', async () => {
			console.error('channel start. t.js', channel.id);
			console.error('info', channel.info());
		});
		channel.events.on('changed_step', (step) => {
			console.error('changed_step: ', step);
		});
		channel.events.on('new_transfer', async (amount) => {
			console.error('new_transfer: ', amount);
			console.error('transfer', await channel.transfer(15));
			console.error('close', await channel.closeMutually());
		});
		await channel.init();
		console.error('transfer', await channel.transfer(10));
		console.error('info', channel.info());
	} else {
		let balance = await biotCore.getAddressBalance(arrAddresses[0]);
		console.error('balance', balance);
		if (balance.base.stable < minAmount) {
			return console.error('Please use the faucet or replenish your account')
		}

		let channel = new Channel(wallets[0], myDeviceAddress, peerDeviceAddress, null, 100, 100, 10);
		channel.events.on('error', error => {
			console.error('channelError', channel.id, error);
		});
		channel.events.on('start', async () => {
			console.error('channel start. t.js', channel.id);
			console.error('info', channel.info());
			console.error('transfer', await channel.transfer(10));
		});
		channel.events.on('changed_step', (step) => {
			console.error('changed_step: ', step);
		});
		channel.events.on('new_transfer', async (amount) => {
			console.error('new_transfer: ', amount);
			console.error('transfer', await channel.transfer(15));
			console.error('close', await channel.closeMutually());
		});
		console.error('init', await channel.init());
		console.error('test', channel.info());
	}
}

start().catch(console.error);