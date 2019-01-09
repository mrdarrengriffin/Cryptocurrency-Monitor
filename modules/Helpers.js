module.exports.isBase64 = function(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}