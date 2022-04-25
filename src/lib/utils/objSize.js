const objSize = (obj) => {
    let size = 0;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

module.exports = objSize; 