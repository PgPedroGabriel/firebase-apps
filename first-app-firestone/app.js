
var pessoaCollection = firebase.firestore().collection('pessoa');


function criarPessoa(){
	var pessoa = {
		nome: 'Pedro Gabriel',
		idade: 10
	};

	/*
	pessoaCollection.doc('1').set(pessoa).then( () => {
		console.log('criado com sucesso');
	});
	*/

	pessoaCollection.add(pessoa).then( () => {
		console.log('criado com sucesso');
	});
}

function lerPessoas(){

	pessoaCollection.get().then( snapshot => {

		let docs = snapshot.docs;

		//snapshot.docs          retorna todos os documentos
		//snapshot.empty         retorna se snapshot está vaziu
		//snapshot.metadata      retirba netadados da coleção
		//snapshot.query         retorna a query utilizada no filtro
		//snapshot.size          retorna o numero de documentos na collection
		//snapshot.docChanges    retorna oum array com as mudanças que essa coleção sofreu desde a ultima leitura


		docs.forEach( doc => {
			
			console.log(doc.data());
		
			// doc.data()
			// doc.id
			// doc.isEqual()

		});
	});
}

function removerCampoDeUmObjeto(id, campo){

	pessoaCollection.doc(id).update({idade : firebase.firestore.FieldValue.delete()}).then( () => {
		console.log('Cmapo do objeto removido');
	});
}

function removerPessoa(id) {

	pessoaCollection.doc(id).delete().then( () => {
		console.log('Objeto removido');
	});
}

function updatePessoa(id, pessoa){
	//Retornará um erro se não encontrar o ID
	pessoaCollection.doc(id).update(pessoa).then( () => {

		console.log('updated');

	});
}

function escutarPessoas(){


	pessoaCollection.onSnapshot( snapshot => {

			//tras todos os dados utlizando o type add na primeira chamada
		snapshot.docChanges().forEach( pessoa => {
			if(pessoa.type == 'added'){
				console.log(pessoa.doc.id, 'added');
				console.log(pessoa.doc.data());
			}

			if(pessoa.type == 'modified'){
				console.log(pessoa.doc.id, 'modified');
			}

			if(pessoa.type == 'removed'){
				console.log(pessoa.doc.id, 'removed');
			}

		});

	});

}


//So é possível utilizar apenas um método de ordenação por vez
function getOrdenados() {
	
	pessoaCollection.orderBy('idade', 'desc').get().then(snapshot => {

		snapshot.docs.forEach( doc => {
			console.log(doc.data());
		})

	});

	// se for usar where em conjunto com orderby, não pode usar o where em um campo diferente do que quer ordenar
	
}

function filtrar(){

	// não é possível utilizar || e !=

	pessoaCollection.where('idade', '>', 9).get().then(snapshot => {

		snapshot.docs.forEach( doc => {
			console.log(doc.data());
		})

	});

	pessoaCollection.where('idade', '>', 9).where('idade', '<', 50).get().then(snapshot => {

		snapshot.docs.forEach( doc => {
			console.log(doc.data());
		})

	});
}

function adicionarLimite(){
	
	//3 primeiros
	pessoaCollection.limit(3).get().then(snapshot => {

		snapshot.docs.forEach( doc => {
			console.log(doc.data());
		})

	});


	// Cursores para filtrar (paginação)
	// .startAt, começa neste valor, igual >=
	// .startAfter, igual >
	// .endBefore, igual <
	// .endAt, igual <=
	// Só consigo utilizar cursores com ordenação

	//ex: pessoas com idade acima de 25 anos até 40
	pessoaCollection.orderBy('idade').startAfter(25).endAt(40).get().then(snapshot => {

		snapshot.docs.forEach( doc => {
			console.log(doc.data());
		})

	});

	// Consigo também utilizar objetos nestas funções
	// Ou seja, vou pegar do terceiro registro pra frente neste exemplo
	pessoaCollection.limit(3).get().then(snapshot => {

		pessoaCollection.orderBy('idade').startAt(snapshot.docs[2]).get().then(snapshot => {

			snapshot.docs.forEach( doc => {
				console.log(doc.data());
			})

		});
	});	
}


//Utilizado para gravar registros em massa
// se um falhar, não irá inerir nada.
function gravarEmLotes (){


	//Podemos gravar em lotes, 500 por vez

	var batch = firebase.firestore().batch();

	var nomes = ['Pedro', 'Gabriel', 'Rabelo' , 'Barboza', 'Kellyane', 'Alves', 'Fernandes', 'Eduarda'];

	for(var i = 0; i < 100 ; i++){


		var pessoa = {
			nome: nomes[Math.floor(Math.random() * (nomes.length - 1))],
			idade: Math.floor(Math.random() * 22 + 18)
		};

		var ref = pessoaCollection.doc(String(i));

		batch.set(ref, pessoa);
	};

	batch.commit().then( () => {
		console.log('Concluido');
	});


}


function log(){
	firebase.database.enableLogging( message => console.log('[FIREBASE]', message));
}

log();
