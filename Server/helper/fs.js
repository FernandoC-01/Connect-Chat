const fs = require("fs");

function save(data, path){
    fs.writeFile(path, JSON.stringify(data), err => {
            if (err) throw err
        })
    }

function read(path) {
    const file = fs.readFileSync(path)
    return !file.length ? [] : JSON.parse(file)
}

module.exports = { save, read }