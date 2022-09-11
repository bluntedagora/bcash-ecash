const bcash = require("bcash");
const axios = require("axios");

// const mnemonic = new bcash.Mnemonic([insert mnemonic here]);

const master = bcash.hd.fromMnemonic(mnemonic);

const hdkey = master.derivePath("m/44'/899'/0'");

const child = hdkey.derive(0);
const childPrivKey = child.privateKey;
const child2 = hdkey.derive(1);

const keyringArray = [];
const receiveAddrArray = [];
const changeAddrArray = [];

for (let i = 0; i < 20; i++) {
    const receiving = child.derive(i);
    const change = child2.derive(i);
    const keyring = bcash.KeyRing.fromPrivate(receiving.privateKey);
    const change_keyring = bcash.KeyRing.fromPrivate(change.privateKey);
    const address = keyring.getAddress().toString();
    const changeAddr = change_keyring.getAddress().toString();
    keyringArray.push(keyring);
    receiveAddrArray.push(address);
    changeAddrArray.push(changeAddr);
}

 const rl1 = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `
    Welcome to your eCash Wallet

    What would you like to do?
    Enter 'receive' to display the first 20 receiving addresses,
    Enter 'change' to display the first 20 change addresses,
    Enter 'coins' to display coins,
    Or enter 'q' to close wallet

    `
  });
  
  rl1.prompt();
  
  rl1.on('line', (line) => {
    switch (line.trim()) {
      case 'receive':
        console.log('First 20 receiving addresses:');
        for (let i = 0; i < receiveAddrArray.length; i++) {
            console.log('Index '+i, receiveAddrArray[i]);
        }
        break;
      case 'change':
        console.log('First 20 change addresses:');
        for (let i = 0; i < changeAddrArray.length; i++) {
            console.log('Index '+i, changeAddrArray[i]);
        }
        break;
      case 'coins':
        console.log(`
        Loading...
        `);

        (async function() {

            try {
                    const apiUrl = 'https://ecash.badger.cash:8332/';
                    let coinArray = [];
                    let valueArray =[];
                    let utxoArray = [];
                    let indexArray = [];
                    let dataArray = [];
                    /* 
                    
                    The following 'for' loop checks each address in keyringArray
                    - If the address contains a valid UTXO, then:
                        - a Coin is made from the UTXO and added to coinArray
                        - the address containing the UTXO is added to utxoArray
                        - the index of the UTXO within the address is added to utxoArray
                    - If the address does not contain a valid UTXO:
                        - address is skipped, 'for' loop continues
        
                    */
                    for (let i = 0; i < keyringArray.length; i++) {
                        const address = keyringArray[i].getAddress();
                        // Make request to check UTXO
                        const res = await axios.get(`${apiUrl}/coin/address/${address.toString()}`);
                        // const firstUtxo = res.data[0];
                        for (let i = 0; i < res.data.length; i++) {
                            const utxo = res.data[i];
                            if (utxo != undefined) {
                                // const coin = bcash.Coin.fromJSON(utxo);
                                const coin = new bcash.Coin({
                                    version: utxo.version,
                                    height: utxo.height,
                                    script: bcash.Script.fromRaw(utxo.script, 'hex'),
                                    value: utxo.value,
                                    hash: Buffer.from(utxo.hash, 'hex').reverse(),
                                    index: utxo.index
                                });
                                coinArray.push(coin);
                                valueArray.push(`${coin.value}`);
                                utxoArray.push(address.toString());
                                indexArray.push(`${coin.index}`);
                                dataArray.push(res.data[i]);
                            } else {
                                continue;
                            }
                        }
                }
                    if (coinArray.length != 0) {
                        console.log('Coins:');
                        for (let i = 0; i < valueArray.length; i++) {
                            let val = parseInt(valueArray[i]);
                            xecValue = val / 100;
                            console.log('Coin @ '+utxoArray[i], xecValue+' XEC ('+val+' sats)');
                            // console.log('Coin @ '+utxoArray[i]+', index '+indexArray[i]+':', xecValue+' XEC ('+val+' sats)');
                            console.log(dataArray[i]);
                        } 
                    } else {
                        console.log('No coins in wallet');
                    }                   
        
            } catch(error) {
                console.error(error);
            }
        })();
        break;
      case 'q':
        console.log(`
        Closing...
        `);
        process.exit();
      default:
        console.log(`Invalid response.`);
        break;
    }
  }).on('close', () => {
    console.log(`
    Closing...
    `);
    process.exit(0);
  });