
exports.injectIntoTemplate = function(template, injectingArray) {
    const splittingOperator = "<inject-here></inject-here>";

    let splitted =    template.split(splittingOperator) ; 

    let r = "";
    splitted.forEach((element, index) => {
        r += element;

        if (injectingArray[index]) {
            r += injectingArray[index];
        }

    });


    return r;


}


