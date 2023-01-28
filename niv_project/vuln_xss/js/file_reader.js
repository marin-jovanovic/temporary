const fs = require("fs");

exports.getFileContent = function(path) {
    // try {
    const data = fs.readFileSync(path, 'utf8');
    // console.log(data);

    return data;
    // } catch (err) {
    //     console.error(err);
    //   }
}


// export 