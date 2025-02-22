
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
export default function buildCompleteZip({
    outDir = 'dist',
    zipDir = './'
}) {
  return {
    name: "build-complete-zip",
    closeBundle() {
      console.log('打包完成！');
      const zipPath = path.join(zipDir, `${outDir}.zip`);
      // 如果zip文件已存在，先删除
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }

      const output = fs.createWriteStream(zipPath);
      // @ts-ignore
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', () => {
        console.log(`
          ✨ 打包完成
          📦 zip文件：${zipPath}
          📊 大小：${(archive.pointer() / 1024 / 1024).toFixed(2)} MB
        `);
      });

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('压缩警告：', err);
        } else {
          throw err;
        }
      });

      archive.on('error', (err) => {
        throw err;
      });

      archive.pipe(output);
      archive.directory(outDir, false);
      
      return archive.finalize();
    }
  }
}
