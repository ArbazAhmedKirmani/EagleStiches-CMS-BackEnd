const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    NTN: {
      type: String,
      trim: true,
    },
    advanceAmount: {
      type: Number,
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    isVerifiedUser: {
      type: Boolean,
      default: false,
    },
    References: {
      type: String,
      trim: true,
    },
    fax: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    employeeEmails: [
      {
        type: String,
        trim: true,
      },
    ],
    companyName: {
      type: String,
      trim: true,
    },
    menus: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: Number,
      trim: true,
    },
    postalAddress: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      min: 8,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    cellNumber: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: ["Super Admin", "Admin", "User", "Customer"],
        default: "Customer",
      },
    },
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "salesPersons",
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = this.encryptPassword(this.password);
  next();
});

UserSchema.methods = {
  // Check the password on user signin
  authenticate: async function (plainTextPassword) {
    const comparedPassword = await bcrypt.compare(
      plainTextPassword,
      this.password
    );
    return comparedPassword;
  },
  // Hash the password
  encryptPassword: function (plainTextPassword) {
    if (!plainTextPassword) {
      return "";
    } else {
      return bcrypt.hashSync(plainTextPassword, 8);
    }
  },
  toJson: function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
  },
};

module.exports = mongoose.model("User", UserSchema);
