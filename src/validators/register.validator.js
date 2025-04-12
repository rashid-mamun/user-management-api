const Joi = require('joi');

const registerSchemaValidator = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  nid: Joi.number().integer().required(),
  profilePhoto: Joi.string().optional(),
  age: Joi.number().integer().min(18).required(),
  currentMaritalStatus: Joi.string()
    .valid('single', 'married', 'divorced', 'widowed')
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  authToken: Joi.string().optional(),
});

module.exports = registerSchemaValidator;