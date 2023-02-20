const express = require('express')
const fs = require('fs')
const multer = require('multer')
require('dotenv').config()
const database = require('./database')

const upload = multer({ dest: 'images/' })

const app = express()

app.use(express.static(__dirname + '/dist'));

/* app.get('/images/:imageName', (req, res) => {
    //do a bunch of autho stuff

    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
}) */

app.use("images", express.static(__dirname + "/images"));

app.get("/api/images", async (req, res) => {

    const images = await database.getImages()
    console.log(images);
    res.send({images})
});

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

app.listen(8080, () => console.log("listening on port 8080"))