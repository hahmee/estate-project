import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import axios from "axios";

export const register = async (req, res) => {
  const { username, email, password, avatar, externalType = 'native', externalId } = req.body;

  try {

    // CHECK IF ALREADY EXISTS
    const user = await prisma.user.findUnique({ where: { email } });

    if(externalType != 'native' && user && user.externalId == externalId && user.externalType == externalType ) {
      return res.status(200).json({message: `${externalType} 로그인, 이미 존재하는 유저입니다.`});
    }

    // HASH THE PASSWORD
    const hashedPassword = password && await bcrypt.hash(password, 10);

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatar,
        externalType,
        externalId
      },
    });

    console.log(newUser);

    res.status(201).json({ message: "정상적으로 회원가입되었습니다." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "회원가입 실패했습니다." });
  }
};

export const login = async (req, res) => {
  const {email, password, externalType='native', externalId } = req.body;
  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(400).json({ message: "잘못된 아이디입니다." });

    // CHECK IF THE PASSWORD IS CORRECT

    if(externalType === 'native') {
      const isPasswordValid =  await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(400).json({ message: "잘못된 비밀번호입니다." });
    }else {
      const isExternalIdValid = (externalId === user.externalId) && (externalType === user.externalType);
      if (!isExternalIdValid)
        return res.status(400).json({ message: "잘못된 정보입니다." });
    }

    // GENERATE COOKIE TOKEN AND SEND TO THE USER

    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "로그인에 실패했습니다." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "로그아웃 했습니다." });
};

export const googleLoginAccessToken = async (req, res) => {

  const { accessToken } = req.body;

  const GOOGLE_USERINFO_REQUEST_URL="https://www.googleapis.com/oauth2/v1/userinfo";

  try {
    const headers = {
      "Authorization": `Bearer ${accessToken}`
    }
    const response = await axios.get(GOOGLE_USERINFO_REQUEST_URL, {
      headers: headers
    });
    
    console.log('response', response.data);
    res.status(200).json(response.data);

  }catch (error) {
    console.log(error);
    res.status(500).json({ message: "사용자의 구글로그인 정보를 가져오는데 문제 발생했습니다." });
  }



}