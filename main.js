var host = 'http://ipleOffice.iptime.org:4444/';
// var host = "https://t6.tvmeka.com/bbs/board.php?bo_table=";


$(document).ready(function () {});

const movie_type = ["kmovie", "engmovie", "animovie", "oldmovie", "19movie"];

function search() {
    var pageInput = document.querySelector('[name="page"]');
    var selected = document.querySelector('[name="movie_type"]:checked').value;
    var url = host + 'movie?type=' + movie_type[selected];

    if (!pageInput.value) {
        pageInput.value = 1;
    }

    url = url + '&page=' + pageInput.value;
    axios({
            method: 'get',
            url: url,
            data: {}
        })
        .then(response => {
            addList(response.data);
        })
}

function addList(data) {
    var listGroup = $('#parent');
    listGroup.empty();

    data.forEach(element => {
        var title = element['title'];
        var detail = element['detail_link'];
        var detail_num = element['detail_num'];
        var html = '<a href="' + detail + '" class="items-body-content" >' + title + '</a>';
        listGroup.append(html);
    });

}