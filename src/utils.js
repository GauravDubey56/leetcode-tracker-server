export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export const sendResponse = (res, {data, message, status}) => {
    const payload = {};
    message && (payload.Message = message);
    data && (payload.Data = data);

    res.status(status || 500).json(payload);
}

export const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
}