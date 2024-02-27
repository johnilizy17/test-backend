const jwt = require("jsonwebtoken");
let responses 

function tokenCallback()  {
    const verifyToken=({ authToken }) => {
        const token = authToken.split(' ')    
        try {
            jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET, function (err, decoded) { 
                 if(err){
                    throw err
                    responses = {data:"token has expired.", status:500, state:false}
                  
                 } else {
                    responses = {data: decoded, status:200, state:true}
                }

            });
        } catch (e) {
            throw err
            responses = {data:"Invalid token detected.", status: 500, state:false}
           
        }
        return responses
    };
    return { verifyToken }
}

module.exports = { tokenCallback }