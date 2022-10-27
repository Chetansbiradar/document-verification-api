const joi = require("@hapi/joi")

const RegisterValidator = (data)=>{
    const joiSchema = joi.object({
        name: joi.string().min(3).required(),
        email:joi.string().email().required(),
        password:joi.string().min(8).required()
    })
    return joiSchema.validate(data)
}


module.exports = RegisterValidator