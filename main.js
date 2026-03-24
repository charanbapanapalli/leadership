const URL = "https://teachablemachine.withgoogle.com/models/axjNffSNy/";

let model, webcam;

async function init() {
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");

  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();

  document.getElementById("webcam").srcObject = webcam.webcam;

  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  let highest = prediction[0];
  for (let p of prediction) {
    if (p.probability > highest.probability) {
      highest = p;
    }
  }

  document.getElementById("label").innerHTML =
    "Detected: " + highest.className;
}