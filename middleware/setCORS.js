module.exports = (req, res, next) => {
    // Add a header to the response
    res.set({ 'Access-Control-Allow-Origin': '*' });
    next();
};