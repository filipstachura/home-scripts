library(mailR)

send.mail(from = from, to = to,
        subject = "Subject of the email",
        body = "Body of the email",
        smtp = list(host.name = "smtp.gmail.com", port = 465,
                    user.name = sender, passwd = "senders_password", ssl = TRUE),
        authenticate = TRUE,
        send = TRUE)
