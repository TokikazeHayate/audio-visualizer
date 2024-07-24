<template>
  <div>
    <navbar 
    ></navbar>

    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import CircleVisual from "./views/CircleVisual.vue";
import HorizontalVisual from "./views/HorizontalVisual.vue";

export default {
  name: "App",
  data() {
    return {
      view: "circle",
    };
  },
  components:{
        Navbar,
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
