/* Magic Mirror
 * Module: MMM-Finviz
 *
 * By Christian Stengel
 * MIT Licensed.
 */

Module.register("MMM-Finviz", {
    defaults: {
        updateInterval: 24 * 60 * 60 * 1000, // Update every 24 hours
        retryDelay: 5000,
        maxWidth: "100%",
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.imageUrl = null;

        // Schedule the first update
        this.scheduleUpdate();
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "finviz-wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            return wrapper;
        }

        if (this.imageUrl) {
            var img = document.createElement("img");
            img.src = this.imageUrl;
            img.style.maxWidth = this.config.maxWidth;
            wrapper.appendChild(img);
        }

        return wrapper;
    },

    getStyles: function () {
        return ["MMM-Finviz.css"];
    },

    scheduleUpdate: function (delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        // Initial data request
        if (delay === undefined) {
            this.sendSocketNotification("FETCH_MAP");
        }

        // Set recurrent update
        setInterval(function () {
            self.sendSocketNotification("FETCH_MAP");
        }, nextLoad);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "MAP_UPDATED") {
            // Update the image URL with a timestamp to prevent caching
            this.imageUrl = "/modules/MMM-Finviz/public/map.png?t=" + new Date().getTime();
            this.loaded = true;
            this.updateDom();
        }
    }
});
