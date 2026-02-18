const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  // Populate the blogs field of each user with their actual blogs
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    response.status(400).json({ error: "username and password are required" });
  } else if (username.length < 3 || password.length < 3) {
    response.status(400).json({
      error: "username and password must be at least 3 characters long",
    });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    // Only return the username and name fields, not the passwordHash
    const userToReturn = {
      username: savedUser.username,
      name: savedUser.name,
      id: savedUser._id,
    };

    response.status(201).json(userToReturn);
  }
});

module.exports = usersRouter;
