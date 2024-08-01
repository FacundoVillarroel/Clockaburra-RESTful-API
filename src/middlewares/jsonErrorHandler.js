const bodyParser = require("body-parser");

const jsonErrorHandler = bodyParser.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString(encoding));
    } catch (e) {
      res.status(400).send({
        message: "There was a syntax error in your JSON request.",
        error: e.message,
        ok: false,
      });
      throw e;
    }
  },
});

module.exports = jsonErrorHandler;
