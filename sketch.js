const canvas = document.getElementById('cnv');
const c = canvas.getContext('2d');

let width  = 0;
let height = 0;

let rects = [];

function subdivide(x, y, w, h) {
  if (Math.random() < 1/2 && w*h > 16) {
    for (let i = 0; i < 4; i++) {
      subdivide(i%2?x + w/2:x, i/2|0?y + h/2:y, w/2, h/2);
    }
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

function mergesort(array, fun = (a,b) => a - b) {
  if (array.length > 1) {
    let left  = array.slice(0, array.length/2|0);
    let right = array.slice(array.length/2|0, array.length);
    return merge(mergesort(left, fun), mergesort(right, fun), fun);
  } else {
    return array;
  }
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
    subdivide(0, 0, width - 1, height - 1);
  } while (rects.length <= 4);
  console.log('Created');

  rects = mergesort(rects, (a,b) => a.a - b.a);
  console.log('Sorted');

  c.translate(1,1);
  draw();
}

window.onload = start;
