var documents;
var people;

$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

$(document).ready(function () {
    $(':file').on('fileselect', function (event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });
});

function downloadCsv() {
    if (documents === undefined || people === undefined) {
        alert('Carica tutti e due i file: Documenti e Intestatari');
        return;
    }

    var columnHeaders = ['fattura numero', 'data fattura', 'imponibile', 'spese anticipate', '% aliquota IVA', 'IVA', '% ritenuta acconto', 'importo ritenuta acconto', 'totale fattura', 'cognome/ragione sociale', 'nome', 'via residenza', 'n.civico residenza', 'città residenza', 'provincia residenza', 'CAP residenza', 'data di nascita', 'città luogo di nascita', 'provincia di nascita', 'codice fiscale', 'partita IVA'];

    var data = new Array();
    data.push(columnHeaders);

    let columns = splitFileAndRetrieveColumnArray(documents, people);
    data = data.concat(columns);

    var lineArray = [];
    data.forEach(function (infoArray, index) {
        var line = infoArray.join(';');
        lineArray.push(index == 0 ? 'data:text/csv;charset=utf-8,' + line : line);
    });
    var csvContent = lineArray.join('\n');

    var encoded = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'Fatture_' + getCurrentDate() + '.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named 'my_data.csv'
}

function handleDocuments(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        documents = event.target.result;
    };

    reader.readAsText(file);
}

function handlePeople(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        people = event.target.result;
    };

    reader.readAsText(file);
}

function splitFileAndRetrieveColumnArray(docArray, peopleArray) {
    let documents = splitArrayInColumns(docArray);
    let people = splitArrayInColumns(peopleArray);

    let mergedDocsPeople = [];
    documents.forEach(function (document) {
        //Check if we have person for the current document
        var matchingPerson = _.find(people, function (person) {
            return person[1] === document[2];
        });

        if (matchingPerson !== 'undefined') {
            mergedDocsPeople.push(document.concat(matchingPerson));
        }
    });

    //split result in correct columns for csv
    let columns = [];
    mergedDocsPeople.forEach(function (r) {
        currentColumn = [];
        currentColumn.push(r[2]);
        currentColumn.push(r[3]);
        currentColumn.push(r[8]);
        currentColumn.push(r[9]);
        currentColumn.push(r[10]);
        currentColumn.push(r[11]);
        currentColumn.push(r[12]);
        currentColumn.push(r[13]);
        currentColumn.push(r[16]);
        currentColumn.push(r[21]);
        currentColumn.push(r[22]);
        currentColumn.push(r[23]);
        currentColumn.push(r[24]);
        currentColumn.push(r[25]);
        currentColumn.push(r[26]);
        currentColumn.push(r[27]);
        currentColumn.push(r[33]);
        currentColumn.push(r[34]);
        currentColumn.push(r[35]);
        currentColumn.push(r[37]);
        currentColumn.push(r[38]);

        columns.push(currentColumn);
    });

    return columns;
}

function splitArrayInColumns(array) {
    let lines = array.split('\r\n');

    let linesArray = [];
    lines.forEach(function (line) {
        linesArray.push(line.split('|'));
    });

    let onlyFTArray = [];
    linesArray.forEach(function (lineArray) {
        if (lineArray[0] === 'FT') {
            onlyFTArray.push(lineArray);
        }
    });

    return onlyFTArray;
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return dd + '/' + mm + '/' + yyyy;
}

document.getElementById('docs').addEventListener('change', handleDocuments, false);
document.getElementById('people').addEventListener('change', handlePeople, false);