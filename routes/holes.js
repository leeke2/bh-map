var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.get('/', (req,res)=> {
    //res.sendFile(__dirname +"/views/test.html",);
    const getHoles = (data) => {
        var startExtract = false;
        var lines = [];

        for (const line of data.split('\n')) {
            const trimmedLine = line.trim();

            if (trimmedLine === "\"**HOLE\"") {
                startExtract = true;
                continue;
            }

            if (startExtract === true) {
                if (trimmedLine !== "") {
                    lines.push(trimmedLine);
                } else {
                    break;
                }
            }
        }

        const keys = lines.shift().concat(lines.shift()).split(',').map(field => field.replaceAll("\"", ""));
        return lines.splice(1, lines.length - 1).map((line, il) => {
            const values = line.split(",").map(value => value.replaceAll("\"", ""));
            return Object.fromEntries(keys.map((k, i) => [k, values[i]]).filter((item) => item[1] !== ""))
        });
    };

    const dirPath = path.join(__dirname, '..', 'public', 'assets');
    var holes = [];
    const files = fs
        .readdirSync(dirPath)
        .filter(file => path.extname(file).toLowerCase() == '.ags');

    files.map(file => {
        const pathToFile = path.join(__dirname, '..', 'public', 'assets', file)  
        const data = fs.readFileSync(pathToFile, 'utf8');
        const d = getHoles(data);
        
        holes.push({ name: file, data: getHoles(data) });
    });

    res.json(holes);
});

module.exports = router;