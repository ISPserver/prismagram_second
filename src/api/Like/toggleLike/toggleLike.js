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
            const filterOptions ={
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
            };            
                try{
                    //생성,삭제 2개 다 : filterOptions 사용
                    //like를 얻는 것과 like를 지우는 것 둘다 같은것이다.
                    //즉 mutation 하면 like 생성, 한번 더 누르면 like삭제
                    const existingLike = await prisma.$exists.like(filterOptions);
                    if(existingLike){
                        await prisma.deleteManyLikes(filterOptions);         
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