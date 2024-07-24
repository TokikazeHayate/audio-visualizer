<template>
    <nav 
        :class="[`navbar-${theme}`, `bg-${theme}`, `navbar`, `navbar-expand-lg`]"
    >
        <div class="container-fluid d-flex flex-lg-row align-items-center">
            <a class="navbar-brand" href="#">Audio Visualizer</a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-column flex-lg-row">
                <li class="nav-item">
                    <router-link
                    to="/circle"
                    class="nav-link" 
                    active-class="active"
                    aria-current="page" 
                    :title="`This link goes to the circle page`"
                    >Circule</router-link>  
                </li>
                <li class="nav-item">
                    <router-link
                    to="/horizon"
                    class="nav-link" 
                    active-class="active"
                    aria-current="page" 
                    :title="`This link goes to the horizon page`"
                    >Horizon</router-link>  
                </li>

            </ul>
            <form class="d-flex mt-2 mt-lg-0">
                <button 
                    class="btn btn-primary" 
                    @click.prevent="changeTheme()"
                >Toggle Theme
                </button>
            </form>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            theme: 'light',
        }
    },
    created(){
        this.getThemeSetting();
    },
    computed:{
        publishedPages() {
            if (!Array.isArray(this.pages)) {
                return [];
            }
            return this.pages.filter(p => p.published);
        }
    },
    methods: {
        changeTheme() {
            if (this.theme == 'light') {
                this.theme = 'dark';
            }
            else {
                this.theme = 'light';
            }
            this.storeThemeSetting();
        },
        storeThemeSetting() {
            localStorage.setItem('theme', this.theme);
        },
        getThemeSetting() {
            let theme = localStorage.getItem('theme');
            if (theme) {
                this.theme = theme;
            }
        },
        navigateTo(route) {
            this.$router.push(route);
        }
    }
}
</script>

<style>
.navbar{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 確保 Navbar 在其他元素之上 */
}
.active{
    border-bottom: 2px solid #0069d9; /* 这里你可以根据需要调整颜色和底线的厚度 */
  }
</style>