export default (req, res) => {
  let date = new Date().toISOString()
  res.statusCode = 200
  const before = res.hasHeader('Content-Type')
  res.setHeader('Content-Type', 'application/json')
  const after = res.hasHeader('Content-Type')
  res.end(JSON.stringify({ current_time: date, before, after }))
}
