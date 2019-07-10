const express = require('express')
const uuidv4 = require('uuid/v4')
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

let students = []

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

app.put('/student/:id', (req, res) => {
    const { id } = req.params;
    const student = { ...req.body, id }
    students = [...students.filter(s => s.id !== id), student]
    return res.status(201).json(createResponse(student))
})
app.delete('/student/:id', (req, res) => {
    const { id } = req.params;
    if (students.find(s => s.id === id)) {
        students = [...students.filter(s => s.id !== id)]
        return res.status(200).json(createResponse(id))
    }
    return res.status(400).json(createResponse(id, "ID not found"))
})
app.post('/student', (req, res) => {
    const student = { ...req.body, id: uuidv4() }
    students = [...students, student]
    return res.status(200).json(createResponse(student))
})
app.get('/student', (req, res) => res.json(createResponse(students)))

app.get('/health', (req, res) => res.json({ status: students ? 'UP' : 'DOWN' }))

app.use((req, res) => res.send(404));

app.listen(port, () => console.log(`Student service listening on port ${port}!`))