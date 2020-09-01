const PNG = require('fast-png');
const math = require('mathjs');
const Stream = require('stream').Duplex;
const fs = require('fs')
const { exec } = require('child_process')
const m = require('./modules/complex-math');

const Range = require('./modules/range');
const HSVtoRGB = require('./modules/hsvtorgb');

const width = 1920;
const height = 1080;
const maxIterations = 400;
const boundary = 16;


const aspectRatio = width / height;
const rangeVal = 1.3;
const xOff = 0;
const yOff = 0;


let now = Date.now();

const range = new Range(aspectRatio, rangeVal)

let map = function (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

let genColor = function (n) {
    let iteration = ((1 - Math.sqrt(n / (maxIterations + 1))) * 360);
    let s = 1 - (n / maxIterations);
    let color = HSVtoRGB(iteration, s, 1);
    return color;
}

range.offSet(xOff, yOff);
fs.mkdirSync(`./output/${now}`);

for (let quads = 0; quads < 4; quads++) {

    let pngArr = [];
    let xCurrentOff;
    let yCurrentOff;

    switch (quads) {
        case 0: {
            xCurrentOff = -rangeVal;
            yCurrentOff = -(rangeVal / aspectRatio);
            break;
        }

        case 1: {
            xCurrentOff = 2 * rangeVal;
            yCurrentOff = 0;
            break;
        }
        case 2: {
            xCurrentOff = 0;
            yCurrentOff = 2 * rangeVal / aspectRatio;
            break;
        }

        case 3: {
            xCurrentOff = -2 * rangeVal;
            yCurrentOff = 0;
            break;
        }
    }



    range.offSet(xCurrentOff, yCurrentOff)

    console.log(`Calculating ${maxIterations} iterations for ${width * height} pixels. ${quads + 1}/4`)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let a = map(x, 0, width, range.x.min, range.x.max);
            let b = map(y, 0, height, range.y.min, range.y.max);

            let c = { re: a, im: b };
            let z = { re: 0, im: 0 };
            let i = 0;

            for (; i < maxIterations; i++) {
                //Fractal definition
                z = m.divide(z, m.sq(c));
                z = m.add(m.sq(z), c);
                //
                if (m.abs(z) > boundary) break;
            }

            let color = genColor(i);
            pngArr.push(color.r)
            pngArr.push(color.g)
            pngArr.push(color.b)
        }
    }

    console.log('Done Generating... Creating the image');

    let pngObj = {
        width: width,
        height: height,
        data: pngArr,
        depth: 16,
        channels: 3
    }

    let encodedArr = PNG.encode(pngObj);
    fs.writeFileSync(`./output/${now}/out${quads}.png`, encodedArr);
    console.log('Image created');
}

exec(`node stitcher --folder ${now}`);



