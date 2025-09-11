    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f7f7f7; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">Olá, {{ $user->nome }}</h2>
            <p style="color: #555; font-size: 1rem;">
                Recebemos uma solicitação para <b>redefinir a sua senha</b> do sistema <b>ESTOQUE AQUI</b>.
            </p>
            <p style="color: #555; font-size: 1rem;">
                Caso você tenha feito essa solicitação, clique no botão abaixo para redefinir sua senha, o link expira em 60 minutos:
            </p>
            <div style="text-align: center; margin: 30px;">
                <a href="{{ $resetUrl }}" style="background-color:rgb(6, 62, 145); color: white; padding: 0.7rem 2rem; text-decoration: none; border-radius: 5px;">
                    🔐 Redefinir Senha
                </a>
            </div>
            <p style="color: #999; font-size: 14px;">
                Se você não solicitou esta alteração, pode ignorar este e-mail. Sua senha permanecerá a mesma.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; text-align: center;">
                &copy; 2025 Estoque Aqui. Todos os direitos reservados.
            </p>
        </div>
    </body>
    </html>