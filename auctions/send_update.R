library(lubridate)
library(purrr)
library(purrrlyr)
library(dplyr)

source('../mails/send_mail.R')

parse_price <- function(price) {
  price %>%
    gsub(';', '.', ., fixed = TRUE) %>%
    gsub(' zł', '', ., fixed = TRUE) %>%
    as.numeric() %>%
    round(2)
}

prepare_content <- function() {
  data <- read.csv("export.csv", stringsAsFactors = FALSE)

  content <- data %>%
    mutate(price = map_dbl(price, parse_price)) %>%
    arrange(price) %>%
    by_row(function(row) {
      paste("<a href='", row$url, "'>", format(row$price, nsmall = 2), ": ", row$name, "</a><br/>")
    }) %>%
    {.$.out} %>%
    as.list() %>%
    do.call(paste, .)
  paste("<html>", content, "</html>")
}

content <- prepare_content()
title <- paste("Housing:", today())
send_update(title, content)
