# ms_eagle_eye

启动server
调试 npx tsx server/index.ts
将package-server.json改成package.json
npm run build:server
pm2 start system.config.cjs
查看启动情况
pm2 logs


sudo lsof -i :80

sudo systemctl stop nginx