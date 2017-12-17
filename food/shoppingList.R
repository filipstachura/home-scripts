library(rvest)
library(dplyr)
library(purrr)
library(tm)

file <- read_html("./DietMap.html", encoding = "utf-8")

name_to_shop_id_filename <- "name_to_shop_id.csv"
map_name_to_shop_id <- read.csv(name_to_shop_id_filename, stringsAsFactors = FALSE)

nodes <- file %>%
  html_nodes(".meal-title.clearfix")

nodes_text <- html_text(nodes)

fraction_map <- list(
  "\u00BC" = 0.25,
  "\u00BD" = 0.5,
  "\u00BE" = 0.75,
  "\u2153" = 0.33,
  "\u2154" = 0.66
)
match_fraction <- do.call(paste0, as.list(c('[', names(fraction_map), "]")))
fix_number_in_parentheses <- function(name, multiplier) {
  text <- stringr::str_match(name, "\\(.*\\)")[1, 1]

  if (is.na(text)) {
    name
  } else {
    number <- stringr::str_match(text, "\\d+")[1, 1]
    number <- ifelse(is.na(number), 0, as.numeric(number))
    fraction <- stringr::str_match(text, match_fraction)
    fraction <- ifelse(fraction %in% names(fraction_map), fraction_map[[fraction]], 0)
    paste_number <- as.character(round((number + fraction) * multiplier, 1))
    if (paste_number == "0") {
      # This means both matches failed and implied quantity is 1.
      # We need to insert multiplier:
      stringr::str_replace(name, "\\(", paste0("\\(", multiplier))
    } else {
      stringr::str_replace(name, paste0("\\((\\d* *", match_fraction, "|\\d+)"), paste0("\\(", paste_number))
    }
  }
}

# Tests:
# fix_number_in_parentheses("Pieprz czarny ( ½ szczypty)", 1.4)
# fix_number_in_parentheses(" Rzodkiewka (6 sztuk) ", 1.4 )
# fix_number_in_parentheses("Szczypiorek pęczek ( pęczek)", 1.4)

name_org <- nodes_text %>%
  stringr::str_replace_all(pattern = "\\t|\\n|usuń|(\\d+ g)", replacement = "") %>%
  stringr::str_replace_all(pattern = "  +", replacement = " ")
full <- map_chr(name_org, ~ fix_number_in_parentheses(., 1.4))
name <- stringr::str_replace_all(full, "(^ +)|\\(.*\\)", "") %>%
  stringr::str_replace_all(" *$", "") %>%
  stringr::str_replace_all('"', "'")

weight_text <- nodes %>% html_nodes("div.value") %>% html_text
weight <- weight_text[1:length(name)*2] %>%
  stringr::str_replace_all(pattern = ' g', replacement = '')

get_shop_id <- function(name) {
  if (name %in% map_name_to_shop_id$name) {
    map_name_to_shop_id[map_name_to_shop_id$name == name, ]$id
  } else {
    print(paste0("Add '", name, "'to name_to_shop_id.csv"))
    write(paste0("\"", name, "\","), file = name_to_shop_id_filename, append = TRUE)
    NA
  }
}

shop_id <- name %>% map_chr(get_shop_id)

data <- data.frame(food = name,
                   shop_id = shop_id,
                   full = full,
                   grams = as.numeric(weight)*1.4)

openxlsx::write.xlsx(data, './lista_zakupow.xlsx')
write.csv(data, './basket.csv', row.names = FALSE)

