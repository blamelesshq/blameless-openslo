var authToken;
// const setAuthToken = (token) => {
//     console.log(token)
//     authToken = token
// }

// const getAuthToken = () => {
//     console.log
//     return authToken;
// }

exports.getAuthToken = function () {
    console.log({
        authToken: authToken
    })
    return {
        authToken: authToken
    };
};
exports.setAuthToken = function (token) {
    authToken = token;
};
