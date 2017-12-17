library(rvest)
library(dplyr)
library(purrr)
library(tm)



file <- read_html("~/Pulpit/DietMap.html")

nodes <- file %>%
  html_nodes(".meal-title.clearfix")

nodes_text <- html_text(nodes)

name <- nodes_text %>% stringr::str_replace_all(pattern = "\\t|\\n|  +|usuń|[0-9]+| g", replacement = "")

weight_text <- nodes %>% html_nodes("div.value") %>% html_text
weight <- weight_text[1:length(name)*2] %>%
  stringr::str_replace_all(pattern = ' g', replacement = '')

data.frame(name = name,
           waga = as.numeric(weight)*1.6) %>%
openxlsx::write.xlsx('~/Pulpit/lista_zakupow.xlsx')
