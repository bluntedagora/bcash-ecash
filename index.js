/**
 *                  Bitcoin Mystery School: Level One Wallet (Modified for eCash, September 2022)
 */

/* 
*
* Valid command line arguments: 
* 
* receive                               (displays first 20 receiving addresses in wallet)
* change                                (displays first 20 change addresses in wallet)
* coins                                 (displays coins in wallet)
* [address] [amount]                    (sets destinationAddress and amountToSend)
* [address1] [address2] [amount]        (sets destinationAddress[address1], changeAddress[address2], and amountToSend)
*
*/

// Prints wallet name
console.log("agoralife eCash wallet");

// Brings in bcash library
const bcash = require("bcash");
// console.log("bcash", bcash);

// Brings in axios library
const axios = require("axios");

// const newMnemonic = new bcash.Mnemonic( {language:"english"} );
// console.log("newMnemonic", newMnemonic.toString());

// Initializes a new Mnemonic string (pre-generated from code on lines 15-16)
// const mnemonic = new bcash.Mnemonic("[insert mnemonic here]");

// process.exit();

//console.log("mnemonic", mnemonic.toString());

// const phraseString = mnemonic.toString();

// console.log("phraseString", phraseString);

// const phraseArray = phraseString.split(' ');

// Creates a joinWords function to [re]join words from an array
// const joinWords = function (wordArray) {
//     let joinedPhrase = '';
//     for (let i = 0; i < wordArray.length; i++) {
//         const word = wordArray[i];
//         if (i == 0) {
//             joinedPhrase = word;
//         } else {
//             joinedPhrase = joinedPhrase + ' ' + word;
//         }
    
//     // console.log('phraseArray['+i+']', word);
//     }
//     return joinedPhrase;
// }

// console.log("joinWords(phraseArray):", joinWords(phraseArray));

// console.log("phraseArray", phraseArray)

// phraseString = phraseArray.join(" ");           // won't work unless you change const phraseString to let phraseString (line 27)

// console.log("joinedPhrase: ", joinedPhrase);

const master = bcash.hd.fromMnemonic(mnemonic);

const hdkey = master.derivePath("m/44'/899'/0'");

// Initializes extended public key (xpubkey)
// const xpub = hdkey.xpubkey();
// console.log("hdkey.xpubkey()", xpub);

const child = hdkey.derive(0);                  // Pass 0 into this derive function for receiving addresses, 1 for change addresses
const childPrivKey = child.privateKey;
const child2 = hdkey.derive(1);

// const firstReceiving = child.derive(0);
// const keyring = bcash.KeyRing.fromPrivate(firstReceiving.privateKey);
// const address = keyring.getAddress();
// const wif = keyring.getPrivateKey("base58");
// const ringFromWif = bcash.KeyRing.fromSecret(wif);

// console.log('address', address.toString());  // Prints first receiving address
// console.log('wif', wif);                     // Prints private key of first receiving address
// console.log('ringFromWif', ringFromWif);     // Prints keyring from wif (private key)


/* 
* Initializes keyringArray and addressArray, then 
* - adds the keys of the first 20 receiving addresses to keyringArray
* - adds the first 20 receiving addresses to addressArray
*/
const keyringArray = [];
const addressArray = [];
const changeAddrArray = [];
for (let i = 0; i < 20; i++) {
    const receiving = child.derive(i);
    const change = child2.derive(i);
    const keyring = bcash.KeyRing.fromPrivate(receiving.privateKey);
    const change_keyring = bcash.KeyRing.fromPrivate(change.privateKey);
    const address = keyring.getAddress().toString();
    const changeAddr = change_keyring.getAddress().toString();
    // console.log("address at index "+i+":", keyring.getAddress().toString());
    keyringArray.push(keyring);
    addressArray.push(address);
    changeAddrArray.push(changeAddr);
}

// console.log('keyringArray', keyringArray);

// Prints indexes + addresses from keyringArray
// for (let i = 0; i < keyringArray.length; i++) {
//     console.log("address at index "+i+":", keyringArray[i].getAddress().toString());
// }

// Prints the first 20 addresses from keyringArray
// const showAddresses = function(keyringArray) {
//     let receivingAddresses = [];
//     for (let i = 0; i < keyringArray.length; i++) {
//         const receiving = keyringArray[i];
//         const keyring = bcash.KeyRing.fromPrivate(receiving.privateKey);
//         const address = keyring.getAddress();
//         receivingAddresses.push(address.toString());
//     }
//     return receivingAddresses;
// }


// console.log('showAddresses', showAddresses(keyringArray));

// process.exit();

