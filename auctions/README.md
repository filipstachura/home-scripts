# Install dependencies

Generate gmail password using: https://myaccount.google.com/apppasswords and save the password to `.gmail.pass`.

Make sure to have: node, python, R already installed!

After that:
```
npm install -g casperjs # NPM / Ubuntu
brew install casperjs # MAC

R -e "install.packages('mailR')"
```


# Scheduling

Add to crontab:
```
00 * * * * ~/.home-scripts/auctions/send_update.sh
```