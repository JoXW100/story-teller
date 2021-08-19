@echo off
cd "./server/"
start /b call npm start
cd "../client/"
start /b call npm start