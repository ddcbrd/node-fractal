// const math = require('./modules/complex-math');

// let iterations = 1920 * 1080 * 600;

// let z = {
//     re: 4,
//     im: 10
// }

// let start = Date.now();

// // let arr = []

// for (let i = 0; i < iterations; i++) {
//     math.pow(z, 3);
// }
// // console.log(math.pow(z, 3));


// let finish = Date.now();

// let delta = finish - start;
// let perOp = delta / iterations;

// console.log(`Finished in ${delta}ms. (${perOp}ms / operation)`);
// // console.log(arr)

const fs = require('fs')

fs.readdir('./output/1601322449154', (err, files) => {
    for (let i = 0; i < files.length; i++) {
        let newfn = `${i.toString().padStart(3, 0)}.png`
        fs.renameSync('./output/1601322449154/' + files[i], './output/1601322449154/' + newfn)
    }
})