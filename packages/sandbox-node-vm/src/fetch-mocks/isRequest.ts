export function isRequest(fetch_res: Request | Response): fetch_res is Request {
  return (
    fetch_res instanceof NodeFetchRequest || fetch_res.constructor?.name === 'Request'
  )
}
