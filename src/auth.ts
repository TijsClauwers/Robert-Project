import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || 'true') === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(provider.server);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: `<p>Sign in to <strong>${host}</strong></p><p><a href="${url}">Click here to sign in</a></p>`,
        });
      },
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login/check-email',
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      // @ts-expect-error - role lives on our Prisma User model
      session.user.role = user.role;
      return session;
    },
  },
});
