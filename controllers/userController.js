const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  //Validation
  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error("Por favor llene todos los campos");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("La contraseña debe contener minimo 6 caracteres");
  }

  //check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("El correo ya esta registrado");
  }

  //Create new User
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });

  //Generate token
  const token = generateToken(user._id);

  //Send HTTP-only Cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //expires 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, firstname, lastname, email, password, avatar, phone, role } =
      user;
    res.status(201).json({
      _id,
      firstname,
      lastname,
      email,
      password,
      avatar,
      phone,
      role,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Datos invalidos de usuario");
  }
});

//Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Por favor inserta correo y contraseña");
  }

  //Check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Usuario no registrado, por favor registrarse");
  }

  //User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate token
  const token = generateToken(user._id);

  //Send HTTP-only Cookie
  if (passwordIsCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //expires 1 day
      sameSite: "none",
      secure: true,
    });
  }

  if (user && passwordIsCorrect) {
    const { _id, firstname, lastname, email, password, avatar, phone, role } =
      user;
    res.status(200).json({
      _id,
      firstname,
      lastname,
      email,
      password,
      avatar,
      phone,
      role,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Correo o  Contraseña Invalida");
  }
});

//Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //expires 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Has salido correctamente." });
});

//Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, firstname, lastname, email, password, avatar, phone } = user;
    res.status(200).json({
      _id,
      firstname,
      lastname,
      email,
      password,
      avatar,
      phone,
    });
  } else {
    res.status(400);
    throw new Error("Usuario no encontrado");
  }
});

// Get Users
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Actual page
  const pageSize = parseInt(req.query.pageSize) || 10; // Number of users per page

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / pageSize);

  const users = await User.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  if (users && users.length > 0) {
    const usersData = users.map((user) => {
      const { _id, firstname, lastname, email, avatar, phone, role } = user;
      return {
        _id,
        firstname,
        lastname,
        email,
        avatar,
        phone,
        role,
      };
    });

    res.status(200).json({
      users: usersData,
      totalPages,
      currentPage: page,
    });
  } else {
    res.status(404);
    throw new Error("No se encontraron usuarios");
  }
});

//Delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id

    const user = await User.findById(userId)
    //verify if user exists
    if(!user) {
      res.status(400)
      throw new Error("Usuario no encontrado")
    }
    //Delete User
    await User.findByIdAndDelete(userId)
    res.status(200).json({
      message: "Usuario eliminado correctamente.",
    })

  } catch (error) {
    res.status(500)
    throw new Error("Error al eliminar el usuario.")
  }
})

// Get Login Status

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { firstname, lastname, email, avatar, phone } = user;
    user.email = email;
    user.firstname = req.body.firstname || firstname;
    user.lastname = req.body.lastname || lastname;
    user.avatar = req.body.avatar || avatar;
    user.phone = req.body.phone || phone;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

//Change Password
const changePassword = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id)
  const { oldPassword, password } = req.body

  if(!user) {
    res.status(400)
    throw new Error("usuario no encontrado, favor iniciar sesion.")
  } 

  //Validate

  if(!oldPassword || !password) {
    res.status(400)
    throw new Error("Por favor agregue la contraseña antigua y la nueva")
  }

  //Check if oldPassword matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

  //Save new password
  if (user && passwordIsCorrect) {
    user.password = password
    await user.save()
    res.status(200).send("Su contraseña cambio correctamente")
  } else {
    res.status(400)
    throw new Error("Su antigua contraseña es incorrecta.")
  }
})

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("El usuario no existe");
  }

  // Delete Token if it exists on DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create token before save on db
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Save token on DB
  await new Token({
    userId: user._id,
    token: resetToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * (60 * 1000), // 10 minutes to expires
  }).save();

  // Construct URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Email body
  const message = `
  <div style="background-color: #F5F5F5; padding: 20px; border-radius: 10px; text-align: center; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333;">
    <h2 style="color: #007BFF;">Hola, ${user.firstname}</h2>
    <p style="font-size: 16px; color: #666;">Por favor utiliza este enlace para restablecer tu contraseña.</p>
    <p style="font-size: 16px; color: #666;">Recuerda que este enlace solo está disponible por 10 minutos.</p>
    <a href="${resetUrl}" style="display: block; margin: 20px 0; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">${resetUrl}</a>
    <p style="font-size: 16px; color: #666;">Que tengas un lindo día...</p>
    <h3 style="color: #333;">Equipo GEAPP</h3>
  </div>
  `;

  const subject = "Solicitud de Restablecimiento de Contraseña";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    // Send Email 
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({
      success: true,
      message: "Mensaje enviado para restablecimiento.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email no enviado, por favor inténtelo de nuevo.");
  }
});


//Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    // Find token on db and check if not expires
    const userToken = await Token.findOne({
      token: resetToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!userToken) {
      res.status(404);
      throw new Error("Token inválido o expirado");
    }

    const user = await User.findOne({ _id: userToken.userId });

    if (!user) {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }

    // Validate new password
    if (!password || password.length < 6) {
      res.status(400);
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // New password
    user.password = password;

    // Save new password on DB
    await user.save();

    // Delete token on DB
    await userToken.remove();

    // Response Success
    res.status(200).json({
      message: "Su contraseña se cambio correctamente, por favor iniciar sesión.",
    });
  } catch (error) {
    console.error("Error durante el restablecimiento de contraseña:", error);
    res.status(500).json({
      message: "Error al cambiar la contraseña. Por favor, inténtalo de nuevo.",
    });
  }
});


module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  getUsers,
  deleteUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
