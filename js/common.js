function showProgress() {
    $('#progress').show();
}

function hideProgress() {
    $('#progress').hide();
}

function bindProgress() {
    $(document).ajaxStart(function() {
            showProgress(); //ajax실행시 로딩바를 보여준다.
        })
        .ajaxStop(function() {
            hideProgress(); //ajax종료시 로딩바를 숨겨준다.
        });

    hideProgress();
}