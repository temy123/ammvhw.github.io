function search() {

    var keyword = $('#keyword').val();
    var page = $('#page').val();

    var url = "http://ipleOffice.iptime.org:4321/youtube?"

    if (keyword) {
        url += 'keyword=' + keyword;
    }

    if (page) {
        url += '&page=' + page;
    } else {
        $('#page').val(1);
    }

    $('#list').empty();

    $.ajax({
        type: "get",
        url: url,
        dataType: 'json',
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var d = response[i];
                var html = '';
                html += '<div>';
                html += '<a href="' + d['embed_link'] + '" class="card-link">';
                html += '<img class="card-img-top" src="' + d['thumb'] + '" alt="Card image cap">';
                html += '<div class="card-body">';
                html += '<h4 class="card-title">' + d['title'] + '</h4>';
                html += '</div>';
                html += '</a>';
                html += '</div>';

                $('#list').append(html);
            }
        },
    });
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