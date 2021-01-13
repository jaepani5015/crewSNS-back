// import { PrismaClient } from '@prisma/client';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // ... you will write your Prisma Client queries here
    const allPost = await prisma.post.findMany();
    const allUser = await prisma.user.findMany();
    console.log('allUser', allUser);
    console.log('allPost', allPost);
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })