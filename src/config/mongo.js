const { connect } = require("mongoose");
require("dotenv").config();

const initConection = async () => {
  const url = process.env.MONGOECOMMERCE;
  try {
    console.log("Base conectada");
    return await connect(url);
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

module.exports = initConection;
