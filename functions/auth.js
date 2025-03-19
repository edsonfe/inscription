export async function handler(event) {
  if (event.httpMethod === "POST") {
      const { username, password } = JSON.parse(event.body);

      // Obtenha as credenciais das variáveis de ambiente
      const validUsername = process.env.VALID_USERNAME;
      const validPassword = process.env.VALID_PASSWORD;

      if (username === validUsername && password === validPassword) {
          return {
              statusCode: 200,
              body: JSON.stringify({ success: true }), // Login válido
          };
      } else {
          return {
              statusCode: 200,
              body: JSON.stringify({ success: false }), // Login inválido
          };
      }
  }

  return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não suportado" }),
  };
}
