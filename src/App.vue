<template>
  <div>
    <h1>Audio Visualizer</h1>
    <button @click="view = 'circle'">Circle Visual</button>
    <button @click="view = 'horizontal'">Horizontal Visual</button>
    <component :is="viewComponent"></component>
  </div>
</template>

<script>
import CircleVisual from ".src/components/CircleVisual.vue";
import HorizontalVisual from "./components/HorizontalVisual.vue";

export default {
  name: "App",
  data() {
    return {
      view: "circle",
    };
  },
  computed: {
    viewComponent() {
      return this.view === "circle" ? CircleVisual : HorizontalVisual;
    },
  },
};
</script>

<style>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";

button {
  margin: 10px;
}
</style>
