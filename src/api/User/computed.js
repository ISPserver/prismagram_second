import { prisma } from "../../../generated/prisma-client";

export default {
    User: {     // Custom filed
        fullName: parent => {            
            return `${parent.firstName} ${parent.lastName}`;
        },
    amIFollowing: async(parent, _, {request}) => {
        const { user } = request;
        const { id:parentId } = parent;
        try{
            const exists = await prisma.$exists.user({
                AND: [{ id: parent }, { followers_some: [user.id] }]
            });
            console.log(exists);
            if(exists) { 
                return true; 
            }else{
                return false;
            }
        } catch(error) {
            console.log(error);
            return false;
        }
    },
    itsMe: (parent, _, {request}) => {
        const { user } = request;
        const { id: parentId } = parent;
        return user.id === parentId;
    }
}
};