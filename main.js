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
        if (command.options){
          for (let i = 0; i < command.options.length; i++){
            const option = command.options[i]
            const option_arr = []
            option_arr.push(option.name)
            if (option.description) {
              option_arr.push(option.description)
            }
            if (option.default) {
              option_arr.push(option.default)
            }
              console.log(option_arr)
            program.option(...option_arr)

          }
        }
    })
    return program
}
module.exports = createProgram
