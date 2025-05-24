import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { fullname, telephone, address, role, email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);

    //Entra un hash y se encripta
    const passwordHash = await bcrypt.hash(password, 10);

    //Se crea un nuevo usuario
    const newUser = new User({
      fullname,
      telephone,
      address,
      role,
      state: "activo",
      email,
      password: passwordHash,
    });

    //Se guarda el usuario
    const userSaved = await newUser.save();

    // const token = await createAccessToken({
    //   id: userSaved._id,
    //   role: userSaved.role,
    // }); //Incluye el rol en el token
    // res.cookie("token", token);

    //Devuelve el usuario registrado
    res.json({
      id: userSaved.id,
      fullname: userSaved.fullname,
      telephone: userSaved.telephone,
      address: userSaved.address,
      role: userSaved.role,
      state: userSaved.state,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
    }); //Incluye el rol en el token

    res.cookie("token", token);

    //Devuelve el usuario registrado
    res.json({
      id: userFound.id,
      fullname: userFound.fullname,
      email: userFound.email,
      role: userFound.role,
      creartedAd: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(404).json({ message: "User nor found" });

  return res.json({
    id: userFound.id,
    fullname: userFound.fullname,
    telephone: userFound.telephone,
    address: userFound.address,
    role: userFound.role,
    state: userFound.state,
    email: userFound.email,
    pets: userFound.pets,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

//Ruta para verificar que el usuario siga autenticado en la página
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(400).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound.id,
      fullname: userFound.fullname,
      email: userFound.email,
    });
  });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({
        createdAt: -1,
      });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(204).json({ message: "Successfully deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullname, telephone, address, role, state, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        telephone,
        address,
        role,
        state,
        email,
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
