// Librería para obtener información desde protocolo
var http = require("https");

// Librería que implementa el callback
var cheerio = require("cheerio");

// Enlace que se requiere iterar
var url = "https://www.cinepapaya.com/pe/cartelera";

// Variable que almacenas las películas en cartelera
var aURL = [];


// Función utilitaria que descarga un URL e invoca
// un callback con los datos.
function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

////// Implementación

//Almacenar los URLs de las películas

this.GetMovies=function() {
	download(url, function(data) {
	
		if (data) {
    			var $ = cheerio.load(data);
    			$('a.movie.lazy').map(function(i, link) {
				// Variable para almacenar la metadata JSON
				var metadata = {};
    				var href = $(link).attr('href');
    				var title = $(link).attr('title');
				metadata.titulo = title;
				metadata.url = href;
				aURL.push(metadata);
    			});
  		};

		if (aURL) {
    			console.log(aURL);
		};
	});
	return aURL;
}