const myArgs = process.argv.slice(2).toString();
const args = myArgs.split(',');
const validXECaddress = args[0].includes('ecash:q');

// const search = addressArray.find(element => element == args[0]);
const search2 = changeAddrArray.find(element => element == args[1]);
// const search3 = changeAddrArray.find(element => element == args[0]);
const search4 = addressArray.find(element => element == args[1]);
const amount1 = parseInt(args[1]);
const amount2 = parseInt(args[2]);

// console.log(myArgs.includes('ecash:q'));
// process.exit();

// Processes command line input, checks if it is a valid argument:
// - If input is 'receive' or 'change', the first 20 corresponding addresses will be displayed
// - If input is not 'receive' or 'change' but still appears to be valid, 'Loading...' will be displayed
// - If input is invalid, then 'Invalid argument' will be displayed and the process will exit.

    if (myArgs == 'receive') {
        console.log('First 20 receiving addresses:');
        for (let i = 0; i < addressArray.length; i++) {
            console.log('Index '+i, addressArray[i]);
        }
        return;
    } else if (myArgs == 'change') {
        console.log('First 20 change addresses:');
        for (let i = 0; i < changeAddrArray.length; i++) {
            console.log('Index '+i, changeAddrArray[i]);
        }
        return;
    } else if (myArgs != 'coins' && validXECaddress == false) {
    //   else if (search == undefined && search2 == undefined && search3 == undefined && search4 == undefined && myArgs != 'coins') {
        console.log('Invalid argument');
        return;
    }

console.log("Loading...");

(async function() {

    try {
            const apiUrl = 'https://ecash.badger.cash:8332/';
            let coinArray = [];
            let valueArray =[];
            let utxoArray = [];
            let indexArray = [];
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
                    } else {
                        continue;
                    }
                }
        }

        // console.log('coinArray', coinArray);
        // console.log('addressArray', addressArray);
        // console.log('indexArray', indexArray);

        // Continues to check if command line input is a valid argument
        // If input includes a receiving or change address i

        // console.log('search', search);
        // console.log('search2', search2);

        let destinationAddress = '';
        let changeAddress = changeAddrArray[0];
        let amountToSend = 0;
        let xecValue = 0;

            // console.log('changeAddress', changeAddress);

            // Prototype (for intra-wallet activities)
            /*
            if (args.length > 2) {
                if (search != undefined && search2 != undefined) {
                    amountToSend = parseInt(args[2]);
                    if (amountToSend != NaN) {
                        destinationAddress = search;
                        changeAddress = search2;
                        xecValue = amountToSend / 100;
                        console.log('Send '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' & set change address to '+changeAddress);
                    } else {
                        console.log('Invalid argument');
                        return;
                    }
                } else if (search3 != undefined && search4 != undefined) {
                    amountToSend = parseInt(args[2]);
                    if (amountToSend != NaN) {
                        destinationAddress = search3;
                        changeAddress = search4;
                        xecValue = amountToSend / 100;
                        console.log('Send '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' & set change address to '+changeAddress);
                    } else {
                        console.log('Invalid argument');
                        return;
                    }
                } else if (search3 != undefined && search2 != undefined) {
                    amountToSend = parseInt(args[2]);
                    if (amountToSend != NaN) {
                        destinationAddress = search3;
                        changeAddress = search2;
                        xecValue = amountToSend / 100;
                        console.log('Send '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' & set change address to '+changeAddress);
                    } else {
                        console.log('Invalid argument');
                        return;
                    }
                } else if (search != undefined && search4 != undefined) {
                    amountToSend = parseInt(args[2]);
                    if (amountToSend != NaN) {
                        destinationAddress = search;
                        changeAddress = search4;
                        xecValue = amountToSend / 100;
                        console.log('Send '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' & set change address to '+changeAddress);
                    } else {
                        console.log('Invalid argument');
                        return;
                    }
                }
            } else if (args.length > 1) {
                let amount = parseInt(args[1]);
                if (search != undefined && amount != NaN) {
                    destinationAddress = search;
                    amountToSend = amount;
                    xecValue = amountToSend / 100;
                    console.log('Send '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress);
                } else if (search3 != undefined && amount != NaN) {
                    destinationAddress = search3;
                    amountToSend = amount;
                    xecValue = amountToSend / 100;
                    console.log('Send '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' (default change address: '+changeAddress+')');
                }  else {
                    console.log('Invalid argument');
                    return;
                } 
            } else if (myArgs == 'coins') {
                    console.log('Coins:');
                    if (coinArray.length != 0) {
                        for (let i = 0; i < valueArray.length; i++) {
                            let val = parseInt(valueArray[i]);
                            let xecValue = val / 100;
                            console.log('Coin @ '+utxoArray[i], xecValue+' XEC ('+val+' sats)');
                            // console.log('Coin @ '+utxoArray[i]+', index '+indexArray[i]+':', xecValue+' XEC ('+val+' sats)');
                        } 
                        return;
                    } else {
                        console.log('No coins in wallet');
                        return;
                    }
            } else {
                console.log('Invalid argument');
            }
            */

        if (args.length > 2) {
            // const validChng = args[1].includes('ecash:q');
            // if (validXECaddress == true && validChng == true && search2 != undefined && search4 != undefined && amount2 != NaN) {
            if (validXECaddress == true && search2 != undefined && amount2 != NaN) {
                destinationAddress = args[0];
                changeAddress = search2;
                amountToSend = amount2;
                xecValue = amountToSend / 100;
                console.log('Sending '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' & set change address to '+changeAddress);
                
            } else if (validXECaddress == true && search4 != undefined && amount2 != NaN) {
                destinationAddress = args[0];
                changeAddress = search4;
                amountToSend = amount2;
                xecValue = amountToSend / 100;
                console.log('Sending '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' & set change address to '+changeAddress);
                
            } else {
                console.log('Invalid argument');
            }
        } else if (args.length > 1 && amount1 != NaN) {
            destinationAddress = args[0];
            amountToSend = amount1;
            xecValue = amountToSend / 100;
            console.log('Sending '+xecValue+' XEC ('+amountToSend+' sats) to '+destinationAddress+' (default change address: '+changeAddress+')');
        } else if (myArgs == 'coins') {
            console.log('Coins:');
            if (coinArray.length != 0) {
                for (let i = 0; i < valueArray.length; i++) {
                    let val = parseInt(valueArray[i]);
                    xecValue = val / 100;
                    console.log('Coin @ '+utxoArray[i], xecValue+' XEC ('+val+' sats)');
                    // console.log('Coin @ '+utxoArray[i]+', index '+indexArray[i]+':', xecValue+' XEC ('+val+' sats)');
                } 
                return;
            } else {
                console.log('No coins in wallet');
                return;
            }
    } else {
        console.log('Invalid argument');
    }

            // Make a coin from the UTXO
            // const coin = bcash.Coin.fromJSON(firstUtxo);

            // const coin = new bcash.Coin({
            //     version: firstUtxo.version,
            //     height: firstUtxo.height,
            //     script: bcash.Script.fromRaw(firstUtxo.script, 'hex'),
            //     value: firstUtxo.value,
            //     hash: Buffer.from(firstUtxo.hash, 'hex').reverse(),
            //     index: firstUtxo.index
            // });

