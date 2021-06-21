#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 复制 README.md
cp docs/.vuepress/README.md docs/.vuepress/dist

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git config --local user.name CondoHero
git config --local user.email love2xinwei@gmail.com
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
git push -f git@github.com:condorheroblog/learn-ts-vuepress.git master:gh-pages

# 把整个项目提交到 Github 上
cd ..
cd ..
cd ..
git init
git config --local user.name CondoHero
git config --local user.email love2xinwei@gmail.com
git add .
# 每次提交需要改动这个信息
git commit -m '初始化项目' 
git push -f git@github.com:condorheroblog/learn-ts-vuepress.git master:master

cd -