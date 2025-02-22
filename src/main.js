import { createApp } from "vue";
import "@/assets/styles/index.less";
import App from "@/App.vue";
import router from "@/router";
import components from "@/components";

const app = createApp(App);
// 使用路由
app.use(router).use(components);

app.mount("#app");
