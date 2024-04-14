import prisma from './prisma';


export async function getAllPosts() {
    return prisma.categories.findMany();
}