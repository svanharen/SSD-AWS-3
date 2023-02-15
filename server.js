const express = require('express')
const fs = require('fs')
const multer = require('multer')
require('dotenv').config()
const database = require('./database')

const upload = multer({ dest: 'images/' })

const app = express()

app.use(express.static("dist"))

app.get('/images/:imageName', (req, res) => {

    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
})


app.post('/api/images', upload.single('image'), (req, res) => {
    const imageName = req.file.filename
    const description = req.body.description

    //Database action
    try{
        database.addImage(imageName, description)
        console.log(description, imageName)
        
    }catch(err){
        console.log(err)
    }
    res.send({description, imageName})
})

app.get('*', (req, res) => {
    res.sendFile('dist/index.html', { root: __dirname })
});

app.listen(8080, () => console.log("listening on port 8080"))