#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { Command } = require('commander')
var program = new Command()
const YAML = require('yaml')


function readCommandFile( commandsFilePath ){
    const data = fs.readFileSync(commandsFilePath,{ encoding: 'utf-8' })
    var commands
    if (commandsFilePath.endsWith('.json')){
        commands = JSON.parse(data)
    } else if (commandsFilePath.endsWith('.yml')) {
        commands = YAML.parse(data)
    }

    return commands
}

function createProgram(commandsFilePath) {
    var commands = readCommandFile(commandsFilePath)
    commands.forEach((command) => {
    if(command.subcommands){
        const newCommand = program.command(command.command)

        command.subcommands.forEach((subcommand)=>{
        const actionFile = path.join( process.cwd(), subcommand.action) + '.js'
        const action = require(actionFile)
        newCommand
            .command(subcommand.command)
            .description(subcommand.description)
            .action(action)
        })
    } else {
        const actionFile = path.join(process.cwd(), command.action) + '.js'
        const action = require(actionFile)
        program
            .command(command.command)
            .description(command.description)
            .action(action)
        }
    })
    return program
}
module.exports = createProgram
