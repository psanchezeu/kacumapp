import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../lib/prisma.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar si el usuario ya existe en la base de datos
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        // Si no existe, crearlo
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              avatarUrl: profile.photos[0].value,
            },
          });
        }

        // Pasar el usuario al siguiente paso
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serializar el usuario para guardarlo en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar el usuario para recuperarlo de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
