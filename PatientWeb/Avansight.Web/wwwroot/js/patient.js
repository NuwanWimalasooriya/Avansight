$('#submitPatients').click(function (e) {
    $('#error').css("display", "none");
    $('#errorPCount').css("display", "none");
    $('#success').css("display", "none");
    e.preventDefault();
    let SampleSize = $('#sampleSize').val();
    let maleWeight = $('#maleWeight').val();
    let femaleWeight = $('#femaleWeight').val();
    let AgeGroup2030 = $('#age2030').val();
    let AgeGroup3040 = $('#age3040').val();
    let AgeGroup4050 = $('#age4050').val();
    let AgeGroup5060 = $('#age5060').val();
    let AgeGroup6070 = $('#age6070').val();
    if (SampleSize < 10) {
        $("#errorPCount").css("display", "block");
    }
   else if (maleWeight > 0 && femaleWeight > 0 && AgeGroup2030 > 0 && AgeGroup3040 > 0 && AgeGroup4050 > 0 && AgeGroup5060 > 0 && AgeGroup6070 > 0) {
        $.post('/Patient/CreatePatients', {
            SampleSize: SampleSize, MaleWeight: maleWeight, FemaleWeight: femaleWeight,
            AgeGroup2030: AgeGroup2030,
            AgeGroup3040: AgeGroup3040,
            AgeGroup4050: AgeGroup4050,
            AgeGroup5060: AgeGroup5060,
            AgeGroup6070: AgeGroup6070
        }, function (response) {

            $("#patientpar").html(response.amount);
            $("#success").css("display", "block");
                loadPateintCharts();
        });
    } else {

        $("#error").css("display", "block");
    }
    

});

function loadPateintCharts() {
    $('#patientDiv').empty();
    $('#patientDivPie').empty();


    $.get("/Patient/GetPatients", function (data1) {

        const data2 = {
            rows: data1,
            columns: [
                {
                    type: DomoPhoenix.DATA_TYPE.STRING,
                    name: 'Order Priority',
                    mapping: DomoPhoenix.MAPPING.SERIES
                },
                {
                    type: DomoPhoenix.DATA_TYPE.STRING,
                    name: 'Customer Segment',
                    mapping: DomoPhoenix.MAPPING.ITEM
                },
                {
                    type: DomoPhoenix.DATA_TYPE.DOUBLE,
                    name: 'Sales',
                    mapping: DomoPhoenix.MAPPING.VALUE
                }
            ]
        };

        // Chart Options
        const options = {
            width: 600,
            height: 500
        };

        const chart = new DomoPhoenix.Chart(DomoPhoenix.CHART_TYPE.GROUPED_BAR, data2, options);

        document.getElementById('patientDiv').appendChild(chart.canvas);

        chart.render();

        const chartPie = new DomoPhoenix.Chart(DomoPhoenix.CHART_TYPE.DONUT, data2, options);
        document.getElementById('patientDivPie').appendChild(chartPie.canvas);

        chartPie.render();
    });

}
loadPateintCharts();