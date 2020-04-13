import { ROOM_FRAGMENT } from "../../../fragments";
import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation:{
        sendMessage: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            const { roomId, message, toId } = args;
            //room이 없어서 만약 roomId가 없으면 meesage는 새로운거
            //toId는 message를 만들고 room도 만들고
            let room;
            if(roomId === undefined) {
              if(user.id !== toId){ //만약 toid가 없고 roomid가 있으면
                room = await prisma.
                createRoom({ //New room create and put
                    participants: {
                        connect: [{ id: toId}, {id: user.id}]
                }
            }).$fragment(ROOM_FRAGMENT);
            }
            } else { // or Room find, and put
                room = await prisma.room({id: roomId}).$fragment(ROOM_FRAGMENT);                                
                //그 id로 room을 찾는다
            }
            if(!room){
                throw Error("Room not found");
            }
            const getTo = room.participants.filter(
                participant => participant.id !== user.id
                // 여기서 participant는 request를 요청하는 user가 아님.
                )[0];
            return prisma.createMessage({
                text: message, 
                from:{ // from user message
                    connect: { id: user.id}
                },
                to: {
                    connect: {
                        id: roomId ? getTo.id : toId
                        //만약 roomid가 없으면 우리가 보내려는 사람에게 감
                    }
                },
                room: { 
                    connect: {
                        id: room.id
                    }                    
                }
            })        
        }
    }
};