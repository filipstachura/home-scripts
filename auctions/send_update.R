library(mailR)
library(lubridate)
library(purrr)
library(purrrlyr)
library(dplyr)

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

send_update <- function(conent) {
  pass <- readLines(".gmail.pass")[1]

  from <- "fylyps@gmail.com"
  to <- c(from)

  send.mail(from = from,
            to = to,
            subject = paste("Housing:", today()),
            body = content,
            html = TRUE,
            encoding = "utf-8",
            smtp = list(host.name = "smtp.gmail.com", port = 465,
                        user.name = "fylyps", passwd = pass, ssl = TRUE),
            authenticate = TRUE,
            send = TRUE)
}

content <- prepare_content()
print(content)
send_update(content)
