<template>
  <div id="app">
    <canvas ref="canvas" width="800" height="800"></canvas>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      audioContext: null,
      analyser: null,
      dataArray: null,
      bufferLength: null,
      canvas: null,
      canvasCtx: null,
      drawVisual: null,
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    async start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        source.connect(this.analyser);
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.canvas = this.$refs.canvas;
        this.canvasCtx = this.canvas.getContext('2d');

        this.draw();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    },
    draw() {
      this.drawVisual = requestAnimationFrame(this.draw);

      this.analyser.getByteFrequencyData(this.dataArray);

      // 绘制绿幕背景
      this.canvasCtx.fillStyle = '#00FF00';  // 纯绿色
      this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const radius = 60; // 较小的圆形半径

      // 绘制青蓝色的虚线圆圈
      this.canvasCtx.beginPath();
      this.canvasCtx.setLineDash([3, 9]);
      this.canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.canvasCtx.strokeStyle = 'rgba(0, 255, 255, 1)';
      this.canvasCtx.lineWidth = 1.5;
      this.canvasCtx.stroke();
      this.canvasCtx.setLineDash([]);

      // 使用较低频率的数据来绘制整个圆
      const lowerHalfLength = Math.floor(this.bufferLength / 2);
      for (let i = 0; i < this.bufferLength; i++) {
        const angle = (i / this.bufferLength) * 2 * Math.PI;
        // 使用较低频率的数据
        const dataIndex = i % lowerHalfLength;
        const barHeight = this.dataArray[dataIndex] / 3; // 调整以适应较小的圆
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const xEnd = centerX + (radius + barHeight) * Math.cos(angle);
        const yEnd = centerY + (radius + barHeight) * Math.sin(angle);

        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x, y);
        this.canvasCtx.lineTo(xEnd, yEnd);
        this.canvasCtx.strokeStyle = 'rgba(0, 255, 255, 1)';
        this.canvasCtx.lineWidth = 1.5;
        this.canvasCtx.stroke();
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  width: 100%;
  height: 100%;
}
</style>