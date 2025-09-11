<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

class PHPMailerService
{
    public function sendHtml(string $toEmail, string $toName, string $subject, string $html): void
    {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host       = env('MAIL_HOST');
        $mail->SMTPAuth   = true;
        $mail->Username   = env('MAIL_USERNAME');
        $mail->Password   = env('MAIL_PASSWORD');

        $enc = strtolower((string) env('MAIL_ENCRYPTION', 'tls'));
        $mail->SMTPSecure = $enc === 'ssl'
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;

        $mail->Port       = (int) env('MAIL_PORT', 587);

        $mail->CharSet    = 'UTF-8';
        $mail->isHTML(true);

        $mail->setFrom(env('MAIL_FROM_ADDRESS', 'no-reply@localhost'), env('MAIL_FROM_NAME', 'Estoque Aqui'));
        $mail->addAddress($toEmail, $toName);

        $mail->Subject = $subject;
        $mail->Body    = $html;

        $mail->send();
    }
}
