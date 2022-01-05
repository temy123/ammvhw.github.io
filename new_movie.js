var host = 'http://ipleOffice.iptime.org:5005/';
// var host = "https://t6.tvmeka.com/bbs/board.php?bo_table=";

const movie_type = ["kmovie", "engmovie", "animovie", "oldmovie", "19movie"];


function clearMovies() {
    $('#parent').empty();
}

function getKeyword() {
    return $('#keyword').val();
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

    clearMovies();

    $.get(url, '',
        function(movieData, textStatus, jqXHR) {
            for (var i = 0; i < movieData.length; i++) {
                var movieInfo = movieData[i];
                addList(movieInfo);
            }

            history.replaceState({
                'movieData': movieData,
                'movieType': getMovieType(),
                'keyword': getKeyword(),
                'page': getPage()
            }, '', './movie.html##');
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
    var url = 'http://ipleOffice.iptime.org:5005/movie/detail?type=' + type + ' &num=' + data['detail_num']

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

function setKeyword(text) {
    $('#keyword').val(text);
}

function setKeyword(keyword) {
    $('#keyword').val(keyword);
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
    var thumb = d['img_link'];
    var html = '';

    console.log(thumb);
    // html = '<a href="' + detail + '" class="items-body-content" >' + title + '</a><br />';

    // html += '<div class="tv_card_body">';
    html += '<a href="' + detail + '" class="items-body-content tv_card_body">';
    html += '<div class="card">';
    html += '<img class="card-img-top thumb" src="' + thumb + '">';
    html += '<div class="card-body">';
    html += '<h6 class="card-title">' + title + '</h6>';
    html += '</div></div></a>';

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

function rebind(state) {
    clearMovies();
    addMovies(state.movieData);

    unselectAllMovieBtn();
    var selectBtn = getMovieButtons()[state.movieType];
    selectBtn.setAttribute('aria-pressed', true);
    selectBtn.className += ' activate active';

    setKeyword(state.keyword);
    setPage(state.page);
}

window.onpopstate = function(e) {
    if (e.state) {
        rebind(e.state);
    }
}

function unselectAllMovieBtn() {
    var btnMovies = getMovieButtons();
    for (var i = 0; i < btnMovies.length; i++) {
        var btn = btnMovies[i];
        btn.setAttribute('aria-pressed', false);
        btn.className = btn.className.replace(' activate', '').replace('active', '');
    }
}

var loadingBar = null;


$(document).ready(function() {
    $("#keyword").keydown(function(key) {
        if (key.keyCode == 13) {
            search();
        }
    })
});

window.onload = function() {

    $(document).ajaxStart(function() {
            showProgress(); //ajax실행시 로딩바를 보여준다.
        })
        .ajaxStop(function() {
            hideProgress(); //ajax종료시 로딩바를 숨겨준다.
        });

    hideProgress();

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

}