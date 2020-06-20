// eslint-disable-next-line spaced-comment
//@ts-check

const { exec } = require('child_process')

module.exports = function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err)
      resolve({ stdout, stderr })
    })
  })
}
