const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404).send(error);
    next(error);
}

module.exports = { notFound };