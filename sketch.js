const canvas = document.getElementById('cnv');
const c = canvas.getContext('2d');

let width  = 0;
let height = 0;

let rects = [];

function subdivide(x, y, w, h, v = true) {
  if (Math.random() < 3/4 && w*h > 16) {
    subdivide(x, y, (v ? w/2 : w), (v ? h : h/2), !v);
    subdivide((v ? x + w/2 : x), (v ? y : y + h/2), (v ? w/2 : w), (v ? h : h/2), !v);
  } else {
    let col = palette[Math.random()*3|0];
    rects.push({x, y, w, h, col, get a() {return this.w*this.h}});
  }
}

let id = 0;
let palette = ['#f8fcff', '#fff', '#fff8f8'];
function draw(n = 0) {
  let rect = rects[n];
  let a = rect.a;
  for (let i = 0; i < (a > 30 ? 1 : 30/a) && n < rects.length && rect.a == a; i++) {
    rect = rects[n++];
    c.shadowBlur = rect.a/width*10;
    c.fillStyle = rect.col;
    c.fillRect(rect.x, rect.y, rect.w, rect.h);
    c.shadowBlur = 0;
    c.strokeRect(rect.x - 0.5, rect.y - 0.5, rect.w, rect.h);
  }
  if (n < rects.length) id = requestAnimationFrame(()=>draw(n));
}

function merge(left, right, fun = (a,b) => a - b) {
  let merged = [];

  let l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (fun(left[l], right[r]) <= 0) {
      merged.push(left[l++]);
    } else {
      merged.push(right[r++]);
    }
  }

  while (l < left.length) merged.push(left[l++]);
  while (r < right.length) merged.push(right[r++]);

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

  let size = 1;
  while (size * 2 < innerWidth && size * 2 < innerHeight) {
    size *= 2;
  }
  width = canvas.width = height = canvas.height = size + 1;

  c.shadowColor = '#0006';

  c.clearRect(0, 0, width, height);
  do {
    rects = [];
    subdivide(0, 0, width - 1, height - 1, false);
  } while (rects.length <= 2);
  console.log('Created');

  rects = mergesort(rects, (a,b) => a.a - b.a);
  console.log('Sorted');

  c.translate(1,1);
  draw();
}

window.onload = start;
