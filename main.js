var host = 'http://ipleOffice.iptime.org:4444/';
// var host = "https://t6.tvmeka.com/bbs/board.php?bo_table=";

const movie_type = ["kmovie", "engmovie", "animovie", "oldmovie", "19movie"];

function search() {
    var pageInput = document.querySelector('[name="page"]');
    var selected = getMovieType();
    var url = host + 'movie?type=' + movie_type[selected];

    if (!pageInput.value) {
        pageInput.value = 1;
    }

    document.getElementById('keyword').value = '검색 된다고 시발련아';

    $('keyword').val('검색 된다 시발련아');

    url = url + '&page=' + pageInput.value;
    axios({
            method: 'get',
            url: url,
            data: {}
        })
        .then(response => {
            document.getElementById('page').value = '검색 된다고 시발련아';
            addList(response.data);
        })
}


function next() {
    var pageDom = document.getElementById('page');
    pageDom.value = (pageDom.value * 1) + 1;
    // var pageDom = $('#page');
    // pageDom.val((pageDom.val() * 1) + 1);
    search();
}

function prev() {
    var pageDom = document.getElementById('page');
    pageDom.value = (pageDom.value * 1) - 1;
    search();
}

function getMovieButtons() {
    return document.getElementsByName('movie_type');
    // return $('[name=movie_type]');
}

function getMovieType() {
    var btnMovies = getMovieButtons();
    for (let i = 0; i < btnMovies.length; i++) {
        const btn = btnMovies[i];
        var pressed = btn.getAttribute('aria-pressed');

        if (pressed == 'true') {
            return i;
        };
    }
    return 0;
}

function addList(data) {
    var listGroup = document.getElementById('parent');
    // var listGroup = $('#parent');
    listGroup.innerHTML = "";

    data.forEach(element => {
        var title = element['title'];
        var detail = element['detail_link'];
        var detail_num = element['detail_num'];
        var html = '<a href="' + detail + '" class="items-body-content" >' + title + '</a>';
        listGroup.innerHTML += (html);
    });

}

window.onload = () => {
    var unselectAllMovieBtn = () => {
        var btnMovies = getMovieButtons();
        for (let i = 0; i < btnMovies.length; i++) {
            const btn = btnMovies[i];
            btn.setAttribute('aria-pressed', false);
            btn.className = btn.className.replace('activate', '').replace('active', '');
        }
    };

    var btnMovies = getMovieButtons();

    for (let i = 0; i < btnMovies.length; i++) {
        const btn = btnMovies[i];
        btn.onclick = (e) => {
            unselectAllMovieBtn();
            btn.setAttribute('aria-pressed', true);
            btn.className += ' activate'

        }
    }

}