const { validationResult } = require('express-validator');

function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.validationMapped = errors.mapped();
      }

      next();
    }
  ];
}

module.exports = { validate };
