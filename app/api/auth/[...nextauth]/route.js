// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '/lib/db'; // Para conectar a la base de datos
import User from '/lib/models/User'; // Tu modelo de usuario

export const authOptions = {
  // Configura los proveedores de autenticación
  providers: [
    CredentialsProvider({
      name: 'Credentials', // Nombre que se mostrará en la página de inicio de sesión
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect(); // Conectar a la base de datos

        const { email, password } = credentials;

        // Buscar usuario por email
        const user = await User.findOne({ email });

        // Si el usuario no existe o la contraseña no coincide
        if (!user || !(await user.matchPassword(password))) {
          throw new Error('Credenciales inválidas');
        }

        // Si todo es correcto, retorna el objeto de usuario
        // Este objeto se guarda en la sesión. NO incluyas la contraseña aquí.
        return {
          id: user._id.toString(), // NextAuth necesita un ID de tipo string
          name: user.name,
          email: user.email,
          role: user.role, // Incluye el rol del usuario en la sesión
        };
      },
    }),
    // Puedes añadir otros proveedores aquí, ej. GoogleProvider, GitHubProvider
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  // Configuración de la sesión
  session: {
    strategy: 'jwt', // Usa JSON Web Tokens para la sesión
    maxAge: 30 * 24 * 60 * 60, // 30 días de duración de la sesión
  },
  // Páginas personalizadas (opcional, pero recomendado)
  pages: {
    signIn: '/login', // Redirige a esta página para iniciar sesión
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (Used for check email for callback email flow)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave this out if you want to redirect to the default NextAuth new user page)
  },
  // Callbacks para personalizar el JWT y la sesión
  callbacks: {
    async jwt({ token, user }) {
      // El 'user' solo está disponible en el primer inicio de sesión
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Añade el ID y el rol del usuario a la sesión
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  // Clave secreta para firmar los tokens JWT. ¡CRUCIAL para la seguridad!
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };