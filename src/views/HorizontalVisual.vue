<template>
  <BaseVisualizer ref="baseVisualizer" :canvas-width="800" :canvas-height="400" />
</template>

<script>
import BaseVisualizer from "./BaseVisualizer.vue";

export default {
  name: "HorizontalVisual",
  components: {
    BaseVisualizer,
  },
  mounted() {
    this.$refs.baseVisualizer.draw = this.draw;
  },
  methods: {
    draw() {
      const baseVisualizer = this.$refs.baseVisualizer;
      if (!baseVisualizer || !baseVisualizer.isRunning) return;

      baseVisualizer.drawVisual = requestAnimationFrame(this.draw);

      const analyser = baseVisualizer.analyser;
      const dataArray = baseVisualizer.dataArray;
      const canvas = baseVisualizer.canvas;
      const canvasCtx = baseVisualizer.canvasCtx;
      const color = baseVisualizer.color;
      const backgroundColor = baseVisualizer.backgroundColor;
      const transparentBackground = baseVisualizer.transparentBackground;
      const bufferLength = baseVisualizer.bufferLength;
      const frequencyRange = baseVisualizer.frequencyRange;
      const visualizationStyle = baseVisualizer.visualizationStyle;

      analyser.getByteFrequencyData(dataArray);

      if (transparentBackground) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const [minFreq, maxFreq] = frequencyRange;
      const frequencyStep = (maxFreq - minFreq) / canvas.width;
      
      const barWidth = (canvas.width / this.bufferLength) * 2.5;
      for (let x = 0; x < canvas.width; x++) {
        const dataIndex = Math.floor(minFreq + x * frequencyStep);
        const barHeight = (dataArray[dataIndex] / 255) * canvas.height;

        canvasCtx.fillStyle = color;

        if (visualizationStyle === 'line') {
          canvasCtx.beginPath();
          canvasCtx.moveTo(x, canvas.height);
          canvasCtx.lineTo(x, canvas.height - barHeight);
          canvasCtx.strokeStyle = color;
          canvasCtx.lineWidth = 1;
          canvasCtx.stroke();
        } else if (visualizationStyle === 'dot') {
          canvasCtx.beginPath();
          canvasCtx.arc(x, canvas.height - barHeight, 1, 0, 2 * Math.PI);
          canvasCtx.fill();
        }
      }
    },
  },
};
</script>