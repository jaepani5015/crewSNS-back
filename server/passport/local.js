const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
    }, async (username, password, done) => {
        try {
            const user = await prisma.user.findFirst({ where: { user_id: username } });
            if (!user) return done(null, false, { reason: '존재하지 않는 사용자입니다.' });


            const result = await bcrypt.compare(password, user.user_pw);
            if (!result) return done(null, false, { reason: '비밀번호가 틀립니다.' });

            return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }
    }));
}