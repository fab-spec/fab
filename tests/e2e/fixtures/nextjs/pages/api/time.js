export default (req, res) => {
    let date = new Date().toISOString()
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ name: 'John Doe', date }))
}
