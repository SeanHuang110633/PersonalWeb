const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// username,email,password,date(default)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },

  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },

  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },

  date: {
    type: String,
    default: Date.now(),
  },
});

// mongoose schema middleware:userSchema 儲存資料前先把密碼hash
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
