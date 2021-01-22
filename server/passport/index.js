const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const local = require('./local');

module.exports = () => {
    passport.serializeUser((user, done) => { return done(null, user.id); });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findFirst({
                where: { user_id: id }
            });
            return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });
    local();
}