var express = require('express');
var request = require("request");
app = express();
app.set("view engine", "ejs");
port = process.env.PORT || 3000;

app.get("/", function(req, res) {
    res.render("search");
})

app.get("/results", function(req, res){
    let query = req.query.search.toUpperCase();
    let url = "https://entreprise.data.gouv.fr/api/sirene/v1/full_text/" + query + '?page=1&per_page=100';
    request(url, (error, response, body) => {
        if(!error && response.statusCode === 200){
            let data = JSON.parse(body);
            let data_company = {};
            let len = data['etablissement'].length
            let i = 0;
            while (i < len) {
            	company_name = data['etablissement'][i]['l1_normalisee']
            	if (company_name === query || company_name.includes(query)) {
            		company = data['etablissement'][i];
            		data_company['name'] = company['l1_normalisee'];
            		data_company['siren'] = company['siren'];
            		data_company['code_postal'] = company['code_postal'];
            		data_company['libelle_commune'] = company['libelle_commune'];
            		break;
            	}
                i++;
            }
            res.render("results", {data: JSON.stringify(data_company)});
        }

    });
});

app.listen(port);

console.log('scrapeTool API server started on: ' + port);