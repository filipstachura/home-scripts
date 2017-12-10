# Install dependencies

Make sure to have: node, python, R already installed!

After that:
```
npm install -g casperjs # NPM / Ubuntu
brew install casperjs # MAC

R -e "install.packages('sendmailR')"
```


# Scheduling

Add to crontab:
```
00 * * * * ~/.home-scripts/auctions/send_update.sh
```
