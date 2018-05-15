const biotCore = require('biot-core');
const ChannelsManager = require('biot-core/lib/ChannelsManager');

let minAmount = 5000;

async function start() {
	await biotCore.init('test');
	let wallets = await biotCore.getMyDeviceWallets();
	let arrAddresses = await biotCore.getAddressesInWallet(wallets[0]);

	const channelsManager = new ChannelsManager(wallets[0]);
	let list = await channelsManager.list();
	console.error('list', list);
	if (list.length) {
		let isSent = false;
		console.error('start recovery');
		let channel = channelsManager.recoveryChannel(list[0]);
		channel.events.on('error', error => {
			console.error('channelError', channel.id, error);
		});
		channel.events.on('start', () => {
			console.error('channel start. t.js', channel.id);
		});
		channel.events.on('changed_step', (step) => {
			console.error('changed_step: ', step);
		});
		channel.events.on('new_transfer', async (amount) => {
			if (!isSent) {
				console.error('new_transfer: ', amount);
				console.error('transfer', await channel.transfer(5));
				isSent = true;
			}
		});
		await channel.init();
		console.error('init');
		await channel.approve();
		// console.error('channel', channel);
		console.error(channel.info());
	} else {
		let balance = await biotCore.getAddressBalance(arrAddresses[0]);
		console.error('balance', balance);
		if (balance.base.stable < minAmount) {
			return console.error('Please use the faucet or replenish your account')
		}

		channelsManager.events.on('newChannel', async (objInfo) => {
			let isSent = false;
			console.error('new Channel: ', objInfo);
			let channel = channelsManager.getNewChannel(objInfo);
			channel.events.on('error', error => {
				console.error('channelError', channel.id, error);
			});
			channel.events.on('start', () => {
				console.error('channel start. t.js', channel.id);
			});
			channel.events.on('changed_step', (step) => {
				console.error('changed_step: ', step);
			});
			channel.events.on('new_transfer', async (amount) => {
				if (!isSent) {
					console.error('new_transfer: ', amount);
					console.error('transfer', await channel.transfer(5));
					isSent = true;
				}
			});
			await channel.init();
			if (channel.myAmount === 100) {
				await channel.approve();
			} else {
				await channel.reject();
			}
			console.error(channel.info());
		});
	}
}

start().catch(console.error);