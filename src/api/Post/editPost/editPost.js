import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";
export default {
    Mutation:{  //Query gets data from the DB, mutation changes the DB

        editPost: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const{ id, caption, location, action } = args;
            const { user } = request;
            const post = await prisma.$exists.post({id, user: {id: user.id }});
            if (post) {
                if(action === EDIT){
                    return prisma.updatePost({
                        data: { caption, location},
                        where: { id }   
                    });
                }else if(action === DELETE){
                    return prisma.deletePost({ id}) //arg랑 id랑 같을 때
                }
            } else {
                throw Error("You can't do that")
            }
        }            
    }
}