"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var filename = "123.txt";
var data = "123";
(0, fs_1.writeFile)(filename, data, function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Wrote ".concat(data, " to ").concat(filename));
});
//# sourceMappingURL=main.js.map