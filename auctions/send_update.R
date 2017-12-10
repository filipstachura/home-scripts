library(mailR)

pass <- readLines(".gmail.pass")[1]

from <- "fylyps@gmail.com"
to <- c(from)
send.mail(from = from,
          to = to,
          subject = "Subject of the email",
          body = "Body of the email",
          smtp = list(host.name = "smtp.gmail.com", port = 465,
          user.name = "fylyps", passwd = pass, ssl = TRUE),
          authenticate = TRUE,
          send = TRUE)
