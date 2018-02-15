const canvas = document.getElementById('cnv');
const c = canvas.getContext('2d');

const width  = canvas.width  = innerWidth;
const height = canvas.height = innerHeight;

c.shadowColor = '#0006';
const off = Math.random()*360|0;

let rects = [];

function subdivide(x, y, w, h, v = true) {
  if (Math.random() < 0.75 && w*h > 8) {
    subdivide(x, y, Math.ceil(v ? w/2 : w), Math.ceil(v ? h : h/2), !v);
    subdivide(Math.floor(v ? x + w/2 : x), Math.floor(v ? y : y + h/2), Math.ceil(v ? w/2 : w), Math.ceil(v ? h : h/2), !v);
  } else {
    let col = `hsl(${(Math.floor(Math.random()*3) * 360/3 + off)%360|0}, 100%, 50%)`;
    rects.push({x, y, w, h, col, get a() {return this.w*this.h}});
  }
}

let id = 0;
function draw(n = 0) {
  let rect = rects[n];
  let a = rect.a;
  for (let i = 0; i < (a > 100 ? 1 : 100/a) && n < rects.length && rect.a == a; i++) {
    rect = rects[n++];
    c.shadowBlur = rect.a/width*10;
    c.fillStyle = rect.col;
    c.fillRect(rect.x, rect.y, rect.w, rect.h);
    //c.strokeRect(rect.x - 0.5, rect.y - 0.5, rect.w, rect.h);
  }
  if (n < rects.length) id = requestAnimationFrame(()=>draw(n));
}

function merge(left, right, fun = (a,b) => a - b) {
  let merged = [];

  while (left.length && right.length) {
    if (fun(left[0], right[0]) <= 0) {
      merged = merged.concat(left.splice(0, 1));
    } else {
      merged = merged.concat(right.splice(0, 1));
    }
  }

  if (left.length) {
    merged = merged.concat(left);
  } else if (right.length) {
    merged = merged.concat(right);
  }

  return merged;
}

function mergesort(array, fun = (a,b) => a - b) {
  if (array.length > 1) {
    let left  = array.slice(0, array.length/2|0);
    let right = array.slice(array.length/2|0, array.length);
    return merge(mergesort(left, fun), mergesort(right, fun), fun);
  } else {
    return array;
  }
}

function start() {
  cancelAnimationFrame(id);
  c.clearRect(0, 0, width, height);
  rects = [];
  subdivide(0, 0, width, height, true);
  rects = mergesort(rects, (a,b) => a.a - b.a);
  draw();
}

start();
