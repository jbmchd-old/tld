$(function () {

    bkp_sendofeito = 0;
    
    function fazerBackup(){
        bkp_sendofeito = 1;
        $.ajax({
            url: '/application/backup',
        }).done(function (result) {
            alert(result['msg']);
            bkp_sendofeito = 0;
        });
    }
   

    $('#backup').click(function (){
        if(!bkp_sendofeito){fazerBackup();}
    });
    
});
