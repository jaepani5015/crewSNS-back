// import { PrismaClient } from '@prisma/client';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // ... you will write your Prisma Client queries here
    const allPost = await prisma.post.findMany();
    console.log('allPost', allPost);
    // const allUser = await prisma.user.findMany();
    // console.log('allUser', allUser);

    // const inserUser = await prisma.user.create({
    //     data : {
    //         user_id : 'jaepani',
    //         user_pw : '123123',
    //     }
    // });
    // console.log(inserUser);

    const inserPost = await prisma.post.create({
        data: {
            post_title: "jaepani post",
            post_content: "jaepani post content",
            user: {
                connect: { user_id: 'test' }
            }
        },

    });

    console.log(inserPost);
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })