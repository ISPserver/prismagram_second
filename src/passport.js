//passport는 쿠키와 세션 작업을 하기에 좋다. 
//쿠키를 가져오고 만들어주는 모든 일을 하기 때문
import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve(__dirname, ".env") });

import passport from "passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const verifyUser = async(payload, done) => {
    try{
        const user = await prisma.user({id: payload.id});
        if(user !== null){
            return done(null,user);
        } else {
            return done(null,false);
        }
    } catch(error){
        return done(error,false);
    }    
};


export const authenticateJwt = (req, res, next) => 
passport.authenticate("jwt",  { sessions:false }, (error,user) => {
    if(user){
        req.user = user;
    }
    next();
})(req, res, next);
//여기까지 과정 => 1.토큰을 받아서 2.해석하고
//                3.사용자를 찾고 4.사용자가 존재하면 req객체에 사용자 추가
//                5. graphql 함수를 실행하는 것.

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
