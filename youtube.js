function search() {
    $('#keyword').val('시도 ');
    $.ajax({
        type: "get",
        url: "https://www.youtube.com/?&ab_channel=tvNDENT",
        dataType: null,
        success: function (response) {
            $('#keyword').val('성공');
        },
        failed: function (response){
            $('#keyword').val('실패');

        },
        error: function (response) {
            $('#keyword').val('에러');
        }
    });
}