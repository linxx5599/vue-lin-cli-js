import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath } from "url";
import compression from "vite-plugin-compression";
import buildCompleteZip from "./plugins/build-complete-zip";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const filename = "dist";

const basePath = `/${filename}`;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // 开发服务器配置
  const serverConfig = {
    host: true, // 监听所有地址
    port: 3000,
    open: false, // 自动打开浏览器
    cors: true, // 允许跨域
    proxy: {
      // 配置代理
      "/api": {
        target: "http://localhost:3001/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  };
  const plugins = [vue(), vueJsx()];
  if (env.NODE_ENV !== "development") {
    plugins.push(
      compression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      })
    );
  }

  if (env.VITE_NODE_ENV === "compress") {
    plugins.push(buildCompleteZip({ outDir: filename }));
  }
  return {
    base: basePath,
    plugins,
    server: serverConfig,
    // 构建配置
    build: {
      //开启压缩
      outDir: filename, // 输出目录
      assetsDir: "assets", // 静态资源目录
      sourcemap: false, // 不生成 sourcemap
      minify: "terser", // 压缩方式
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console
          drop_debugger: true, // 移除 debugger
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "[ext]/[name]-[hash].[ext]",
        },
      },
    },
    // 解析配置
    resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue"], // 导入时想要省略的扩展名列表
      alias: {
        "@": __dirname + "/src",
        "@components": __dirname + "/src/components",
        "@assets": __dirname + "/src/assets",
      },
    },
  };
});
