const express = require('express')
const app = express()
const port = 8888
const convert = require('fbx2gltf');
const fs = require('fs')
const p = require('path')

app.get('*', async (req, res) => {
    if( req.path === '/' || req.path === "/index.html") return res.sendFile(p.join(__dirname, "public/index.html"))
    const path =  await getGLB(req.path)
    console.log(req.path, path)
    path ? res.download(p.join(__dirname, path), path.split('/').pop() ): res.send('File Not found')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


const root = 'public'
const getGLB = async (path) => {
    if(path === "/") return undefined
    const fullPath = root + path
    if (fs.existsSync(fullPath)) {
        //file exists
        const tmp = fullPath.split('.');
        const ext = tmp.pop()
        console.log (ext)
        if( ext === 'fbx' ){
            const glbPath = tmp.join('.') + '.glb'
            if( !fs.existsSync(glbPath) ){
                await convert(fullPath, glbPath)
            }
            return glbPath
        }
        else{
            return fullPath
        }
    }else{
        return undefined
    }
}




/*
var express = require('express');    //Express Web Server
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================================
// Create a Route (/upload) to handle the Form submission
// (handle POST requests to /upload)
// Express v4  Route definition
// ============================================================
app.route('/upload')
    .post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('back');           //where to go next
            });
        });
    });

var server = app.listen(3030, function() {
    console.log('Listening on port %d', server.address().port);
});
*/

