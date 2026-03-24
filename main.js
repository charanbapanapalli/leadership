const MODEL_URL = "https://teachablemachine.withgoogle.com/models/axjNffSNy/";

    let model;
    let webcam;
    let isRunning = false;

    const webcamEl = document.getElementById("webcam");
    const labelEl = document.getElementById("label");
    const statusEl = document.getElementById("status");
    const startBtn = document.getElementById("startBtn");

    startBtn.addEventListener("click", init);

    async function init() {
      if (isRunning) return;
      startBtn.disabled = true;
      statusEl.textContent = "Loading model and requesting camera permission...";

      try {
        model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");

        webcam = new tmImage.Webcam(300, 300, true);
        await webcam.setup(); // prompts for webcam permission
        await webcam.play();

        // Teachable Machine webcam has an underlying HTMLVideoElement.
        // Put that directly into our <video> tag.
        webcamEl.srcObject = webcam.webcam.srcObject;

        isRunning = true;
        statusEl.textContent = "Camera started. Detecting...";
        window.requestAnimationFrame(loop);
      } catch (error) {
        console.error(error);
        labelEl.textContent = "Could not start camera";
        statusEl.textContent =
          "Check browser camera permission, use HTTPS or localhost, and ensure no other app is using the camera.";
        startBtn.disabled = false;
      }
    }

    async function loop() {
      if (!isRunning) return;

      webcam.update();
      await predict();
      window.requestAnimationFrame(loop);
    }

    async function predict() {
      const prediction = await model.predict(webcam.canvas);

      let highest = prediction[0];
      for (const p of prediction) {
        if (p.probability > highest.probability) {
          highest = p;
        }
      }

      labelEl.textContent = `Detected: ${highest.className}`;
    }