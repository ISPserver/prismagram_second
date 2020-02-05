import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

//만약 좋아요가 존재하면 이걸 지워야 하는게 필요.
//아직 지워야 하는 방법은 모름.

export default {
    Mutation: {
        toggleLike: async (_, args, { request }) => {
            isAuthenticated(request);
            const { postId } = args;
            const { user } = request;
                try{
                    const existingLike = await prisma.$exists.like({
                        AND: [
                            {
                                user: {
                                    id: user.id
                                }
                            },
                            {
                                post: {
                                    id: postId
                                }
                            }
                        ]  
                    });
                    if(existingLike){
                        // TO DO                
                    }else {
                        await prisma.createLike({
                            user: {
                            connect: {
                                id: user.id
                            }
                        },
                        post: {
                            connect: {
                                id: postId
                            }
                        }
                    });
                    }
                    return true;
                } catch {
                    return false;
                }
        }
    }
};