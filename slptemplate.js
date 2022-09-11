const bcash = require("bcash");
// const Script = require("Script");
const slptemplate = ['04','534c5000','01'];

const rl1 = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `
    Token type? (Default: 1) 
    `
  });
  
  rl1.prompt();
  
  rl1.on('line', (line) => {
    switch (line.trim()) {
      case '1':
        slptemplate.push('01');
        break;
      case '2':
        slptemplate.push('02');
        break;
      case '3':
        slptemplate.push('03');
        break;
      case '4':
        slptemplate.push('04');
        break;
      default:
        slptemplate.push('01');
        break;
    }
    rl1.close();
  }).on('close', () => {
    console.log('Closing');
    process.exit(0);
  });
  
const rl2 = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `
    Transaction type? (Default: GENESIS) 
    `
  });
  
  rl2.prompt();
  
  rl2.on('line', (line) => {
    switch (line.trim()) {
      case 'GENESIS':
        slptemplate.push('07');
        slptemplate.push('47454e45534953');
        break;
      case 'MINT':
        slptemplate.push('04');
        slptemplate.push('4d494e54');
        break;
      case 'SEND':
        slptemplate.push('04');
        slptemplate.push('53454e44');
        break;
      case 'BATON':
        slptemplate.push('05');
        slptemplate.push('4241544f4e');
        break;
      case 'BURN':
        slptemplate.push('04');
        slptemplate.push('4255524e');
        break;
      default:
        slptemplate.push('07');
        slptemplate.push('47454e45534953')
        break;
    }
    rl2.close();
  }).on('close', () => {
    console.log('Closing');
    process.exit(0);
  });  

  const rl3 = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  rl3.question(`
  Token ticker? `, name => {
    const ticker = `${name}`;
    const tickerHex = ticker.getJSON();
    readline.close();
  });