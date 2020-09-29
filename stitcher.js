const { argv } = require('yargs');
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

let x = argv.sides * argv.width;
let y = argv.sides * argv.height;
let canvas = createCanvas(x, y);
let ctx = canvas.getContext('2d');

let getCoord = function (n) {
    let cx = (n % argv.sides) * argv.width;
    let cy = Math.floor(n / argv.sides) * argv.height;
    return { x: cx, y: cy }
}

let promises = [];

for (let i = 0; i < argv.sides * argv.sides; i++) {
    promises.push(loadImage(`./output/${argv.folder}/out${i}-image${argv.image}.png`));
}

Promise.all(promises)
    .then(res => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
            let coord = getCoord(i);
            ctx.drawImage(res[i], coord.x, coord.y)
        }
    }).then(() => {
        let out = fs.createWriteStream(`./output/${argv.folder}/out-stitched.png`);
        canvas.createPNGStream().pipe(out);

        console.log('Done Merging.')
    })
    .catch(console.error);