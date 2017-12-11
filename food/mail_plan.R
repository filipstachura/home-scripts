library(lubridate)
library(purrr)
library(purrrlyr)
library(dplyr)
library(jsonlite)
library(shiny)

source('../mails/send_mail.R', chdir = TRUE)

prepare_content <- function() {
  read_json("plan.json") %>%
    map(function(meal) {
      tagList(
        tags$h1(meal$title),
        map(meal$ingredients, tags$p),
        HTML(meal$recipe)
      )
    }) %>%
    map(as.character) %>%
    do.call(paste0, .) %>%
    paste0("<html>", ., "</html>")
}

content <- prepare_content()
print(content)
title <- paste("Diet plan:", today())
send_update(title, content)
