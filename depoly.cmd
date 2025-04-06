@echo off
cd dist

if not exist ".git" (
    git init
    git remote add origin https://github.com/UF4OVER/UF4OVER.github.io.git
)

git add .
git commit -m "Update dist files"
git push origin master --force