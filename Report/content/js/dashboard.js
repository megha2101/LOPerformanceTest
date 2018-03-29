/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 88.46153846153847, "KoPercent": 11.538461538461538};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23076923076923078, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Manage Project (Click)"], "isController": false}, {"data": [0.5, 500, 1500, "Review (Click)"], "isController": false}, {"data": [0.0, 500, 1500, "Uploading the Excel Template to Create Energy Meter"], "isController": false}, {"data": [0.0, 500, 1500, "Edit Team Member Role"], "isController": false}, {"data": [0.0, 500, 1500, "Registration Payment"], "isController": false}, {"data": [0.0, 500, 1500, "Input Waste Reading"], "isController": false}, {"data": [0.0, 500, 1500, "Team (Click)"], "isController": false}, {"data": [0.5, 500, 1500, "Install Dropbox"], "isController": false}, {"data": [0.0, 500, 1500, "Credit Action (Click)"], "isController": false}, {"data": [0.0, 500, 1500, "Input Water Reading"], "isController": false}, {"data": [1.0, 500, 1500, "Install One Drive"], "isController": false}, {"data": [0.0, 500, 1500, "Submit Review (Performance Score Verification)"], "isController": false}, {"data": [0.5, 500, 1500, "Create Water Meter"], "isController": false}, {"data": [0.0, 500, 1500, "Create Energy meter"], "isController": false}, {"data": [0.0, 500, 1500, "Add Team Member"], "isController": false}, {"data": [0.0, 500, 1500, "Install Apps (Click)"], "isController": false}, {"data": [0.5, 500, 1500, "Create Waste Meter"], "isController": false}, {"data": [0.0, 500, 1500, "Input Energy Reading"], "isController": false}, {"data": [0.0, 500, 1500, "Edit Occupancy"], "isController": false}, {"data": [1.0, 500, 1500, "Send Data Snapshot for Performance Score"], "isController": false}, {"data": [0.0, 500, 1500, "Creating the Log for Uploading the Create Energy Meter File"], "isController": false}, {"data": [1.0, 500, 1500, "Exporting the Data for Energy Meter"], "isController": false}, {"data": [0.0, 500, 1500, "Edit Opreating Hours"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": false}, {"data": [0.0, 500, 1500, "Project Registration"], "isController": false}, {"data": [1.0, 500, 1500, "Install Google Drive"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26, 3, 11.538461538461538, 2839.1153846153848, 277, 9927, 8721.2, 9748.5, 9927.0, 0.34306675287318406, 0.5542234115019726, 1.2012748311055985], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Manage Project (Click)", 1, 0, 0.0, 1828.0, 1828, 1828, 1828.0, 1828.0, 1828.0, 0.5470459518599562, 1.4034079253282274, 0.396394625273523], "isController": false}, {"data": ["Review (Click)", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 1.1750881316098707, 0.24557505875440658, 0.8813160987074031], "isController": false}, {"data": ["Uploading the Excel Template to Create Energy Meter", 1, 0, 0.0, 2013.0, 2013, 2013, 2013.0, 2013.0, 2013.0, 0.49677098857426727, 0.19211065573770492, 0.5705104321907601], "isController": false}, {"data": ["Edit Team Member Role", 1, 0, 0.0, 2370.0, 2370, 2370, 2370.0, 2370.0, 2370.0, 0.4219409282700422, 0.1009526635021097, 0.35230419303797467], "isController": false}, {"data": ["Registration Payment", 1, 1, 100.0, 9417.0, 9417, 9417, 9417.0, 9417.0, 9417.0, 0.10619093129446745, 0.05713984681958161, 0.2017005482106828], "isController": false}, {"data": ["Input Waste Reading", 1, 0, 0.0, 2270.0, 2270, 2270, 2270.0, 2270.0, 2270.0, 0.4405286343612335, 0.38374174008810574, 0.4074029460352423], "isController": false}, {"data": ["Team (Click)", 1, 0, 0.0, 2803.0, 2803, 2803, 2803.0, 2803.0, 2803.0, 0.35676061362825545, 0.37278696931858724, 0.2595572823760257], "isController": false}, {"data": ["Install Dropbox", 1, 0, 0.0, 1034.0, 1034, 1034, 1034.0, 1034.0, 1034.0, 0.9671179883945842, 0.3806138176982592, 0.7631165377176016], "isController": false}, {"data": ["Credit Action (Click)", 1, 0, 0.0, 2376.0, 2376, 2376, 2376.0, 2376.0, 2376.0, 0.42087542087542085, 5.368627683080808, 0.30990240951178455], "isController": false}, {"data": ["Input Water Reading", 1, 0, 0.0, 2085.0, 2085, 2085, 2085.0, 2085.0, 2085.0, 0.47961630695443647, 0.7540842326139089, 0.43277877697841727], "isController": false}, {"data": ["Install One Drive", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 3.6101083032490977, 1.4666064981949458, 2.8486010830324906], "isController": false}, {"data": ["Submit Review (Performance Score Verification)", 1, 0, 0.0, 2749.0, 2749, 2749, 2749.0, 2749.0, 2749.0, 0.3637686431429611, 0.19289684885412878, 2.2280829392506365], "isController": false}, {"data": ["Create Water Meter", 1, 0, 0.0, 1237.0, 1237, 1237, 1237.0, 1237.0, 1237.0, 0.8084074373484236, 0.543148746968472, 0.6868305375909458], "isController": false}, {"data": ["Create Energy meter", 1, 0, 0.0, 1614.0, 1614, 1614, 1614.0, 1614.0, 1614.0, 0.6195786864931846, 0.4078086276332094, 0.5276099752168525], "isController": false}, {"data": ["Add Team Member", 1, 0, 0.0, 2590.0, 2590, 2590, 2590.0, 2590.0, 2590.0, 0.3861003861003861, 0.08785291988416989, 0.3201164333976834], "isController": false}, {"data": ["Install Apps (Click)", 1, 0, 0.0, 1965.0, 1965, 1965, 1965.0, 1965.0, 1965.0, 0.5089058524173028, 0.23059796437659033, 0.36975190839694655], "isController": false}, {"data": ["Create Waste Meter", 1, 0, 0.0, 1013.0, 1013, 1013, 1013.0, 1013.0, 1013.0, 0.9871668311944718, 0.25546797877591315, 0.7471233341559724], "isController": false}, {"data": ["Input Energy Reading", 1, 1, 100.0, 9927.0, 9927, 9927, 9927.0, 9927.0, 9927.0, 0.10073536818777072, 0.1573006384103959, 0.09109467865417549], "isController": false}, {"data": ["Edit Occupancy", 1, 0, 0.0, 5753.0, 5753, 5753, 5753.0, 5753.0, 5753.0, 0.17382235355466713, 0.44609877455240743, 0.14123066226316705], "isController": false}, {"data": ["Send Data Snapshot for Performance Score", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 2.2271714922048997, 0.5589678452115813, 1.859601197104677], "isController": false}, {"data": ["Creating the Log for Uploading the Create Energy Meter File", 1, 0, 0.0, 1783.0, 1783, 1783, 1783.0, 1783.0, 1783.0, 0.5608524957936063, 0.5488029304542905, 0.43980913488502527], "isController": false}, {"data": ["Exporting the Data for Energy Meter", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 2.923976608187134, 19.56551535087719, 2.1815606725146197], "isController": false}, {"data": ["Edit Opreating Hours", 1, 0, 0.0, 2907.0, 2907, 2907, 2907.0, 2907.0, 2907.0, 0.3439972480220158, 0.8828366873065016, 0.28117743808049533], "isController": false}, {"data": ["Login Module", 1, 1, 100.0, 8423.0, 8423, 8423, 8423.0, 8423.0, 8423.0, 0.11872254541137363, 0.12359202481301199, 0.0553033732043215], "isController": false}, {"data": ["Project Registration", 1, 0, 0.0, 5408.0, 5408, 5408, 5408.0, 5408.0, 5408.0, 0.1849112426035503, 0.39979833117603547, 11.930747850406805], "isController": false}, {"data": ["Install Google Drive", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 3.003003003003003, 1.2082394894894894, 2.3695570570570568], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 8,423 milliseconds, but should not have lasted longer than 7,000 milliseconds.", 1, 33.333333333333336, 3.8461538461538463], "isController": false}, {"data": ["The operation lasted too long: It took 9,417 milliseconds, but should not have lasted longer than 7,000 milliseconds.", 1, 33.333333333333336, 3.8461538461538463], "isController": false}, {"data": ["The operation lasted too long: It took 9,927 milliseconds, but should not have lasted longer than 7,000 milliseconds.", 1, 33.333333333333336, 3.8461538461538463], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26, 3, "The operation lasted too long: It took 8,423 milliseconds, but should not have lasted longer than 7,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration Payment", 1, 1, "The operation lasted too long: It took 9,417 milliseconds, but should not have lasted longer than 7,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Input Energy Reading", 1, 1, "The operation lasted too long: It took 9,927 milliseconds, but should not have lasted longer than 7,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login Module", 1, 1, "The operation lasted too long: It took 8,423 milliseconds, but should not have lasted longer than 7,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
