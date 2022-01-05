function search() {

    var keyword = $('#keyword').val();
    var page = $('#page').val();

    var url = "http://ipleOffice.iptime.org:5005/youtube?"

    if (keyword) {
        url += 'keyword=' + keyword;
    }

    if (page) {
        url += '&page=' + page;
    } else {
        $('#page').val(1);
    }

    clearVideos();

    $.ajax({
        type: "get",
        url: url,
        dataType: 'json',
        success: function (response) {
            addVideos(response);
            history.replaceState({
                'videos': response,
                'keyword': getKeyword(),
                'page': getPage()
            }, '', './youtube.html##');
        },
    });
}

function clearVideos() {
    $('#list').empty();
}

function addVideos(videoInfoes) {
    for (var i = 0; i < videoInfoes.length; i++) {
        var d = videoInfoes[i];
        var html = '';

        html += '<a href="' + d['embed_link'] + '" class="items-body-content tv_card_body">';
        html += '<div class="card">';
        html += '<img class="card-img-top thumb" src="' + d['thumb'] + '">';
        html += '<div class="card-body">';
        html += '<h6 class="card-title">' + d['title'] + '</h6>';
        html += '</div></div></a>';


        // html += '<div>';
        // html += '<a href="' + d['embed_link'] + '" class="card-link">';
        // html += '<img class="card-img-top" src="' + d['thumb'] + '" alt="Card image cap">';
        // html += '<div class="card-body">';
        // html += '<h4 class="card-title">' + d['title'] + '</h4>';
        // html += '</div>';
        // html += '</a>';
        // html += '</div>';

        $('#list').append(html);
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
    selectBtn.className += ' activate active'

    setPage(state.page);
}

function rebind(state) {
    clearMovies();
    addVideos(state.videos);

    setKeyword(state.keyword);
    setPage(state.page);
}

function getRecommendVideos() {
    var url = 'http://ipleOffice.iptime.org:5005/youtube/recommend';

    var params = {
        'max_result': 30
    };

    $.get(url, params,
        function (data, textStatus, jqXHR) {
            addVideos(data);
            history.replaceState({
                'videos': data,
                'keyword': getKeyword(),
                'page': getPage()
            }, '', './youtube.html##');
        },
        "json"
    );
}

window.onpopstate = function (e) {
    if (e.state) {
        rebind(e.state);
    }
}

$(document).ready(function () {

    $(document).ajaxStart(function () {
            showProgress(); //ajax실행시 로딩바를 보여준다.
        })
        .ajaxStop(function () {
            hideProgress(); //ajax종료시 로딩바를 숨겨준다.
        });


    hideProgress();
});