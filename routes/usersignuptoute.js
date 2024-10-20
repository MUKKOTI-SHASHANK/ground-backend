import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { UserSignupModel } from "../models/usersignupmodel.js";
import jwt from "jsonwebtoken";

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await UserSignupModel.findOne({ email });
  // console.log(user);
  if (user) {
    return res.status(400).json({ message: "user already exists" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  // console.log(hashedpassword);

  const newuser = new UserSignupModel({
    username,
    email,
    password: hashedpassword,
  });

  await newuser.save();
  return res.json({ status: true, message: "SignUp successful" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSignupModel.findOne({ email });
  //   console.log(user);
  if (user) {
    const dbpassword = await bcrypt.compare(password, user.password);
    if (dbpassword) {
      const token = jwt.sign({ user: user.email }, process.env.SecretKey, {
        expiresIn: "1h",
      });
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   maxAge: 3600000,
      //   sameSite: 'None',
      //   secure: true,
      // });
      // console.log("token in login", token);
      return res.json({ status: true, message: "Login successful" });
    } else {
      return res.json({ message: "Incorrect Password" });
    }
  } else {
    return res.json({ message: "User Doesn't exists please sign up" });
  }
});

const verifyuser = async (req, res, next) => {
  try {
    // console.log("req in verify user back", req);
    const token = req.headers["x-access-token"];
    // console.log("token", token);
    if (!token) {
      return res.status(403).json({ status: false, message: "No token" });
    }
    const decoded = await jwt.verify(token, process.env.SecretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

router.get("/signout", (req, res) => {
  // res.clearCookie("token", {
  //   httpOnly: true,
  //   sameSite: 'None',
  //   secure: true,
  // });
  return res.json({ status: true, message: "Signout successful" });
});

router.get("/verify", verifyuser, (req, res) => {
  return res.json({ status: true, message: "Login" });
});

router.get("/classify", (req, res) => {
  // console.log("req", req);
  console.log("req.quer", req.query);
  const grainSize = parseFloat(req.query.grainSize) || 0;
  // console.log(grainSize);
  const area = parseFloat(req.query.area) || 0;
  // console.log("area");

  let grainSizeTechniques = [];
  let areaTechniques = [];

  if (grainSize >= 4.75) {
    grainSizeTechniques = [
      "vibratory roller",
      "dynamic compaction",
      "vibro floatation",
      "particulate grout",
      "mix in place and walls",
      "strips and membranes",
      "freezing",
      "remove and replace, with or without admixture",
    ];
  } else if (grainSize >= 0.075) {
    grainSizeTechniques = [
      "blasting",
      "terra probe",
      "vibratory roller",
      "compaction piles",
      "dynamic compaction",
      "vibro floatation",
      "particulate grout",
      "remove and replace, with or without admixture",
      "mix in place and walls",
      "strips and membranes",
      "freezing",
    ];
  } else if (grainSize >= 0.002) {
    grainSizeTechniques = [
      "blasting",
      "terra probe",
      "chemical grout",
      "displacement grout",
      "preloading",
      "surcharge fills",
      "dynamic consolidation",
      "electro osmosis",
      "mix in place and walls",
      "strips and membranes",
      "vibro replacement stone columns",
      "heating",
      "freezing",
      "remove and replace with or without admixture",
    ];
  } else {
    grainSizeTechniques = [
      "blasting",
      "terra probe",
      "compaction piles",
      "pressure injected lime",
      "displacement grout",
      "preloading",
      "surcharge fills",
      "dynamic consolidation",
      "electro osmosis",
      "mix in place and walls",
      "strips and membranes",
      "vibro replacement stone column",
      "heating",
      "freezing",
      "remove and replace with or without admixture",
      "moisture barrier",
      "prewetting",
      "structural fills",
    ];
  }

  if (area < 3000) {
    areaTechniques = [
      "blasting",
      "terra probe",
      "vibratory roller",
      "compaction piles",
      "vibro floatation",
      "particulate grout",
      "chemical grout",
      "pressure injected lime",
      "displacement grout",
      "preloading",
      "surcharge fills",
      "electro osmosis",
      "mix in pile and walls",
      "strips and membranes",
      "vibro replacement stone column",
      "heating",
      "freezing",
      "remove and replace with or without admixture",
      "moisture barrier",
      "prewetting",
      "structural fills",
    ];
  } else if (area < 7000) {
    areaTechniques = [
      "vibratory roller",
      "compaction piles",
      "dynamic compaction",
      "vibro floatation",
      "preloading",
      "surcharge fills",
      "vibro replacement stone column",
    ];
  } else {
    areaTechniques = [
      "vibratory roller",
      "compaction piles",
      "dynamic compaction",
      "vibro floatation",
      "preloading",
      "surcharge fills",
      "dynamic consolidation",
      "vibro replacement stone column",
    ];
  }

  // Find the common ground improvement techniques
  const commonTechniques = grainSizeTechniques.filter((technique) =>
    areaTechniques.includes(technique)
  );

  res.json({ commonTechniques });
});

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export { router as UserSignuproute };
