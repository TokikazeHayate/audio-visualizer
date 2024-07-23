<template>
  <div id="app" class="container mt-4">
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <canvas ref="canvas" width="800" height="600"></canvas>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Frequency Range</h5>
            <div class="form-group">
              <label for="minFrequency"
                >Min Frequency: {{ frequencyRange[0] }}</label
              >
              <input
                type="range"
                class="form-control-range"
                id="minFrequency"
                v-model.number="frequencyRange[0]"
                :min="0"
                :max="bufferLength - 1"
                @input="updateFrequencyRange"
              />
            </div>
            <div class="form-group">
              <label for="maxFrequency"
                >Max Frequency: {{ frequencyRange[1] }}</label
              >
              <input
                type="range"
                class="form-control-range"
                id="maxFrequency"
                v-model.number="frequencyRange[1]"
                :min="0"
                :max="bufferLength - 1"
                @input="updateFrequencyRange"
              />
            </div>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Pattern</h5>
            <select v-model="pattern" class="form-control mb-2">
              <option value="0">Pattern 0</option>
              <option value="1">Pattern 1</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Controls</h5>
            <button @click="toggleVisualizer" class="btn btn-primary mb-2">
              {{ isRunning ? "Stop Visualizer" : "Start Visualizer" }}
            </button>
            <button @click="openInNewWindow" class="btn btn-secondary mb-2">
              Open in New Window
            </button>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Visualization Color</h5>
            <input
              type="color"
              v-model="color"
              @change="updateColor"
              class="form-control mb-2"
            />
            <input
              type="text"
              v-model="colorCode"
              @input="updateColorFromCode"
              placeholder="Enter color code"
              class="form-control"
            />
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Background Settings</h5>
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="transparentBackground"
                id="transparentBackground"
              />
              <label class="form-check-label" for="transparentBackground">
                Transparent Background
              </label>
            </div>
            <input
              type="color"
              v-model="backgroundColor"
              @change="updateBackgroundColor"
              class="form-control mb-2"
              :disabled="transparentBackground"
            />
            <input
              type="text"
              v-model="backgroundColorCode"
              @input="updateBackgroundColorFromCode"
              placeholder="Enter background color code"
              class="form-control"
              :disabled="transparentBackground"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HorizontalVisual",
  data() {
    return {
      audioContext: null,
      analyser: null,
      dataArray: null,
      bufferLength: 256,
      canvas: null,
      canvasCtx: null,
      drawVisual: null,
      color: "#00FFFF",
      colorCode: "#00FFFF",
      backgroundColor: "#00FF00",
      backgroundColorCode: "#00FF00",
      transparentBackground: true,
      newWindow: null,
      isRunning: false,
      frequencyRange: [0, 255],
      pattern: 0,
    };
  },
  methods: {
    async setupAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        source.connect(this.analyser);
        this.analyser.fftSize = this.bufferLength * 2;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.canvas = this.$refs.canvas;
        this.canvasCtx = this.canvas.getContext("2d");
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    },
    toggleVisualizer() {
      if (this.isRunning) {
        this.stopVisualizer();
      } else {
        this.startVisualizer();
      }
    },
    async startVisualizer() {
      if (!this.audioContext) {
        await this.setupAudio();
      }
      this.isRunning = true;
      this.draw();
    },
    stopVisualizer() {
      this.isRunning = false;
      cancelAnimationFrame(this.drawVisual);
    },
    draw() {
      if (!this.isRunning) return;

      this.drawVisual = requestAnimationFrame(this.draw);

      this.analyser.getByteFrequencyData(this.dataArray);

      const canvas = this.newWindow
        ? this.newWindow.document.querySelector("canvas")
        : this.canvas;
      const canvasCtx = canvas.getContext("2d");

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      if (this.transparentBackground) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        canvasCtx.fillStyle = this.backgroundColor;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const barWidth = (canvas.width / this.bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < this.bufferLength; i++) {
        barHeight = this.dataArray[i] / 2;

        canvasCtx.fillStyle = this.color;
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight / 2,
          barWidth,
          barHeight
        );

        x += barWidth + 1;
      }
    },
    updateColor(event) {
      this.color = event.target.value;
      this.colorCode = this.color;
    },
    updateColorFromCode() {
      if (/^#[0-9A-F]{6}$/i.test(this.colorCode)) {
        this.color = this.colorCode;
      }
    },
    updateBackgroundColor(event) {
      this.backgroundColor = event.target.value;
      this.backgroundColorCode = this.backgroundColor;
    },
    updateBackgroundColorFromCode() {
      if (/^#[0-9A-F]{6}$/i.test(this.backgroundColorCode)) {
        this.backgroundColor = this.backgroundColorCode;
      }
    },
    openInNewWindow() {
      this.newWindow = window.open("", "Visualizer", "width=800,height=600");
      this.newWindow.document.body.innerHTML =
        '<canvas width="800" height="600"></canvas>';
      this.newWindow.document.body.style.margin = "0";
      this.newWindow.document.body.style.padding = "0";
    },
  },
};
</script>

<style>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";

canvas {
  width: 100%;
  height: auto;
}
</style>
