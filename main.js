#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')
const XML = require('fast-xml-parser')

const program = new commander.Command()

function readCommandFile( commandsFilePath ){
    const data = fs.readFileSync(commandsFilePath,{ encoding: 'utf-8' })
    var commands
    if (commandsFilePath.endsWith('.json')){
        commands = JSON.parse(data)
    } else if (commandsFilePath.endsWith('.yml')) {
        commands = YAML.parse(data)
    } else if (commandsFilePath.endsWith('.xml')) {
        let tObj = parser.getTraversalObj(data,{})
        commands = parser.convertToJson(tObj,{})
    }
    return commands
}

function addCommands(program, commands){
  commands.forEach( command => {
    const action = require(path.join(process.cwd(), command.action) + '.js')
    var newCommand = createCommand(command)
    program.addCommand(newCommand)
    if ( command.subcommands ){
//            console.log(`subcommand is ${JSON.stringify(subcommand)}`)
//            const newCommand = createCommand(command.action)
        addCommands(program, command.subcommands)
    }
  })
}

function createCommand(command_data){

    const newCommand = new commander.Command(command_data.command)

    console.log(command_data)

    newCommand
      .command(command_data.command)
      .description(command_data.description)
      .action(command_data.action)

    return newCommand

}

function createProgram(commandsFilePath){

    var commands = readCommandFile(commandsFilePath)
    addCommands(program,commands)
    program.parse(process.argv);

    return program
}

module.exports = createProgram
