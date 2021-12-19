var host = 'http://ipleOffice.iptime.org:4321/';
// var host = "https://t6.tvmeka.com/bbs/board.php?bo_table=";

const movie_type = ["kmovie", "engmovie", "animovie", "oldmovie", "19movie"];

function getKeyword() {
    return $('#keyword').val();
}

function search() {
    var pageInput = document.getElementById('page');
    var typeIndex = getMovieType();
    const movieType = movie_type[typeIndex];
    var url = host + 'movie?type=' + movieType;

    if (!pageInput.value) {
        pageInput.value = 1;
    }

    url = url + '&page=' + pageInput.value;
    url = url + '&upstream=true';

    if (getKeyword()) {
        url = url + '&keyword=' + getKeyword();
    }

    $('#parent').empty();

    $.get(url, '',
        function (movieData, textStatus, jqXHR) {
            history.replaceState({
                'movieData': movieData,
                'movieType': getMovieType(),
                'page': getPage()
            }, '', '/movie##');
        },
        "json"
    );

}

function addMovies(movieData) {
    for (var i = 0; i < movieData.length; i++) {
        var movieInfo = movieData[i];
        addList(movieInfo);
    }
}

function getDetailInfo(type, data, callback) {
    var url = 'http://ipleOffice.iptime.org:4321/movie/detail?type=' + type + ' &num=' + data['detail_num']

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: false,
        success: callback
    });
}

function setLog(text) {
    $('#keyword').val(text);
}

function setPage(pages) {
    $('#page').val(pages);
}

function getPage() {
    return $('#page').val();
}

function addList(d) {
    var listGroup = $('#parent');

    var title = d['title'];
    var detail = d['video_link'];
    var html = '<a href="' + detail + '" class="items-body-content" >' + title + '</a><br />';

    console.log(d);

    listGroup.append(html);

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

function showProgress() {
    $('#progress').show();
}

function hideProgress() {
    $('#progress').hide();
}

var loadingBar = null;
window.onload = function () {


    $(document).ajaxStart(function () {
            showProgress(); //ajax실행시 로딩바를 보여준다.
        })
        .ajaxStop(function () {
            hideProgress(); //ajax종료시 로딩바를 숨겨준다.
        });

    hideProgress();

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
            setPage(1);
        }
    }

}