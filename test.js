// const myArgs = process.argv.slice(3);

// // if (myArgs == 'Index 1') {
//     // const 
//     console.log('myArgs: ', `${myArgs}`);
// // } else if {

// // }



// const testArray = [1, 2, 3, 4, 5, 7, 8, 9, 'blank'];

// const myArgs = process.argv.slice(2).toString();
// const args = myArgs.split(',');
// const search = testArray.find(element => element == args[0]);
// const amount = parseInt(args[1]);
//     if (args.length > 1) {
//         console.log(args);
//         console.log('search', search);
//         console.log('amount', amount);
//         if (search != undefined && amount != NaN) {
//             console.log('Sendable tx');
//         } else {
//             console.log('Invalid argument');
//         }
//     } else if (myArgs == 'coins') {
//         console.log('[Display coins]');
//     } else if (myArgs == 'addresses') {
//         console.log('[Display addresses]');
//     } else if (search != undefined) {
//         console.log(search);
//     } else {
//         console.log('Invalid argument');
//     }



        // const args = myArgs.split(',');
        
        // for (let i = 0; i < args.length; i++) {
        //     const index = parseInt(args[i]);
        //     if (isNaN(index)) {
        //         continue;
        //     } else {
        //         console.log(index);
        //     }
        // }
        
        // console.log('index', index);


        // const rl = require('readline').createInterface({
        //     input: process.stdin,
        //     output: process.stdout,
        //   });
          
        //   rl.question(`Confirm tx? `,  => {
        //     if
        //     console.log(`Processing tx...`);
        //     readline.close();
        //   });


        const rl = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout,
          prompt: 'Process tx? '
        });
        
        rl.prompt();
        
        rl.on('line', (line) => {
          switch (line.trim()) {
            case 'y':
              console.log('Processing tx...');
              break;
            case 'n':
              console.log('Cancelling tx...');
              process.exit();
            default:
              console.log(`Invalid response.`);
              break;
          }
          rl.prompt();
        }).on('close', () => {
          console.log('Closing');
          process.exit(0);
        });

        // import inquirer from 'inquirer';

        // const questions = [
        //   {
        //     type: 'input',
        //     name: 'name',
        //     message: "What's your name?",
        //   },
        // ];
        
        // inquirer.prompt(questions).then(answers => {
        //   console.log(`Hi ${answers.name}!`);
        // });