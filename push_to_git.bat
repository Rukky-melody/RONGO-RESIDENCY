@echo off
git init
git remote remove origin
git remote add origin "https://github.com/Rukky-melody/RONGO-RESIDENCY.git"
git add .
git commit -m "Merge About Us content into Homepage and add animations"
git branch -M main
git push -u origin main
