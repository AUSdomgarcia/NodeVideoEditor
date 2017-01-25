var VE = window.VE || {};

VE.request = {};

VE.request = function request(opts) {
    var scope = this;
    this.opts = opts;
    this.root = opts.root;
    this.canvas = null;

    this.$overlayList = $('.overlayList');
    this.$videoList = $('.videoList');
    this.promise = axios.create({ baseURL: this.opts.apiURL });
    this.initialize();

    this.overlayId = NaN;
    this.videoId = NaN;
};

/* Handle url loaders */
VE.request.prototype = {
    getOverlay: function getOverlay() {
        var scope = this;

        this.promise.get('/overlay')
            .then(function(response) {
                if (response.status === 200)
                    scope.bindUIOverlays(response);
            })
            .catch(function(error) {
                if (error) throw error;
            });
    },

    getVideo: function getVideo() {
        var scope = this;

        this.promise.get('/video')
            .then(function(response) {
                if (response.status === 200)
                    scope.bindUIVideos(response);
            })
            .catch(function(error) {
                if (error) throw error;
            });
    },

    attachFabric: function addFabric(canvas) {
        var scope = this;
        this.canvas = canvas;
    },

    bindUIOverlays: function bindUIOverlays(response) {
        var scope = this;
        var data = response.data.data;

        data.map(function(item) {
            // console.log(item);
            var li = document.createElement('li');
            var aTag = document.createElement('a');
            li.appendChild(aTag);
            aTag.innerHTML = item.title;
            aTag.setAttribute('href', 'javascript:void(0)');
            aTag.setAttribute('class', 'btn btn-default');
            aTag.setAttribute('data-overlay', scope.root.concat(item.path));
            aTag.setAttribute('data-id', item.id);
            scope.$overlayList.append(li);
        });
    },

    bindUIVideos: function bindUIVideos(response) {
        var scope = this;
        var data = response.data.data;

        data.map(function(item) {
            var li = document.createElement('li');
            var aTag = document.createElement('a');
            li.appendChild(aTag);
            aTag.innerHTML = item.title;
            aTag.setAttribute('href', 'javascript:void(0)');
            aTag.setAttribute('class', 'btn btn-default');
            aTag.setAttribute('data-video', scope.root.concat(item.path));
            aTag.setAttribute('data-id', item.id);
            scope.$videoList.append(li);
        });
    },

    initialize: function initialize() {
        var scope = this;
        this.getOverlay();
        this.getVideo();
    }
};
