var host = "https://t6.tvmeka.com/bbs/board.php?bo_table=";

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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
    };

    var optionAxios = {
        headers: headers
    }

    // $.get(url, (data) => {
    //     if (data) {
    //         console.log(dadta);
    //     }
    // });

    $.ajax({
        url: url,
        type: "get",
        beforeSend: (xhr) => {
            xhr.setRequestHeader('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36');
            xhr.setRequestHeader('origin', 't6.tvmeka.com');
            xhr.setRequestHeader('referer', 'https://t6.tvmeka.com/bbs/board.php?bo_table=oldmovie');

            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            // 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'

        },
        success: function (result) {
            if (result) {
                console.log(result.body);
            }
        }
    })
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