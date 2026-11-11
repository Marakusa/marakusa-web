
const auth = (req, res, next) => {
    // TODO: auth logic
    next();
};

const authAdmin = (req, res, next) => {
    // TODO: admin auth logic
    next();
};

module.exports = { auth, authAdmin };