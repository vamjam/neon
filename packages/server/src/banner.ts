import process from 'node:process'
import chalk from 'chalk'
import figlet from 'figlet'
import gradientText from 'gradient-string'

//rozzo is based on Fujiyama Black
const banner = figlet.textSync('neon', { font: 'Rozzo' })
const gradient = gradientText('orange', 'hotpink', 'blue').multiline

process.stdout.write(`\n${chalk.yellow('welcometo')}\n${gradient(banner)}\n`)
