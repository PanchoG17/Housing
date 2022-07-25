import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_NAME,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });


      const { email, nombre , token} = datos

      // Enviar email
      await transport.sendMail({

        from: 'Housing.com',
        to: email,
        subject: 'Hola! Confirmá tu cuenta!',
        text: 'BIENVENIDO !!',
        html: `

            <p> Hola ${nombre}, confirmá tu cuenta para acceder housing.com y descubrir las oportunidades que tenemos para vos </p>

            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar Cuenta </a> </p>

            <p> Si tú no creaste una cuenta en housing.com podes descartar este mensaje </p>

        `

      })


      console.log(datos);

}

export {
    emailRegistro
}