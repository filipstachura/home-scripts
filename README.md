# Install dependencies

Generate gmail password using: https://myaccount.google.com/apppasswords and save the password to `.gmail.pass`.

Make sure to have: node, python, R already installed!

After that:
```
npm install -g casperjs # NPM / Ubuntu
brew install casperjs # MAC

R -e "install.packages('mailR')"
R -e "install.packages('rvest')"
R -e "install.packages('openxlsx')"
```


# Scheduling

Add to crontab:
```
00 * * * * cd ~/.home-scripts/; ./hourly.sh
```
