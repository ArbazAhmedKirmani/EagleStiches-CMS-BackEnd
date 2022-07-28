const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    NTN: {
      type: String,
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
    },
    References: {
      type: String,
    },
    fax: {
      type: String,
    },
    website: {
      type: String,
    },
    employeeEmails: [
      {
        type: String,
      },
    ],
    companyName: {
      type: String,
    },
    menus: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    state: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    postalAddress: {
      type: String,
    },
    deliveryAddress: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      min: 8,
    },
    phoneNumber: {
      type: String,
    },
    cellNumber: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
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
      ref: "salespersons",
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
