import jwt from 'jsonwebtoken';
import User from '../models/user';

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    // get the token value from the HTTP header
    // it's in the form of: Authorization: bearer dfg8d6f89gdf9gfd
    var token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'aips2017jajacmasamitic', (err, decoded) => {
        if (err) {
            return res.status(401).end();
        }

        var userId = decoded.sub;

        User.findById(userId, (err, user) => {
            if (err || !user) {
                return res.status(401).end();
            }

            return next();
        });
    });
};