const execPromise = require('./utils/exec-promise.js')
const chalk = require('chalk')
const { ClOpts } = require('cl-opts')
const { prompt } = require('inquirer')

const derivedMap = {
  feature: ['develop'],
  develop: ['release'],
  hotfix: ['master', 'develop'],
  release: ['develop', 'master']
}

async function selectBranch(message, branches, defaultBranch) {
  const { branch } = await prompt({
    message,
    type: 'list',
    name: 'branch',
    default: defaultBranch,
    choices: branches.sort()
  })

  return branch
}

async function run() {
  // get branches
  const stdBranches = await execPromise('git branch')
  const branches = stdBranches.stdout
    .trim()
    .split(/\s+/)
    .filter(branch => !/^\*$/.test(branch))

  // checkout develop branch
  const std = await execPromise('git symbolic-ref --short HEAD')
  const nowBranch = std.stdout.trim()
  const type = nowBranch.replace(/\/[\s\S]*$/, '')

  const clOpts = new ClOpts({
    name: {
      value: nowBranch,
      description: 'Branch name to merge.'
    },
    delete: {
      value: false,
      description:
        'A Boolean value that indicates whether to remove the branch after the merge.'
    },
    checkout: {
      value: nowBranch,
      description: 'Branch name after merging.'
    }
  })

  const argv = clOpts.getAll()

  if (!Object.keys(derivedMap).includes(type)) {
    const filter = branch =>
      new RegExp(`^(${Object.keys(derivedMap).join('|')})\\/`).test(branch)

    const filteredBranch = branches.filter(filter)
    const mergeBranch = await selectBranch(
      'Pick a merge branch.',
      filteredBranch,
      nowBranch
    )
    argv.name = mergeBranch
  } else {
    console.log(chalk.bold('merge branch:'), chalk.cyan(argv.name))
  }

  if (
    !('delete' in clOpts.commandOptions) &&
    !('delete' in clOpts.fileOptions)
  ) {
    const { deleteBranch } = await prompt({
      type: 'confirm',
      name: 'deleteBranch',
      message: `Would you like to delete a '${argv.name}' branch?`,
      default: argv.delete
    })
    argv.delete = deleteBranch
  }

  if (
    argv.checkout ||
    !branches.includes(argv.checkout) ||
    (argv.delete && argv.name === nowBranch)
  ) {
    const filteredBranch = argv.delete
      ? branches.filter(branch => branch !== argv.name)
      : branches
    const checkoutBranch = await selectBranch(
      'Pick a checkout branch.',
      filteredBranch,
      nowBranch
    )

    argv.checkout = checkoutBranch
  }

  const types = argv.name.replace(/\/[\s\S]*$/, '')
  const derivedBranches = derivedMap[types]
  for (const derivedBranch of derivedBranches) {
    await execPromise(`git checkout ${derivedBranch}`)
    await execPromise(`git merge ${argv.name}`)
  }
  console.log(chalk.cyan(`Merge the '${argv.name}' branch.`))

  const stdNowBranch = await execPromise('git symbolic-ref --short HEAD')
  if (stdNowBranch.stdout.trim() !== argv.checkout) {
    await execPromise(`git checkout ${argv.checkout}`)
    console.log(chalk.cyan(`Current branch changed to '${argv.checkout}'.`))
  }

  if (argv.delete) {
    await execPromise(`git branch -d ${argv.name}`)
    console.log(chalk.cyan(`Delete the '${argv.checkout}' branch.`))
  }
}

run()
