const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 50,
            trim: true,
            validate: {
                validator: function(v) {
                    if (!v || typeof v !== 'string') return false;
                    return /^[a-zA-Z\s]+$/.test(v) && v.trim().length > 0;
                },
                message: 'First name should contain only letters and spaces'
            }
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address: " + value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter a Strong Password");
                }
            },
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Others"],
                message: `{VALUE} is not a valid gender type`,
            },
            validate: {
                validator: function(v) {
                    return !v || ["Male", "Female", "Others"].includes(v);
                },
                message: 'Gender must be Male, Female, or Others'
            }
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        membershipType: {
            type: String,
        },
        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate: {
                validator: function(value) {
                    if (!value || value.trim() === "") {
                        return true; // Allow empty strings
                    }
                    return validator.isURL(value);
                },
                message: "Invalid Photo URL format"
            }
        },
        about: {
            type: String,
            default: "This is a default about of the user!",
        },
        skills: {
            type: [String],
        },
    },
    { timestamps: true }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);