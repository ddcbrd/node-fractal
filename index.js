const PNG = require('fast-png');
const fs = require('fs')
const { exec } = require('child_process')
const m = require('./modules/complex-math');
const Range = require('./modules/range');
const HSVtoRGB = require('./modules/hsvtorgb');
const { makeNoise2D } = require('open-simplex-noise')
const noise2D = makeNoise2D(Date.now())

const width = 1920;
const height = 1080;
const maxIterations = 600;
const nImages = 30 * 20;
const boundary = 32;

const aspectRatio = width / height;

const rangeVal = 2;
const xOff = 0;
const yOff = 0;
const sides = 1;


let now = Date.now();

const range = new Range(aspectRatio, rangeVal, sides, xOff, yOff);

let map = function (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

let genColor = function (n) {
    // let gs = Math.sqrt(n / maxIterations) * 65535;
    let h = ((1 - Math.sqrt(n / (maxIterations + 1))) * 360);
    let b = (n / maxIterations);
    let s = 1 - b;
    let color = HSVtoRGB(h, h, 1 - h);
    return color;
}

fs.mkdirSync(`./output/${now}`);
for (let images = 0; images < nImages; images++) {
    let angle = Math.PI * 2 * images / nImages
    // let xOff = Math.cos(angle)
    // let yOff = Math.sin(angle)
    // let kindAngle = Math.PI * 2 * (noise2D(xOff, yOff) + 1) / 2
    let c = m.fromAngle(angle);
    c = m.smult(c, 1 / 4)
    // m.smult(c, )

    for (let quads = 0; quads < sides * sides; quads++) {

        let pngArr = [];
        range.calcOffset(quads);

        console.log(`Calculating ${maxIterations} iterations for ${width * height} pixels. Quadrant ${quads + 1}/${sides * sides}, Image ${images + 1}/${nImages}`)

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {

                let a = map(x, 0, width, range.x.min, range.x.max);
                let b = map(y, 0, height, range.y.min, range.y.max);

                let z = { re: a, im: b };
                let i = 0;

                for (; i < maxIterations; i++) {
                    //Fractal definition

                    z = m.add(m.sq(z), c)
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
        let imgStr = images.toString()
        imgStr = imgStr.padStart(nImages.toString().length, '0')
        fs.writeFileSync(`./output/${now}/out${quads}-image${imgStr}.png`, encodedArr);
        console.log('Image created');
    }

    if (sides > 1) exec(`node stitcher --folder ${now} --image ${images} --width ${width} --height ${height} --sides ${sides}`);
}

if (nImages > 1 && sides === 1) exec(`ffmpeg -i ./output/${now}/out0-image%03d.png -c:v libx264 -vf "fps=30,format=yuv420p" ./output/${now}/out.mp4`)
