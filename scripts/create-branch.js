const execPromise = require('./utils/exec-promise.js')
const chalk = require('chalk')
const { ClOpts } = require('cl-opts')
const { prompt } = require('inquirer')

const derivedMap = {
  feature: 'develop',
  hotfix: 'master'
}

const checkNameRegExp = /^(#\d+)?[a-z][.a-z\d-]+[a-z\d]$/

const argv = new ClOpts({
  name: {
    value: '',
    description:
      'A string that represents the name of the feature branch to create.'
  },
  type: {
    value: '',
    description:
      'A string that represents the type of the feature branch to create.'
  },
  createDerivedBranch: {
    value: true,
    description:
      'A boolean value to create if the derived branch does not exist.'
  }
}).getAll()

async function updateCreateDevelopBranch() {
  const { createDerivedBranch } = await prompt({
    type: 'confirm',
    name: 'createDerivedBranch',
    message: `Would you like to create a ${derivedMap[argv.type]} branch?`,
    default: true
  })

  argv.createDerivedBranch = createDerivedBranch
}

async function updateType() {
  const { type } = await prompt({
    type: 'list',
    name: 'type',
    message: 'Pick a branch type.',
    default: 'develop',
    choices: Object.keys(derivedMap).sort()
  })

  argv.type = type
}

async function updateName(branches) {
  const { name } = await prompt({
    type: 'input',
    name: 'name',
    message: 'What is the name of the feature branch you are creating?'
  })

  argv.name = name

  if (
    !checkNameRegExp.test(argv.name) ||
    branches.includes(`feature/${argv.name}`)
  ) {
    const message = `The name '${argv.name}' cannot be used as a branch name.`
    console.log(chalk.red(message))
    await updateName(branches)
  }
}

async function run() {
  // get branches
  const stdBranches = await execPromise('git branch')
  const branches = stdBranches.stdout
    .trim()
    .split(/\s+/)
    .filter(branch => !/^\*$/.test(branch))

  // update type
  if (argv.type === '') await updateType()
  if (!Object.keys(derivedMap).includes(argv.type)) {
    const types = Object.keys(derivedMap)
      .sort()
      .map(type => `'${type}'`)
    const lastType = types.pop()

    const typesMessage = `${types.join(', ')} or ${lastType}`
    const message = `Can only specify ${typesMessage} for the branch type.`
    console.log(chalk.red(message))

    await updateType()
  }

  // create develop branch
  const createBranchName = derivedMap[argv.type]
  if (!branches.includes(createBranchName)) {
    await updateCreateDevelopBranch()

    if (argv.createDerivedBranch) {
      await execPromise(`git checkout -b ${createBranchName}`)

      const message = `Created the '${createBranchName}' branch.`
      console.log(chalk.cyan(message))
    } else {
      const message = `The process was interrupted because there is no ${createBranchName} branch.`
      console.log(chalk.cyan(message))
      process.exit(1)
    }
  }

  const derivedBranchName = derivedMap[argv.type]

  // checkout develop branch
  const std = await execPromise('git symbolic-ref --short HEAD')
  if (std.stdout.trim() !== derivedBranchName) {
    await execPromise(`git checkout ${derivedBranchName}`)
  }

  if (argv.name === '') {
    await updateName(branches)
  } else if (
    !checkNameRegExp.test(argv.name) ||
    branches.includes(`feature/${argv.name}`)
  ) {
    const message = `The name '${argv.name}' cannot be used as a branch name.`
    console.log(chalk.red(message))
    await updateName(branches)
  }

  const name = `feature/${argv.name}`
  await execPromise(`git checkout -b ${name}`)
  console.log(chalk.cyan(`Created the '${name}' branch.`))
  console.log(chalk.cyan(`Current branch changed to '${name}'.`))
}

run()
