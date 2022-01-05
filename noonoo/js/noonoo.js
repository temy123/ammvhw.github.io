var host = 'http://ipleOffice.iptime.org:5005/';

const movie_type = [
    'kr_movie',
    'en_movie',
    'adult_movie',
    'ani_movie'
];

function clearMovies() {
    $('#parent').empty();
}

function changeHost() {
    var url = host + 'movie/host'
    var new_host = $('#host').val();

    $.post(url, {
            'host': new_host
        },
        function(response, textStatus, jqXHR) {
            console.log(response);
        }
    );

}

function getMovieButtons() {
    return document.getElementsByName('movie_type');
}

function getMovieType() {
    var btnMovies = getMovieButtons();
    for (var i = 0; i < btnMovies.length; i++) {
        var btn = btnMovies[i];
        var pressed = btn.getAttribute('aria-pressed');

        if (pressed == 'true') {
            return i;
        };
    }
    return 0;
}

function loadVideos() {
    var keyword_ = $('#keyword').val();
    var type_ = movie_type[getMovieType()];
    var page_ = $('#page').val();
    var url = host + 'noonoo/video/list?type=' + type_ + '&page=' + page_;

    clearMovies();

    $.get(url, function(data, textStatus, jqXHR) {
        for (var i = 0; i < data.length; i++) {
            var movieInfo = data[i];
            addList(movieInfo);
        }

        console.log(data);
    });
}

function setPage(pages) {
    $('#page').val(pages);
}

function getPage() {
    return $('#page').val();
}

function next() {
    var pageDom = document.getElementById('page');
    pageDom.value = (pageDom.value * 1) + 1;
    loadVideos();
}

function prev() {
    var pageDom = document.getElementById('page');
    pageDom.value = (pageDom.value * 1) - 1;
    loadVideos();
}

function loadVideo(type_, num_) {
    url = host + 'noonoo/video/link?type=' + type_ + '&num=' + num_;

    $.get(url, function(data, t, q) {
        link = new URL(data['link']);
        link = link.pathname.split('/');
        link = link[link.length - 2];

        url = host + 'noonoo/video/' + link + '/content?type=' + type_ + '&num=' + num_

        jwplayer.key = "uoW6qHjBL3KNudxKVnwa3rt5LlTakbko9e6aQ6VUyKQ=";
        window.disableP2pEngineIOSAutoInit = true;
        var playerInstance = jwplayer("jw_player").setup({
            width: "100%",
            aspectratio: "16:9",

            playlist: [{
                sources: [{
                    "default": false,
                    "file": url,
                    "type": "hls",
                    "preload": "none",
                }]
            }],
            "primary": "html5",
            "hlshtml": true,
            "cast": {},


            hlsjsConfig: {
                maxBufferSize: 0,
                maxBufferLength: 10,
                liveSyncDurationCount: 10,
                p2pConfig: {
                    // showSlogan: false,
                    live: true, // set to false in VOD mode
                    // announceLocation: "hk",
                    // useHttpRange: true,
                }
            },

            playbackRateControls: true,
            playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3],
            skin: {
                controlbar: {
                    "icons": "rgba(255,255,255,1.0)",
                    "iconsActive": "#ff0000"
                },
                timeslider: {
                    "progress": "#ff0000",
                }
            },
        });
        playerInstance.on("firstFrame", () => {});

    });
}

function addList(d) {
    var listGroup = $('#parent');

    var title = d['title'];
    var detail = d['detail_link'];
    var thumb = d['img_link'];
    var html = '';

    url = new URL(detail);

    var type_ = url.pathname.split('/')[1];
    var num_ = url.pathname.split('/')[2];

    url = './player.html?type=' + type_ + '&num=' + num_;

    html += '<a href="' + url + '" class="items-body-content tv_card_body">';
    html += '<div class="card">';
    html += '<img class="card-img-top thumb" src="' + thumb + '">';
    html += '<div class="card-body">';
    html += '<h6 class="card-title">' + title + '</h6>';
    html += '</div></div></a>';

    console.log(d);

    listGroup.append(html);

}


$(document).ready(function() {
    bindProgress();

    $("#keyword").keydown(function(key) {
        if (key.keyCode == 13) {
            search();
        }
    })

    var btns = getMovieButtons();
    for (var i = 0; i < btns.length; i++) {
        var btn = btns[i];
        btn.setAttribute('index', i);
        btn.onclick = function(e) {
            unselectAllMovieBtn();
            this.setAttribute('aria-pressed', true);
            this.className += ' activate active'
            setPage(1);
        }
    }

});


function unselectAllMovieBtn() {
    var btnMovies = getMovieButtons();
    for (var i = 0; i < btnMovies.length; i++) {
        var btn = btnMovies[i];
        btn.setAttribute('aria-pressed', false);
        btn.className = btn.className.replace(' activate', '').replace('active', '');
    }
}