import capcon from 'capture-console'

export async function captureStdout<T>(
  fn: () => Promise<T>,
  quiet = true
): Promise<{ stdout: string; result: T }> {
  let output = ''
  try {
    // the first parameter here is the stream to capture, and the
    // second argument is the function receiving the output
    capcon.startCapture(process.stdout, { quiet }, function(stdout) {
      output += stdout
    })

    const result = await fn()

    // whatever is done here has stdout captured - but note
    // that `output` is updated throughout execution

    capcon.stopCapture(process.stdout)

    return { stdout: output, result }
  } catch (e) {
    capcon.stopCapture(process.stdout)
    console.log(output)
    console.log(e)
    throw e
  }
}
