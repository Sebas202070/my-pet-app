// src/lib/auth.js
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './db'; // Asume que db.js está en la misma carpeta lib
import User from './models/User'; // Asume que User.js está en lib/models

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect(); // Conecta a la base de datos

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Por favor, ingresa tu email y contraseña.');
        }

        // Busca al usuario por email y EXPLICITAMENTE SELECCIONA EL CAMPO PASSWORD
        const user = await User.findOne({ email: credentials.email }).select('+password'); // <--- ¡CAMBIO CLAVE AQUÍ!

        if (!user) {
          throw new Error('Credenciales inválidas.');
        }

        // Compara la contraseña proporcionada con la hasheada en la DB
        const isPasswordValid = await user.matchPassword(credentials.password);

        if (!isPasswordValid) {
          throw new Error('Credenciales inválidas.');
        }

        // Si las credenciales son válidas, devuelve el objeto de usuario
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // Asegúrate de que esta línea esté comentada o eliminada
    // signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
};