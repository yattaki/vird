const execPromise = require('./utils/exec-promise.js')
const { prompt } = require('inquirer')
const chalk = require('chalk')

const types = ['fix', 'add', 'remove', 'update', 'move']
const tags = ['doc', 'file', 'test', 'typo', 'code', 'comment', 'config']

async function commitMessage() {
  const { comment } = await prompt({
    type: 'input',
    name: 'comment',
    message: 'Commit message : '
  })

  if (!/^[A-Z][a-zA-Z ]+[a-z]$/.test(comment)) {
    const message = `The comment '${comment}' cannot be used.`
    console.log(chalk.red(message))
    return commitMessage()
  }

  return comment
}

execPromise('git diff --name-only').then(async std => {
  const files = std.stdout.split(/\s+/).filter(Boolean)
  const { addFiles, type, tag } = await prompt([
    {
      type: 'checkbox',
      name: 'addFiles',
      message: 'Select files to add.',
      choices: files
    },
    {
      type: 'list',
      name: 'type',
      message: 'Select commit type.',
      choices: types
    },
    {
      type: 'list',
      name: 'tag',
      message: 'Select commit tag.',
      choices: tags
    }
  ])

  const comment = await commitMessage()

  if (addFiles.length > 0) {
    await execPromise(`git add ${addFiles.join(' ')}`)
  }

  await execPromise(`git commit -m "${type} ${tag}: ${comment}"`)
  console.log(chalk.cyan('Successful commit.'))

  const { isMerge } = await prompt({
    type: 'confirm',
    name: 'isMerge',
    message: 'Would you like to merge this brand?',
    default: false
  })

  if (isMerge) {
    require('./merge.js')
  }
})
