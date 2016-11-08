#!/usr/bin/sh

#------------------
# 部署测试环境时  npm run online -- "20160101QA部署"
# 1.清除API
# 2.打包JSP
# 3.复制文件至服务器
# 4.增加API
# 5.提交静态
# 6.拷贝至后端仓库提交
#------------------

#清除API
RS=`sed -e 's#/api##g' ./src/components/common/service/service.js`

echo $RS>./src/components/common/service/service.js
#打包JSP
webpack --config webpack.config.online.js --progress --colors

#复制文件至服务器

#scp -r ./dist/matrix root@10.4.27.177:/data/nginx/static/
#增加API
RS=`sed -e 's#apiHead = ""#apiHead = "/api"#g' ./src/components/common/service/service.js`

echo $RS>./src/components/common/service/service.js
#提交静态
git status

git add *
git commit --no-verify -m $1
git pull
git push


