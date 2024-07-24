<template>
  <BaseVisualizer ref="baseVisualizer" :canvas-width="600" :canvas-height="400" />
</template>

<script>
import BaseVisualizer from "./BaseVisualizer.vue";

export default {
  name: "CircleVisual",
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

      this.$refs.baseVisualizer.drawVisual = requestAnimationFrame(this.draw);

      const analyser = this.$refs.baseVisualizer.analyser;
      const dataArray = this.$refs.baseVisualizer.dataArray;
      const canvas = this.$refs.baseVisualizer.canvas;
      const canvasCtx = this.$refs.baseVisualizer.canvasCtx;
      const color = this.$refs.baseVisualizer.color;
      const backgroundColor = this.$refs.baseVisualizer.backgroundColor;
      const transparentBackground = this.$refs.baseVisualizer.transparentBackground;
      const bufferLength = this.$refs.baseVisualizer.bufferLength;
      const frequencyRange = this.$refs.baseVisualizer.frequencyRange;
      const visualizationStyle = this.$refs.baseVisualizer.visualizationStyle;
      const pattern = this.$refs.baseVisualizer.pattern;

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      if (transparentBackground) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 60;

      canvasCtx.beginPath();
      canvasCtx.setLineDash([3, 9]);
      canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      canvasCtx.strokeStyle = color;
      canvasCtx.lineWidth = 1.5;
      canvasCtx.stroke();
      canvasCtx.setLineDash([]);

      const [startFreq, endFreq] = frequencyRange;
      const frequencyStep = (endFreq - startFreq) / bufferLength;

      for (let i = 0; i < bufferLength; i++) {
        let dataIndex = 0;
        if (pattern === "0") {
          dataIndex = Math.floor(startFreq + i * frequencyStep);
        } else {
          const lowerHalfLength = Math.floor(bufferLength / 2);
          dataIndex = i % lowerHalfLength;
        }

        const angle = (i / bufferLength) * 2 * Math.PI;
        const barHeight = dataArray[dataIndex] / 3;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const xEnd = centerX + (radius + barHeight) * Math.cos(angle);
        const yEnd = centerY + (radius + barHeight) * Math.sin(angle);

        canvasCtx.beginPath();

        if (visualizationStyle === 'line') {
          canvasCtx.moveTo(x, y);
          canvasCtx.lineTo(xEnd, yEnd);
          canvasCtx.strokeStyle = color;
          canvasCtx.lineWidth = 1.5;
          canvasCtx.stroke();
        } else if (visualizationStyle === 'dot') {
          canvasCtx.arc(xEnd, yEnd, 2, 0, 2 * Math.PI, false);
          canvasCtx.fillStyle = color;
          canvasCtx.fill();
        }
      }
    },
  },
};
</script>
