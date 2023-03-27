#!/usr/bin/env node


import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from "gradient-string";
import { createSpinner } from "nanospinner"



let playerName: string;
let difficulty: string;
let answer: number
let tries: number = 5;
let score: number = 100;
let userEntry: number;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const answerCheck = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const welcome = async () => {
    console.clear()
    const rainbowTitle = chalkAnimation.rainbow(
        'Welcome to the numder guess \n'
    );

    await sleep();
    rainbowTitle.stop();

    console.log(`
    ${chalk.bgBlue('HOW TO PLAY')} 
    I am a process on your computer.
    I will generate a random number according to the difficulty u select.
    U will get ${chalk.cyan(`${tries} tries`)} to guess the number.
    Reach the number as soon as possible.
  `);

}

const askName = async () => {
    const answer = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',
        default() {
            return 'Player';
        },
    });

    playerName = answer.player_name;
    // console.log(playerName)
}

const askDifficulty = async () => {
    const answer = await inquirer.prompt({
        name: 'difficulty',
        type: 'list',
        message: 'Choose a level of difficulty',
        choices: [
            "Easy",
            "Medium",
            "Hard",
            "Extreme"
        ]
    });

    difficulty = answer.difficulty;
    return difficulty
    // console.log(difficulty)
}

const gnerateNumber = (range?: 10 | 20 | 50) => {
    if (range === 10) {
        answer = Math.ceil(Math.random() * 10) + 1
    } else if (range === 20) {
        answer = Math.ceil(Math.random() * 20) + 1
    } else if (range === 50) {
        answer = Math.ceil(Math.random() * 50) + 1
    } else {
        answer = Math.ceil(Math.random() * 100) + 1
    }
}

const startGame = async () => {
    for (let i = 1; i <= tries; i++) {
        const question = await inquirer.prompt({
            name: 'entry',
            type: 'number',
            message: 'Guess the number'
        });
        userEntry = question.entry

        const spinner = createSpinner('Checking answer...').start();
        await answerCheck();
        spinner.stop()


        if (answer === userEntry) {
            winner()
        }
        else if (answer - userEntry <= 5 && answer - userEntry > 0 && i < 5) {
            console.log("Almost there. Guess a larger number")
            score = score - 20
        }
        else if (answer - userEntry <= 10 && answer - userEntry > 0 && i < 5) {
            console.log("You are very close. Guess a larger number")
            score = score - 20
        }
        else if (userEntry < answer && i < 5) {
            console.log("Guess a larger number")
            score = score - 20
        }
        else if (userEntry - answer <= 5 && userEntry - answer > 0 && i < 5) {
            console.log("Almost there. Guess a smaller number")
            score = score - 20
        }
        else if (userEntry - answer <= 10 && userEntry - answer > 0 && i < 5) {
            console.log("You are very close. Guess a smaller number")
            score = score - 20
        }
        else if (userEntry > answer && i < 5) {
            console.log("Guess a smaller number")
            score = score - 20
        }
        else if (Number.isNaN(userEntry)) {
            console.error(chalk.bgRed("Please enter a number"))
            i--
        }
        else {
            loser()
        }
    }
}

const winner = async () => {
    console.clear()
    let msg: string = `Congratulations ${playerName}`

    figlet(msg, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        if (data) {
            console.log("\n", gradient.pastel.multiline(data))
        }
    })

    await sleep()
    console.log(gradient.fruit(`\n You earned ${score} points`))
    console.log(chalk.greenBright("\n You have guessed the correct number"))
    process.exit(0)
}

const loser = () => {
    console.clear()
    console.log(chalk.bgRed("\n Better luck next time buddy"))
    process.exit(0)
}


await welcome()
await askName()
difficulty = await askDifficulty()

if (difficulty === "Easy") {
    gnerateNumber(10)
    console.log(chalk.yellow("Choose a number between 0 & 10\n"))
} else if (difficulty === "Medium") {
    gnerateNumber(20)
    console.log(chalk.yellow("Choose a number between 0 & 20\n"))
} else if (difficulty === "Hard") {
    gnerateNumber(50)
    console.log(chalk.yellow("Choose a number between 0 & 50\n"))
} else {
    gnerateNumber()
    console.log(chalk.yellow("Choose a number between 0 & 100\n"))
}
await startGame()