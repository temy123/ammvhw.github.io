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
    $('.youtube_container').empty();
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

        $('#list').append(html);
    }

}

function video(videoInfoes) {

    for (var i = 0; i < videoInfoes.length; i++) {
        var d = videoInfoes[i];

        var html = `
        <a href="${d['embed_link']}">

        <div class="youtube_card_container">
          <div class="thumbs">
            <img src="${d['thumb']}">
            <p id="length">
              ${d['duration']}
            </p>
          </div>
          <div class="desc">
            <div class="img_container">
              <div>
                <img src="#" />

              </div>
            </div>
            <div class="text_container">
              <div class="top">
                <p>${d['title']}</p>
              </div>
              <div class="bottom">
                <p id="author">${d['channelTitle']}</p>

                <div class="detail">

                  <p id="viewer" >조회수 ${d['viewCount']}회</p>
                  <p id="date" style="margin-left: 8px;" >${d['published']}</p>

                </div>
              </div>

            </div>
          </div>
        </div>
        </a>

        `;

        $('.youtube_container').append(html);
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

    clearVideos();

    $.get(url, params,
        function (data, textStatus, jqXHR) {
            video(data);
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
    bindProgress();
});