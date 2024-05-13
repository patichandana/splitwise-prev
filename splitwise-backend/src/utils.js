const getCurrentTimeStamp = () => {
    const today = new Date();
    console.log(today);
    return today.toJSON();
}

module.exports = {"getCurrentTimeStamp": getCurrentTimeStamp}