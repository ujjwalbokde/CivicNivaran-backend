const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(roles.includes(req.user.role)) {
            console.log(`User role ${req.user.role} authorized for this route`);
            next();
        }
        else {
            console.error(`User role ${req.user.role} not authorized for this route`);
            return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
        }
    };
};

module.exports = authorizeRoles;
