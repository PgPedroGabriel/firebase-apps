
var pessoaRef = firebase.database().ref('pessoa');


function criarPessoa(){
	var pessoa = {
		nome: 'Pedro Gabriel',
		idade: 10
	};


	//pessoaRef.child(pessoa.nome).set(pessoa).then( () => {} );
	pessoaRef.push(pessoa).then( snapshot  => console.log(snapshot.key) );
}

function lerPessoas(){

	pessoaRef.once('value').then(snapshot => {

		console.log(snapshot.val(), snapshot.key);

		snapshot.forEach( s => {
			console.log(s.val(), s.key);
		});
	});

}

function removerPessoa(id) {
	pessoaRef.child(id).remove();
	// pessoaRef.child(id).set(null);
}

function removerTodas() {

	pessoaRef.once('value').then(snapshot => {
		snapshot.forEach( s => {
			removerPessoa(s.key);
		});
	});
}

function updatePessoa(id, pessoa){
	
	// pessoaRef.child(id).set(pessoa).then( () => {} );
	pessoaRef.child(id).update(pessoa).then( () => {} );

}

function updatePessoaAtributo(id, prop, value){
	
	// pessoaRef.child(id + '/' + prop).set(value).then( () => {} );

	var obj = {};
	obj[prop] = value;
	// { prop: value}

	pessoaRef.child(id).update( obj ).then( () => {} );

}


function escutarPessoas(){


	/*
		
		Método recebe todos os dados de uma vezm similar ao ONCE
		porém fica ouvindo se há uma nova inserção
		preferivél usar o chil_added, o child added vai ser executado em todos os registros

	*/
	// pessoaRef.on('value', snapshot => {

		// console.log('ON VALUE');
		// console.log(snapshot.val(), snapshot.key);

		// snapshot.forEach( s => {
			// console.log(s.val(), s.key);
		// });
	// });

	pessoaRef.on('child_added', snapshot => {
		console.log('Chield added');

		console.log(snapshot.val(), snapshot.key);
	});



	/*

		Monitorar mudanças de um nó filho

	*/

	pessoaRef.on('child_changed', (snapshot, key) => {

		console.log('Chield changed');
		console.log(snapshot.val(), key);

	});


	/*
		
		Monitorar exclusões

	*/

	pessoaRef.on('child_removed', snapshot => {

		console.log('removed', snapshot.key);

	});
}


//So é possível utilizar apenas um método de ordenação por vez
function getOrdenados() {

	pessoaRef.orderByChild('idade').on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});

	pessoaRef.orderByKey().on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});


	//Orderna pelo valor de cada propriedade dentro do NO, não vale para nos que tenham como filho outros nós
	pessoaRef.child('-LmHPXCSWmPc0hS1DZK').orderByValue().on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});
}

//Filtros só podem ser executados após um orderByChild
function filtrar(){
	pessoaRef.orderByChild('idade').startAt(25).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});

	pessoaRef.orderByChild('idade').endAt(25).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});

	pessoaRef.orderByChild('idade').equalTo(1000).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});

}

function adicionarLimite(){
	
	//2 primeiros
	pessoaRef.orderByChild('idade').limitToFirst(2).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});

	//3 ultimos
	pessoaRef.orderByChild('idade').limitToLast(3).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});

	//Não precisa de filtros
	pessoaRef.limitToLast(3).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});

	//Exemplo de paginação
	pessoaRef.orderByChild('idade').startAt(0).limitToLast(20).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	});
}


function removerObservaveis() {
	pessoaRef.on('value', snapshot => {


		pessoaRef.off('value');
	})
}

function log(){
	firebase.database.enableLogging( message => console.log('[FIREBASE]', message));
}

log();


function capturandoErros() {
	pessoaRef.orderByChild('idade').startAt(0).limitToLast(20).on('child_added', snapshot => {
		console.log(snapshot.val(), snapshot.key);
	}, err => console.log(err) );
}

function realizandoChamadasHttp() {

	//GET
	fetch('https://fir-app-c1519.firebaseio.com/pessoa/-LmHPXCSWmPc0hS1DZKz.json')
	.then(res => res.json())
	.then(res => {
		console.log(res);
	});

	//POST
	fetch('https://fir-app-c1519.firebaseio.com/pessoa.json', {
		body: JSON.stringify({nome: 'PGZAO', idade: 13}),
		method: 'POST',
		mode: 'no-cors'
	})
	.then(res => res.json())
	.then(res => {
		console.log(res);
	})
	.catch(err => console.log(err));
}