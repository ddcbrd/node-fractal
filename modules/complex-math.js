
const eulerTriangle = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
    [1, 6, 15, 20, 15, 6, 1],
    [1, 7, 21, 35, 35, 21, 7, 1],
    [1, 8, 28, 56, 70, 56, 28, 8, 1],
    [1, 9, 36, 84, 126, 126, 84, 36, 9, 1],
    [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1]
]

module.exports = {
    divide(num, den) {
        let opDen = den.re * den.re + den.im * den.im;
        let re = (num.re * den.re + num.im * den.im) / opDen;
        let im = (num.im * den.re - num.re * den.im) / opDen;
        return { re: re, im: im }
    },
    mult(z1, z2) {
        let re = (z1.re * z2.re) - (z1.im * z2.im);
        let im = (z1.re * z2.im) + (z2.re * z1.im);
        return { re: re, im: im }
    },
    add(z1, z2) {
        let re = z1.re + z2.re;
        let im = z1.im + z2.im;
        return { re: re, im: im }
    },
    sq(z) {
        let re = z.re * z.re - z.im * z.im;
        let im = 2 * z.re * z.im;
        return { re: re, im: im }
    },
    abs(z) {
        return Math.sqrt(z.re * z.re + z.im * z.im);
    },
    pow(z, n) {
        if (n === 0) return { re: 1, im: 0 };
        if (n === 1) return z;
        let w = z;
        for (let i = 1; i < n; i++) {
            w = this.mult(z, w);
        }
        return w;
    },
    sqrt(z) {
        let r = Math.sqrt(z.re * z.re + z.im * z.im);
        let angle = Math.atan(z.im / z.re);
        if (Math.sign(z.re) === -1) angle += Math.PI;

        let re = Math.sqrt(r) * Math.cos(angle / 2)
        let im = Math.sqrt(r) * Math.sin(angle / 2);
        return { re: re, im: im }
    },
    exp(z) {
        let mult = Math.exp(z.re);
        let re = mult * Math.cos(z.im);
        let im = mult * Math.sin(z.im);
        return { re: re, im: im }
    },
    cos(z) {
        let re = Math.cos(z.re) * Math.cosh(z.im);
        let im = -Math.sin(z.re) * Math.sinh(z.im);
        return { re: re, im: im }
    },
    sin(z) {
        let re = Math.sin(z.re) * Math.cosh(z.im);
        let im = -Math.cos(z.re) * Math.sinh(z.im);
        return { re: re, im: im }
    },
    fromAngle(a) {
        let re = Math.cos(a)
        let im = Math.sin(a)
        return { re: re, im: im }
    },
    smult(z, s) {
        return { re: z.re * s, im: z.im * s }
    }
}

let euler = function (n, arr = [1, 1]) {
    if (n === 0) return [1];
    else {
        let newArr = [1];
        let elements = arr.length;
        if (elements > n) return arr;

        for (let i = 0; i < elements - 1; i++) {
            newArr.push(arr[i] + arr[i + 1]);
        }
        newArr.push(1);
        return euler(n, newArr);
    }
}