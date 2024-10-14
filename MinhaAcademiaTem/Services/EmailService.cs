using Microsoft.Extensions.Options;
using MinhaAcademiaTem.Models;
using System.Net;
using System.Net.Mail;

namespace MinhaAcademiaTem.Services
{
    public class EmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly SmtpConfiguration _smtpConfig;

        public EmailService(ILogger<EmailService> logger, IOptions<SmtpConfiguration> smtpOptions)
        {
            _logger = logger;
            _smtpConfig = smtpOptions.Value;
        }

        public bool Send(string toName, string toEmail, string subject, string body, string fromName = "Consultoria Rubem Puttini", string fromEmail = "consultoria@rubemputtini.com.br")
        {
            var smtpClient = new SmtpClient(_smtpConfig.Host, _smtpConfig.Port)
            {
                Credentials = new NetworkCredential(_smtpConfig.UserName, _smtpConfig.Password),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true
            };

            var mail = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mail.To.Add(new MailAddress(toEmail, toName));
    
            try
            {
                smtpClient.Send(mail);
                _logger.LogInformation("E-mail enviado com sucesso para {Email}", toEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail para {Email}", toEmail);
                return false;
            }
        }
    }
}
