const canvas = document.getElementById("terrain");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.55;
}
resize();
window.addEventListener("resize", resize);

let time = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0a0a0a";

  const size = 60;
  for (let y = 0; y < canvas.height + size; y += size) {
    for (let x = 0; x < canvas.width + size; x += size) {
      const offset = Math.sin((x + y) * 0.01 + time) * 10;
      ctx.beginPath();
      ctx.moveTo(x, y + offset);
      ctx.lineTo(x + size, y + offset);
      ctx.lineTo(x + size, y + size + offset);
      ctx.lineTo(x, y + size + offset);
      ctx.closePath();
      ctx.fill();
    }
  }

  time += 0.01;
  requestAnimationFrame(draw);
}

draw();
