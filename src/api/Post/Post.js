import { prisma } from "../../../generated/prisma-client";

export default {
    Post: {
        //field를 computed field로 다 교체해서 이제 fragment
        //사용할 필요가 없게끔 한게 7~9줄
        files: ({ id }) => prisma.post({ id }).files(),
        comments: ({ id }) => prisma.post({ id }).comments(),
        user: ({ id }) => prisma.post({ id }).user(),
        isLiked: (parent, _, {request}) => {
            const { user } = request;
            const { id } = parent;
            return prisma.$exists.like({AND: {
                AND: [
                    {user: {
                        id: user.id
                    }
                },
                {
                    post: {
                        id
                    }
                }
            ]
            }})
        },
        likeCount: parent => 
        prisma
        .likesConnection({
            where: { post: { id:parent.id } }
        })
        .aggregate()
        .count()
    }
};