import { spawn } from 'child_process'

export default function tscPlugin() {
  return {
    name: 'tsc',
    buildStart() {
      return new Promise((accept, reject) => {
        spawn('tsc', ['--noEmit'], { stdio: 'inherit' }).on('exit', (code) => {
          code === 0 ? accept() : reject(new Error('Plugin failed to compile'))
        })
      })
    },
  }
}
