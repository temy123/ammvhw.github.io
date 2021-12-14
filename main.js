var host = "https://t6.tvmeka.com/bbs/board.php?bo_table=";

$(document).ready(function () {
    $.get("https://t6.tvmeka.com/",
        function (data, textStatus, jqXHR) {
            console.log(data);
        }
    );
});

const movie_type = ["kmovie", "engmovie", "animovie", "oldmovie", "19movie"];

function search() {
    var selected = document.querySelector('[name="movie_type"]:checked').value;
    var url = host + movie_type[selected];

    var pageInput = document.querySelector('[name="page"]');
    pageInput.value = url;

    var headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        'origin': 't6.tvmeka.com',
        'referer': 'https://t6.tvmeka.com/bbs/board.php?bo_table=oldmovie',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Max-Age': '3600',
    };

    var optionAxios = {
        headers: headers
    }

    // $.get(url, (data) => {
    //     if (data) {
    //         console.log(dadta);
    //     }
    // });
    console.log('테스트 시작 ');

    const axiosInstance = axios.create({
        headers: headers
    });


    axiosInstance.get(url)
        .then((response) => {
            console.log(response);
        });

    // var http = new XMLHttpRequest()
    // http.open("get", url, true)

    // http.setRequestHeader('origin', 't6.tvmeka.com');
    // http.setRequestHeader('referer', 't6.tvmeka.com');
    // http.setRequestHeader('Access-Control-Allow-Origin', 't6.tvmeka.com');
    // http.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // http.setRequestHeader('Access-Control-Max-Age', '3600');
    // http.setRequestHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');

    // http.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    // http.send();
    // console.log(http.responseText);

    // $.ajax({
    //     url: url,
    //     type: "get",
    //     beforeSend: (xhr) => {
    //         xhr.setRequestHeader('origin', 't6.tvmeka.com');
    //         xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    //         xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    //         xhr.setRequestHeader('Access-Control-Max-Age', '3600');
    //         xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');

    //         // 'Access-Control-Allow-Origin': '*',
    //         // '': ,
    //         // 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'

    //     },
    //     success: function (result) {
    //         if (result) {
    //             console.log(result.body);
    //         }
    //     }
    // })
}
// axios.get(url, optionAxios)
//   .then(Response => {
//     console.log(response.body);
//   });

// axios({
//     method: 'get',
//     url: url,
//     header: ,
//     data: {}
//   })
//   .then(response => {
//     console.log(response.body);
//   })