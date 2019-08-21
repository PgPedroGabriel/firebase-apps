

//Pasta arquivos no cloud storage
var ref = firebase.storage().ref('arquivos');

document.getElementById('file-input').onchange = function(event){

	var arquivo = event.target.files[0];

	console.log(arquivo);

	ref.child('arquivo').put(arquivo).then( snapshot => {

		console.log('enviado');

	});

};