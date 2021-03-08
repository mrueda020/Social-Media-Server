const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const { SECRET_KEY } = require("../../config");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //TODO validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Form not valid", {
          errors,
        });
      }

      //TODO make sure user does not exist
      const user = await User.findOne({ username: username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      // Hash password
      if (password.length < 8) {
        throw new UserInputError(
          "Password must be at least 8 characters long",
          {
            errors: {
              password: "Password must be at least 8 characters",
            },
          }
        );
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      // Create auth token
      const payload = {
        id: res.id,
        email: res.email,
        username: res.username,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Form not valid", { errors });
      }
      const user = await User.findOne({ username });

      if (!user) {
        throw new UserInputError("User not found", {
          errors: {
            general: "User not found",
          },
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError("User not found", {
          errors: {
            general: "Wrong credentials",
          },
        });
      }

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
