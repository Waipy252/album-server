require('dotenv').config();
const express = require('express')
const app = express()
const model = require('./model')
const multer = require('multer');
const path = require('path');
const port = process.env.ALBUM_SERVER_PORT

app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALBUM_CLIENT_ADDRESS);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, process.env.IMAGE_PATH);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

app.post('/album/image/upload', upload.array('images'), (req, res) => {
    const files = req.files;
    console.log("POST /album/image/upload", req.body)
    console.log(files);
    res.json({ files });
});

app.post('/album', (req, res) => {
    console.log("POST /album", req.body)
    model.addNewAlbum(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/album', (req, res) => {
    console.log("GET /album", req.query)
    model.getAlbumFromUserId(req.query.userId)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/album/download', (req, res) => {
    console.log("GET /album/download", req.query)
    model.getDownloadedAlbums(req.query.userId)
        .then(response => {
            if (response.length > 0) {
                const albumIds = response.map(item => item.album_id)
                model.getAlbumFromAlbumIds(albumIds)
                    .then(response2 => {
                        res.status(200).send(response2);
                    })
                    .catch(error => {
                        res.status(500).send(error);
                    })
            } else {
                res.status(200).send(["ダウンロードしたアルバムが存在しません"]);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.put('/album', (req, res) => {
    console.log("PUT /album", req.query)
    model.deleteAlbumFromId(req.query.albumId)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/album/share', (req, res) => {
    console.log("POST /album/share", req.body)
    model.registerShareCode(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/album/share/download', (req, res) => {
    // sharecodeからalbumIdを取得する
    console.log("POST /album/share/download", req.body)
    model.getAlbumIdFromSharecode(req.body.sharecode)
        .then(response => {
            if (response.length > 0) {
                // albumIdとuserIdを登録する
                model.registerSharedAlbum({ ...req.body, ...response[0] })
                    .then(response => {
                        res.status(200).send(response);
                    })
                    .catch(error => {
                        res.status(500).send(error);
                    })
            } else {
                res.status(200).send(["共有コードと対応するアルバムが存在しません"]);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        })

})

app.post('/album/image', (req, res) => {
    console.log("POST /album/image", req.body)
    model.addNewImage(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/album/image', (req, res) => {
    console.log("GET /album/image", req.query)
    model.getAlbumImages(req.query.albumId)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/api/users', (req, res) => {
    console.log("POST /api/users", req.body)
    model.registerUser(req.body)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/api/users', (req, res) => {
    console.log("GET /api/users", req.query)
    model.getUserFromEmail(req.query.email)
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})