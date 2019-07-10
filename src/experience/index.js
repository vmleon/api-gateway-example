const express = require('express')
const uuidv4 = require('uuid/v4')
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

let experiences = []

const createResponse = (data, message) => {
    if (message) {
        return {
            data,
            error: true,
            message
        }
    }
    return ({ data })
}

app.put('/experience/:id', (req, res) => {
    const { id } = req.params;
    const experience = { ...req.body, id }
    experiences = [...experiences.filter(s => s.id !== id), experience]
    return res.status(201).json(createResponse(experience))
})
app.delete('/experience/:id', (req, res) => {
    const { id } = req.params;
    if (experiences.find(s => s.id === id)) {
        experiences = [...experiences.filter(s => s.id !== id)]
        return res.status(200).json(createResponse(id))
    }
    return res.status(400).json(createResponse(id, "ID not found"))
})
app.post('/experience', (req, res) => {
    const experience = { ...req.body, id: uuidv4() }
    experiences = [...experiences, experience]
    return res.status(200).json(createResponse(experience))
})
app.get('/experience', (req, res) => res.json(createResponse(experiences)))

app.get('/health', (req, res) => res.json({ status: experiences ? 'UP' : 'DOWN' }))

app.use((req, res) => res.send(404));

app.listen(port, () => console.log(`Experience service listening on port ${port}!`))