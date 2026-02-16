/* Magic Mirror
 * Node Helper: MMM-Finviz
 *
 * By Christian Stengel
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_MAP") {
            this.fetchMap();
        }
    },

    fetchMap: function () {
        const self = this;
        const scriptPath = path.resolve(__dirname, "fetch_map.js");

        console.log("MMM-Finviz: Fetching map using script " + scriptPath);

        exec(`node ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`MMM-Finviz: Error executing script: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`MMM-Finviz: Script stderr: ${stderr}`);
            }

            console.log(`MMM-Finviz: Script output: ${stdout}`);

            // Check if map.png exists
            const mapPath = path.resolve(__dirname, "public/map.png");
            if (fs.existsSync(mapPath)) {
                self.sendSocketNotification("MAP_UPDATED", { updated: true });
            }
        });
    }
});
