const validator = require("validator");

const validatesSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter the name.");
    } else if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName", 
        "emailId",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
    ];

    if (!req.body) {
        throw new Error("Request body is required");
    }
    
    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
    return isEditAllowed;
};

module.exports = {
    validatesSignUpData,
    validateEditProfileData,
};
