var host = 'http://ipleOffice.iptime.org:4321/';
// var host = "https://t6.tvmeka.com/bbs/board.php?bo_table=";

const movie_type = ["kmovie", "engmovie", "animovie", "oldmovie", "19movie"];

function search() {
    var pageInput = document.getElementById('page');
    var selected = getMovieType();
    var url = host + 'movie?type=' + movie_type[selected];

    if (!pageInput.value) {
        pageInput.value = 1;
    }

    url = url + '&page=' + pageInput.value;

    $.get(url, '',
        function (data, textStatus, jqXHR) {
            addList(data);
        },
        "json"
    );

}

function setLog(text) {
    $('#keyword').val(text);
}

function addList(res) {
    var listGroup = $('#parent');
    listGroup.empty();

    for (var i = 0; i < res.length; i++) {
        var d = res[i];
        var title = d['title'];
        var detail = d['detail_link'];
        var detail_num = d['detail_num'];
        var html = '<a href="' + detail + '" class="items-body-content" >' + title + '</a><br />';
        listGroup.append(html);
    }

}


function next() {
    var pageDom = document.getElementById('page');
    pageDom.value = (pageDom.value * 1) + 1;
    search();
}

function prev() {
    var pageDom = document.getElementById('page');
    pageDom.value = (pageDom.value * 1) - 1;
    search();
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

window.onload = function () {

    var unselectAllMovieBtn = function () {
        var btnMovies = getMovieButtons();
        for (var i = 0; i < btnMovies.length; i++) {
            var btn = btnMovies[i];
            btn.setAttribute('aria-pressed', false);
            btn.className = btn.className.replace(' activate', '').replace('active', '');
        }
    };

    var btns = getMovieButtons();
    for (var i = 0; i < btns.length; i++) {
        var btn = btns[i];
        btn.setAttribute('index', i);
        btn.onclick = function (e) {
            unselectAllMovieBtn();
            this.setAttribute('aria-pressed', true);
            this.className += ' activate active'
        }
    }

    // var btnMovies = getMovieButtons();

    // for (var i = 0; i < btnMovies.length; i++) {
    //     const btn = btnMovies[i];
    //     btn.onclick = function (e) {
    //         setLog('test');
    //         unselectAllMovieBtn();
    //         btn.setAttribute('aria-pressed', true);
    //         btn.className += ' activate'

    //     }
    // }

}