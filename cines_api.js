var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var movies  = require("./cinepapaya.js")
var Movies = movies.GetMovies();

app.get('/scrape', function(req, res){

	var json = { titulo : "", cine : "", local : "", tipo: "", horarios: "" };
	json.titulo = Movies[0].titulo;
	json.url = Movies[0].url;

	request(json.url, function(error, response, html){
		if(!error){
        		var $ = cheerio.load(html);

			// Primera ramificación de objetos de navegación
                        var data = $('div.all-movie-times');
			var subNode0 = data.children();
                        var nCount = $(subNode0).length;
			
			var subNode1 = data.children().children();

			for(var nCine = 0;  nCine < nCount; nCine++){
        			var locales = [];
        			var horarios = [];
				var localesTemp = [];
				var horariosTemp = [];
				
				// Recuperar arreglo de cines, locales y horarios
				var cine = $(subNode0).eq(nCine).text().split("\n");
				
				// Recuperar cines y locales
				for(var nTemp = 0; nTemp < cine.length; nTemp++){
					var strTemp = cine[nTemp].replace(" ","").trim();


					if(strTemp.includes("ocales") || strTemp == ""){
						continue;
					}else if(strTemp.includes(" am") || strTemp.includes(" pm") 
						|| strTemp.includes("2D") || strTemp.includes("3D")){
						horariosTemp.push(strTemp);
					}else localesTemp.push(strTemp);
				}
				var nLocales = localesTemp.length;
				
				// Recuperar ramal de cine
                                var strCine = cine[1].replace(" ","").trim();
				
				// Recuperar local
				var local = $(subNode1).eq(nCine).text().split("\n");
				for(var nLocal = 1; nLocal < local.length; nLocal++){	
					var strLocal = local[nLocal].replace(" ","").trim();
					if( !(strLocal == "") ) locales.push(strLocal);
				}
				
				for(var nLocal = 1; nLocal < nLocales; nLocal++){
                                	// Construir ramal de cine
					if( !(strCine == "") ) json.cine = localesTemp[0];

					// Construir ramal de local
					json.local = localesTemp[nLocal];
				
					// Construir ramal de horarios
					var strHorarios = horariosTemp.toString();
					var aHorarios = [];
					
					for(var nIndex = 0; nIndex < horariosTemp.length; nIndex++){
						if(horariosTemp[nIndex].includes("2D")){
							if(horariosTemp[nIndex].includes("Doblada")){
								json.tipo = "2D Doblada";
								aHorarios = strHorarios.split("2D Doblada,");	
							} else if(horariosTemp[nIndex].includes("Subtitulada")){
								json.tipo = "2D Subtitulada";
								var str = strHorarios.replace("XD ","");
								aHorarios = str.split("2D Subtitulada,");
							}
						} else if(horariosTemp[nIndex].includes("3D")){
							if(horariosTemp[nIndex].includes("Doblada")){
								json.tipo = "3D Doblada";
								aHorarios = strHorarios.split("3D Doblada,");	
							} else if(horariosTemp[nIndex].includes("Subtitulada")){
								json.tipo = "3D Subtitulada";
								aHorarios = str.split("3D Subtitulada,");
							}
						};
						json.horarios = aHorarios[nLocal];
					};	
					console.log(json);
				}
				
			};
					res.json(json);
		}
	});
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
