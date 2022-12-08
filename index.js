let width, height, radius, centerX, centerY;
let translateX;
let translateY;
let theta = 20;
let time = performance.now() / 1000;
let direction = 0;
let driftY = 0;
let driftX = 0;
let scaleY = 1;
let scaleX = 1;
let imgUrl = 'bird.png'
const canvas = document.querySelector("canvas");
let cachedTexture = canvas;
const context = canvas.getContext("2d");
const animating = true;
const raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;
const translate0 = -.5;
const translate1 = 1;
const rotate0 = .10;
const rotate1 = 0;
const scale0 = 1;
const scale1 = .01;
const sizeX = 100;
const sizeY = 100;
const now = new Date();
const sec = now.getSeconds();
const compositeList = [
    'source-over',
    'source-atop',
    'source-in',
    'source-out',
    'destination-over',
    'destination-atop',
    'destination-in',
    'destination-out',
    'lighter',
    'copy',
    'xor'
]
// let compositeCollection = ['source-over', 'source-atop', 'destination-atop'];
let compositeCollection = [
    "source-over",
    "source-out",
    "source-over"
];

const copyContent = async () => {
    try {
        await navigator.clipboard.write(cachedTexture);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

resize();
tick();
window.addEventListener("resize", resize, false);
document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("keydown", keyDown, false);



function renderToCache(renderFunction) {
    var buffer = document.createElement('canvas');
    buffer.width = width;+1
    buffer.height = height+1;
    renderFunction(buffer.getContext('2d'));
    return buffer;
};

document.addEventListener('touchmove', e => {
    translateY = e.changedTouches[0].clientY;
    translateX = e.changedTouches[0].clientX;
});

document.addEventListener('touchstart', e => {
    translateY = e.changedTouches[0].clientY;
    translateX = e.changedTouches[0].clientX;
});

document.addEventListener('mousemove', e => {
    translateX = e.clientX;
    translateY = e.clientY;
});

function randomComposite() {
    randomComposite = compositeList[Math.floor(Math.random() * compositeList.length)];
    payload = [randomComposite, randomComposite, randomComposite];
    return payload;
}

function drawScene() {

    cachedTexture = renderToCache(function (ctx) {
        var img = new Image();
        ctx.translate(centerX - width / 2, centerY - height / 2);
        // ctx.scale(.9, .9);
        ctx.setTransform(scaleX, 0.000, 0.000, scaleY, driftX, driftY);
        ctx.globalCompositeOperation = compositeCollection[1]
        ctx.drawImage(cachedTexture, 0, 0, width, height);

        img.src = imgUrl;
        var imgWidth = parseInt(img.naturalWidth);
        var imgHeight = parseInt(img.naturalHeight);
        ctx.globalCompositeOperation = compositeCollection[0];
        ctx.globalCompositeOperation = "xor";
        ctx.drawImage(img, translateX - imgWidth / 2, translateY - imgHeight / 2, imgWidth,
            imgHeight);
        // ctx.drawImage(img, numX ^ imgHeight / 2, numY ^ height / 2);

    });
    // context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = compositeCollection[2];
    context.drawImage(cachedTexture, 0, 0);
}




function tick() {

    var now = performance.now() / 100;
    if (animating) {
        setTimeout(() => raf(tick), 60);
        theta = (now / time) / direction;
        time = now;
        drawScene();
    } else raf(tick);
}

function resize(e) {

    width = window.innerWidth;
    height = window.innerHeight;
    centerX = (width / 2);
    centerY = height / 2;

    canvas.width = width;
    canvas.height = height;

    if (!animating) drawScene();
}

function keyDown(e) {
    console.log(e.key, 'kjdfd');
    switch (e.key) {
        case 'w':
            driftY = driftY - 0.01;
            break;
        case 's':
            driftY = driftY + 0.01;
            break;
        case 'a':
            driftX = driftX - 0.01;
            break;
        case 'd':
            driftX = driftX + 0.01;
            break;
        case 'o':
            scaleY = scaleY - 0.0001;
            break;
        case 'l':
            scaleY = scaleY + 0.0001;
            break;
        case ';':
            scaleX = scaleX - 0.0001;
            break;
        case 'k':
            scaleX = scaleX + 0.0001;
            break;
        case 'x':
            imgUrl = imgUrl && '' ;
            break;
        case 'Command', 'v':
            if (navigator.clipboard) {
                // retrieve clipboard data as a string
                navigator.clipboard.readText().then(function (data) {
                    console.log(data);
                    // display clipboard data in a text field
                    imgUrl = data;
                });
            } else {
                // clipboard API is not supported
                console.log('Clipboard API is not supported by this browser.');
            }
            break;
        default:
            break;
    }
    // else if (e.key == 'd') {
    //     compositeCollection = ['source-atop', 'destination-atop', compositeList[Math.floor(Math.random() *
    //         compositeList.length)]];
    // } else if (e.key == 'f') {
    //     compositeCollection = ['source-over', 'source-atop', 'destination-atop'];
    // } else if (e.key == 'z') {
    //     compositeCollection = ['source-over', 'source-atop', 'destination-atop'];
    // } else {
    //     for (let i = 0; i < 3; i++) {
    //         compositeCollection.pop();
    //         // compositeCollection.push(compositeList[Math.floor(Math.random() * compositeList.length)]);
    //     }
    //     for (let i = 0; i < 3; i++) {
    //         // compositeCollection.pop();
    //         compositeCollection.push(compositeList[Math.floor(Math.random() * compositeList.length)]);
    //     }
    // }
    // copyContent();
    // console.log(compositeCollection);


}


function mouseDown(e) {
    // randomComposite();
    // click to pasue
    // copyContent();
    e.stopPropagation();
    e.preventDefault();
    // animating = !animating;
    if (animating) {
        direction *= -2;
        time = performance.now() / 1;
        tick();
    }
}