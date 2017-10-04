$(function () {


    $("#bi_pesq_inicio, #bi_pesq_fim").datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $("#bi_pesq_inicio").datepicker("setDate", "-200");
    $("#bi_pesq_fim").datepicker("setDate", "0");

    function buscaGraficos(){
        graficosLancamentos('previsao');
    };

    function buscaGrafLancamentos(data_inicio, data_fim) {
        $.ajax({
            url: '/bi/buscaGrafLancamentos',
            data: {
                inicio: data_inicio,
                fim: data_fim
            }
        }).done(function (result) {

            var datatable = [['Datas', 'Despesas', 'Receitas']];
            for (var data = 0 in result) {
                var temp = [data, result[data]['D'], result[data]['R']];
                datatable.push(temp);
            }

            var data = google.visualization.arrayToDataTable(datatable);

            var options = {width: 500, height: 350, colors: ['#db4437', '#4285f4'], chart: {subtitle:'Pela data de vencimento'} };

            var chart = new google.charts.Bar(document.getElementById('chart_lancamentos'));
            chart.draw(data, options);

            google.visualization.events.addListener(chart, 'select', lancamentosDetalhes);
            
            function lancamentosDetalhes(e) {
                var item = chart.getSelection()[0];
                if(item===undefined){return;}

                var date = data.getValue(item.row, 0);
                var tipo = item.column === 1 ? 'D' : 'R';


                $.ajax({
                    url: '/bi/buscaGrafLancamentosCategorias',
                    data: {data: date, tipo: tipo}
                }).done(function (result) {
                    
                    var datatable = [['Categorias', 'Valor']];
                    for (var categoria = 0 in result) { 
                        var temp = [categoria, result[categoria]];
                        datatable.push(temp);
                    }
                       
                    var data = google.visualization.arrayToDataTable(datatable);
                    var color=tipo==='D'?'#db4437':'#4285f4';
                    var options = {
                        width: 500,
                        height: 350,
                        colors: [color],
                        chart: {title: 'Lançamentos por categoria', subtitle:'Referente ao mês '+date}
                    };
                    var chart = new google.charts.Bar(document.getElementById('bi_modal_grafdet_grafico'));

                    chart.draw(data, options);
                });

                $('#bi_modal_grafdetalhamento').modal();
            }


        });
    }

    function buscaGrafFaturamentoReal(data_inicio, data_fim) {
        $.ajax({
            url: '/bi/buscaGrafFaturamentoreal',
            data: {
                inicio: data_inicio,
                fim: data_fim
            }
        }).done(function (result) {

            var datatable = [['Datas', 'Despesas', 'Receitas']];
            for (var data = 0 in result) {
                var temp = [data, result[data]['D'], result[data]['R']];
                datatable.push(temp);
            }

            var data = google.visualization.arrayToDataTable(datatable);

            var options = {width: 500, height: 350, colors: ['#db4437', '#4285f4'], chart: {subtitle:'Pela data de pagamento'} };


            var chart = new google.charts.Bar(document.getElementById('chart_lancamentos'));
            chart.draw(data, options);

            google.visualization.events.addListener(chart, 'select', faturamentoDetalhes);


            function faturamentoDetalhes() {
                var item = chart.getSelection()[0];
                if(item===undefined){return;}
                var date = data.getValue(item.row, 0);
                var tipo = item.column === 1 ? 'D' : 'R';

                $.ajax({
                    url: '/bi/buscaGrafFaturamentorealCategorias',
                    data: {data: date, tipo: tipo}
                }).done(function (result) {
                    
                    var datatable = [['Categorias', 'Valor']];
                    for (var categoria = 0 in result) { 
                        var temp = [categoria, result[categoria]];
                        datatable.push(temp);
                    }
                       
                    var data = google.visualization.arrayToDataTable(datatable);
                    var color=tipo==='D'?'#db4437':'#4285f4';
                    var options = {
                        width: 500,
                        height: 350,
                        colors: [color],
                        chart: {title: 'Lançamentos por categoria', subtitle:'Referente ao mês '+date}
                    };
                    var chart = new google.charts.Bar(document.getElementById('bi_modal_grafdet_grafico'));

                    chart.draw(data, options);
                });

                $('#bi_modal_grafdetalhamento').modal();
            }


        });
    }

    function graficosLancamentos(tipo) {
        var data_inicio = $('#bi_pesq_inicio').val().split('/').reverse().join('-');
        var data_fim = $('#bi_pesq_fim').val().split('/').reverse().join('-');
        
        if(tipo==='previsao'){
            buscaGrafLancamentos(data_inicio, data_fim);
        } else {
            buscaGrafFaturamentoReal(data_inicio, data_fim);
        }
    }

    $('#bi_carregar').click(function () {
        buscaGraficos();
    });

    $('input[name=bi_lanc_charttype]').change(function (){
        if($(this).val()==='previsao'){
            graficosLancamentos('previsao');
        } else {
            graficosLancamentos('fatreal');
        }
    });

    $('.btn-app[data-title=Bi]').click(function () {
        google.charts.load('current', {'packages': ['bar']});
        google.charts.setOnLoadCallback(buscaGraficos());
    });

});
