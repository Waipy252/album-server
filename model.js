require('dotenv').config();

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const registerUser = (user) => {
    console.log(user)
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO alb_user (username, password, email, created_at) VALUES ('${user.username}', '${user.password}', '${user.email}', NOW())`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getUserFromEmail = (email) => {
    console.log(email)
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM alb_user WHERE email = '${email}'`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getDownloadedAlbums = (id) => {
    console.log(id)
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM alb_download WHERE user_id = ${id}`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getAlbumFromAlbumIds = (ids) => {
    console.log(ids)
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM alb_album WHERE id IN (${ids.join(',')}) AND is_deleted = FALSE`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const addNewAlbum = (prop) => {
    console.log(prop)
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO alb_album (user_id, name) VALUES (${prop.userId}, '${prop.name}')`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const registerShareCode = (prop) => {
    console.log(prop)
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO alb_share (album_id, sharecode, expirated_at) VALUES (${prop.albumId}, '${prop.sharecode}', NOW() + INTERVAL '30 minutes')`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const registerSharedAlbum = (prop) => {
    console.log(prop)
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO alb_download (album_id, user_id) VALUES (${prop.album_id}, ${prop.userId})`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}
const deleteAlbumFromId = (id) => {
    console.log(id)
    return new Promise(function (resolve, reject) {
        pool.query(`UPDATE alb_album SET is_deleted = true WHERE id = ${id};`, (error, results) => {
            if (error) {
                reject(error)
            }
            console.log(results)
            resolve(results.rows);
        })
    })
}

const getAlbumFromUserId = (id) => {
    console.log(id)
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM alb_album WHERE user_id = '${id}' AND is_deleted = FALSE`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getAlbumImages = (id) => {
    console.log(id)
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM alb_image WHERE album_id = '${id}' AND is_deleted = FALSE`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const getAlbumIdFromSharecode = (id) => {
    console.log(id)
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT album_id FROM alb_share WHERE sharecode = '${id}' AND expirated_at > NOW()`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const addNewImage = (prop) => {
    console.log(prop)
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO alb_image (name, album_id, is_deleted, saved_at, mimetype) VALUES ('${prop.name}', ${prop.albumId}, FALSE, '${prop.savedAt}', '${prop.mimetype}')`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

module.exports = {
    registerUser,
    registerSharedAlbum,
    addNewAlbum,
    addNewImage,
    getDownloadedAlbums,
    getAlbumFromAlbumIds,
    getAlbumIdFromSharecode,
    getAlbumImages,
    deleteAlbumFromId,
    getAlbumFromUserId,
    registerShareCode,
    getUserFromEmail,
}