"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Label {
    // Constructor
    constructor(c_id, c_url, c_name, c_color, c_description = "", c_default = true) {
        this.name = c_name;
        this.id = c_id;
        this.color = c_color;
        this.description = c_description;
        this.url = c_url;
        this.ldefault = c_default;
    }
}
exports.Label = Label;
//# sourceMappingURL=label.js.map