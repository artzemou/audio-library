const router = require("express").Router();
const connection = require("./connection");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mailTo = require("../services/mailTo");

const { checkPassword, hashPassword } = require("../services/passwords");
const { cipher, decipher } = require("../services/ciphers");
const {CIPHERS_KEY} = require('../config');
const {verifyToken} = require("../services/authJwt");

router
  // Add a new user
  .post("/", (req, res) => {
    const { name, firstName, email, password, pwdConfirm } = req.body;
    let errors = [];
    // Check required fields
    if (!firstName) errors.push("First name is required");
    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (email && !validator.isEmail(email)) errors.push("Email is invalid");
    if (!password) errors.push("Password is required");
    if (password && password !== pwdConfirm)
      errors.push("Password confirmation doesn't match password");
    if (errors.length > 0) {
      return res.status(200).json({
        error: true,
        errors: errors,
      });
    }

    // Check email unicity
    connection.query(
      "SELECT id FROM users WHERE email = ?",
      [cipher(CIPHERS_KEY, email)],
      async (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
          return res.status(200).json({
            error: true,
            errors: ["This user is allready exist"],
          });
        } else {
          // All is good... Add user
          connection.query(
            "INSERT INTO users SET ? ",
            {
              email: cipher(CIPHERS_KEY, email),
              firstName: cipher(CIPHERS_KEY, firstName),
              name: cipher(CIPHERS_KEY, name),
              password: await hashPassword(password),
            },
            (error, results) => {
              if (error) throw error;
              mailTo(
                email,
                process.env.ADMIN_EMAIL,
                "Inscription",
                "Votre compte a été créé"
              );
              return res.status(200).json({
                error: false,
                data: results,
                message: "New user has been created successfully.",
              });
              //
            }
          );
        }
      }
    );
  })
  //  Update user with id
  .put("/", function (req, res) {
    let { id, firstName, name, email } = req.body;
    let errors = [];
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Please provide user id",
      });
    }
    if (!firstName) errors.push("First name is required");
    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (email && !validator.isEmail(req.body.email))
      errors.push("Email is invalid");
    if (errors.length > 0) {
      return res.status(200).json({
        error: true,
        errors: errors,
      });
    }

    connection.query(
      "UPDATE users SET firstName = ?, name = ?, email = ? WHERE id = ?",
      [cipher(CIPHERS_KEY, firstName), cipher(CIPHERS_KEY, name), cipher(CIPHERS_KEY, email), id],
      function (error, results, fields) {
        if (error) throw error;
        return res.status(200).json({
          error: false,
          data: results,
          message: "User has been updated successfully.",
        });
        //
      }
    );
  })
  //  Delete user
  .delete("/", function (req, res) {
    let id = req.body.id;
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Please provide user id",
      });
    }

    connection.query(
      "DELETE FROM users WHERE id = ?",
      [id],
      function (error, results, fields) {
        if (error) throw error;
        return res.status(200).json({
          error: false,
          data: results,
          message: "User has been deleted successfully.",
        });
        //
      }
    );
  })

  .get("/", verifyToken, (req, res) => {
    connection.query("SELECT * FROM users", (error, results, fields) => {
      if (error) throw error;
      results.map((result) => {
        result.email = decipher(CIPHERS_KEY, result.email);
        result.firstName = decipher(CIPHERS_KEY, result.firstName);
        result.name = decipher(CIPHERS_KEY, result.name);
      });

      return res.status(200).json({
        results,
      });
    });

    ;
  })

  // Retrieve user with id
  .get("/:id", verifyToken, function (req, res) {
    let id = req.params.id;
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Please provide user id",
      });
    }

    connection.query(
      "SELECT * FROM users where id=?",
      id,
      (error, results, fields) => {
        if (error) throw error;
        results.map((result) => {
          result.email = decipher(CIPHERS_KEY, result.email);
          result.firstName = decipher(CIPHERS_KEY, result.firstName);
          result.name = decipher(CIPHERS_KEY, result.name);
        });
        return res.status(200).json({
          error: false,
          result: results[0],
        });
      }
    );

    ;
  })

  //SignIn
  .post("/signIn", async (req, res) => {
    const { email, password } = req.body;

    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [cipher(CIPHERS_KEY, email)],
      async (error, results) => {
        if (error) throw error;
        if (!results[0])
          return res
            .status(200)
            .send({ error: true, errors: ["No user found."] });

        let passwordIsValid = await checkPassword(
          password,
          results[0].password
        );

        if (!passwordIsValid)
          return res
            .status(401)
            .send({ auth: false, errors: ["Invalid password"] });

        let token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, {
          expiresIn: 86400, // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
      }
    );

    ;
  })

module.exports = router;
