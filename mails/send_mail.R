library(mailR)

mail_dir <- getwd()

send_update <- function(title, conent) {
  pass <- readLines(file.path(mail_dir, ".gmail.pass"))[1]

  from <- "fylyps@gmail.com"
  to <- c(from, 'kwkamilakw@gmail.com')

  send.mail(from = from,
            to = to,
            subject = title,
            body = content,
            html = TRUE,
            encoding = "utf-8",
            smtp = list(host.name = "smtp.gmail.com", port = 465,
                        user.name = "fylyps", passwd = pass, ssl = TRUE),
            authenticate = TRUE,
            send = TRUE)
}
