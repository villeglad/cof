var fs = require('fs');
var marked = require('marked');

var Chart = require('chart.js');

module.exports = function(context) {
    var html = fs.readFileSync('data/help.html');
    function render(selection) {
      var area = selection
          .html('')
          .html(html);

      var geojson = context.data.get('map').features[0].geometry.data;
      var data = {
        labels: [
            "Forest cover (Ha)",
            "Area not under forest cover (Ha)",
        ],
        datasets: [
          {
            data: [geojson.treeExtent, (geojson.areaHa - geojson.treeExtent).toFixed(2)],
            backgroundColor: [
              "#16A085",
              "#E68364",
            ],
            hoverBackgroundColor: [
              "#16A085",
              "#E68364",
            ]
          }
        ]
      };
      var ctxForestCover = document.getElementById("forest-cover");
      var forestCoverChart = new Chart(ctxForestCover, {
        type: 'pie',
        data: data,
        options: {
          elements: {
            arc: {
              borderColor: "#000000"
            }
          },
          position: 'bottom'
        }
      });

      data = {
        labels: [
            "Forest cover gain (Ha)",
            "Forest cover loss (Ha)",
        ],
        datasets: [
          {
            data: [geojson.gain, geojson.loss],
            backgroundColor: [
              "#16A085",
              "#DB5A6B",
            ],
            hoverBackgroundColor: [
              "#16A085",
              "#DB5A6B",
            ]
          }
        ]
      };

      var ctxForestCoverChange = document.getElementById("forest-cover-change");
      var forestCoverChartChange = new Chart(ctxForestCoverChange, {
        type: 'pie',
        data: data,
        options: {
          elements: {
            arc: {
              borderColor: "#000000"
            }
          }
        }
      });
      var ctxValuation = document.getElementById("valuation");
      ctxValuation.innerHTML = (((geojson.treeExtent / 3.14) * geojson.averageHeight * 3.14 * 0.28 * 0.28) * 43.06).toFixed(2);

      var ctxO2Valuation = document.getElementById("eco-oxy");
      ctxO2Valuation.innerHTML = ((geojson.treeExtent / 3.14) * 260).toFixed(2);

      var ctxCO2Valuation = document.getElementById("eco-cdioxy");
      ctxCO2Valuation.innerHTML = ((geojson.treeExtent / 3.14) * 50).toFixed(2);

      var ctxMiles = document.getElementById("miles");
      ctxMiles.innerHTML = (geojson.treeExtent * 2.47105 * 26000).toFixed(2);

      var ctxPeople = document.getElementById("people");
      ctxPeople.innerHTML = Math.floor(geojson.treeExtent * 2.47105 * 18);
    }

    render.off = function() {
    };

    return render;
};
