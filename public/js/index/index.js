$(function () {

    bkp_sendofeito = 0;

    function fazerBackup() {
        bkp_sendofeito = 1;
        $.ajax({
            url: '/application/backup',
        }).done(function (result) {
            alert(result['msg']);
            bkp_sendofeito = 0;
        });
    }

    $('#backup').click(function () {
        if (!bkp_sendofeito) {
            fazerBackup();
        }
    });

    //============= SENHA ============

    $('#index_senha_form').submit(function () {

        if (!$(this).form_podeenviar()) {
            return false
        }
        ;

        var credential = $('#index_senha_atual').val();
        var new_credential = $('#index_password').val();
        var new_credential_verify = $('#index_password_confirm').val();

        if (new_credential !== new_credential_verify) {
            $('#index_senha_alertas').showMessageTarge({type: 'warning', message: 'As novas senhas não conferem'});
            return false;
        }

        if (credential === new_credential) {
            $('#index_senha_alertas').showMessageTarge({type: 'warning', message: 'A nova senha deve ser diferente da atual'});
            return false;
        }

        $.ajax({
            url: '/user/change-password-json',
            data: {
                credential: credential,
                newCredential: new_credential,
            }
        }).done(function (result) {

            if (!result.result) {
                $('#index_senha_alertas').showMessageTarge({type: 'danger', message: 'Ocorreu algum problema, verifique!'})
                return false;
            }

            $('#index_senha_alertas').showMessageTarge({type: 'success', message: 'Senha alterada'})

        });
        return false;
    });

});
