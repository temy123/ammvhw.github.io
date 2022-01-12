var nextPageToken = '';
var prevPageToken = '';

function search(type_ = '') {
    var keyword = $('#keyword').val();

    var url = "http://ipleOffice.iptime.org:5005/youtube?"

    if (keyword) {
        url += 'keyword=' + keyword;
    }

    if (type_ == 'next') {
        url += `&page=${nextPageToken}`
    } else if (type_ == 'prev') {
        url += `&page=${prevPageToken}`
    }

    clearVideos();

    $.ajax({
        type: "get",
        url: url,
        dataType: 'json',
        success: function(response) {
            addVideos_v2(response['list']);

            if (response['nextPageToken']) {
                nextPageToken = response['nextPageToken']
            }

            if (response['prevPageToken']) {
                prevPageToken = response['prevPageToken']
            }

            console.log(nextPageToken);
            console.log(prevPageToken);

            history.replaceState({
                'videos': response,
                'keyword': getKeyword(),
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

function isBlackList(channelTitle) {
    var BlackList = [
        '맛있는 녀석들 (Tasty Guys)',
        'YouTube Movies',
    ]
    console.log(`BlackList ? : ${channelTitle}`);
    return BlackList.includes(channelTitle);
}

function addVideos_v2(videoInfoes) {

    for (var i = 0; i < videoInfoes.length; i++) {
        var d = videoInfoes[i];

        if (isBlackList(d['channelTitle'])) continue;

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

function rebind(state) {
    clearMovies();
    addVideos(state.videos);

    setKeyword(state.keyword);
}

function getKeyword() {
    return $('#keyword').val();
}

function getRecommendVideos() {
    var url = 'http://ipleOffice.iptime.org:5005/youtube/recommend';

    var params = {
        'max_result': 30
    };

    clearVideos();

    $.get(url, params,
        function(data, textStatus, jqXHR) {
            addVideos_v2(data);
            console.log(data);
            history.replaceState({
                'videos': data,
                'keyword': getKeyword()
            }, '', './youtube.html##');
        },
        "json"
    );
}

window.onpopstate = function(e) {
    if (e.state) {
        rebind(e.state);
    }
}


$(document).ready(function() {
    bindProgress();

});

window.onload = function() {
    bindProgress();
}