<template>
  <div>
    <navbar 
    ></navbar>

    <router-view></router-view>

    <footer-component></footer-component>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import FooterComponent from './components/Footer.vue'

export default {
  name: "App",
  components:{
    Navbar,
    FooterComponent
  },  
};
</script>

<style>
button {
  margin: 10px;
}
body {
  margin: 0;
  padding: 0;
}
.content {
  padding-top: 90px; /* 根據 Navbar 的實際高度調整 */
  min-height: calc(100vh - 120px); /* 確保內容區域填滿剩餘空間 */
}

</style>