// console.log(bcash.Script.fromRaw(firstUtxo.script, 'hex'));

    // Create transaction
    const tx = new bcash.MTX();

    // Instantiate opreturn
    const opreturn = new bcash.Script().pushSym('return').pushString('Bitcoin is not money').compile();

    // const destinationAddress = keyringArray[1].getAddress();    // Sets receiving address at index 1 as destinationAddress
    tx.addOutput(opreturn, 0);
    tx.addOutput(destinationAddress, amountToSend);                // Send amountToSend to destinationAddress

    await tx.fund(coinArray, {
        changeAddress: changeAddress,                              // Designates address as the change address
        rate: 1000 // satoshis per 1000 bytes
    })

    tx.sign(keyringArray);

    const hex =tx.toRaw().toString('hex');
    console.log('hex', hex);

// Create prompt "Confirm tx?"
const rl = require('readline').createInterface({
input: process.stdin,
output: process.stdout,
prompt: `
Confirm transaction? (y/n)
`
});
              
rl.prompt();
              
rl.on('line', (line) => {
    switch (line.trim()) {
    case 'y':
        console.log('Processing tx...');
        (async function() {
            try {
                const broadcastRes = await axios.post(`${apiUrl}/broadcast`, {
                    tx: hex
                });
                console.log('broadcastRes.data', broadcastRes.data);
                console.log(xecValue+' XEC ('+amountToSend+' sats) have been sent to '+destinationAddress)
                process.exit();
            } catch(error) {
                console.error('error');
            }
        })();
        break;
    case 'n':
        console.log('Cancelling tx...');
        process.exit();
    default:
        console.log(`
        Invalid response.`);
        rl.prompt();
        break;
        }
}).on('close', () => {
    console.log(`
    Closing...
    `);
    process.exit(0);
});

    } catch(error) {
        console.error('error');
    }
})();
