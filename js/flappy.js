function novoElemento(tagName, className) {
     //função para criar uma novo elemento, essa função servirá de auxilio para criação de elementos na pagina
     //recebe como parametro a tagName, o nome da classe
    const elem = document.createElement(tagName) //cria o elemento
    elem.className = className //adiciona uma classe ao elemento
    return elem //retona o elemento criado mais a sua classe
}

function Barreira(reversa = false) {
 /*Essa função sera como um construtor e será instanciada, ele cria as barreiras do game,
   de acordo com o game, são duas barreiras, aque fica em cima e a que fica em baixo,
   portanto tem como parametro um condição, se a barreira é reversa ou não, nesse
   caso passo o valor false incialmente*/   
    this.elemento = novoElemento('div', 'barreira') //aqui estamos passando o elemento

    const borda = novoElemento('div', 'borda') //aqui estamos criando a borda da barreira
    const corpo = novoElemento('div', 'corpo') //aqui estamos criando corpo da barreira
    //abaixo montamos e adicionamos a barreira na pagina
    this.elemento.appendChild(reversa ? corpo : borda) //para adicionar usamos o appendChild,
    //primeiro ele testa se a barreira é reversa, se ela esta abaixo, caso seja "cria" o corpo primeiro 
    this.elemento.appendChild(reversa ? borda : corpo) //se for reversa cria a borda depois o corpo

    this.setAltura = altura => corpo.style.height = `${altura}px` //aqui definimos o a altura da barreira
}

//testando
// const b = new Barreira(true) //instanciando o metodo
// b.setAltura(200) //passa a altura 
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function ParDeBarreiras(altura, abertura, x) {
//função para criar uma par de barreiras, segunda a regra do jogo
//as barreiras ficam em cima e abaixo e sua altura e abertura são difentes
//e aleatorias
//essa função tem como parametro a altura da barreira, a abertura da barreira entre
//uma barreira e outra, e a posição      
    this.elemento = novoElemento('div', 'par-de-barreiras') //cria uma div

    this.superior = new Barreira(true) //cria a barreira superior
    this.inferior = new Barreira(false) //cria a barreira inferior

    this.elemento.appendChild(this.superior.elemento) //insere na DOM
    this.elemento.appendChild(this.inferior.elemento) //insere na DOM

    this.sortearAbertura = () => {
        //função para sortear a abertura das barreiras
        //a abertura sera fixa, o que vai mudar é a altura das barreiras
        const alturaSuperior = Math.random() * (altura - abertura) //aqui estamos fazendo um calculo da altura superior
        //primeiro pega um valor aletorio atraves do Math.random com isso multiplica o valor da diferencia entre a altura e abertura 
        const alturaInferior = altura - abertura - alturaSuperior //calcula a altura inferior da barreira
        this.superior.setAltura(alturaSuperior) //passa a altura superior 
        this.inferior.setAltura(alturaInferior) //passa a altura inferior
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]) //função que pega a posição do elemento x
    this.setX = x => this.elemento.style.left = `${x}px` //seta a posição x
    this.getLargura = () => this.elemento.clientWidth //pega a largura

    this.sortearAbertura() //aqui chamamos a função criada
    this.setX(x)
}

//testando
//const b = new ParDeBarreiras(700, 300, 400)
//document.querySelector('[wm-flappy]').appendChild(b.elemento)
//observação, o this aqui no js indica que o elemento pode ser visto fora do metodo

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
 //metodo construtor para instanciar as barreiras
 //recebe como parametro: altura, largura, abertura entre as barreiras, o espaço entre as barreiras
 //e uma função para notificar os ponto, essa função sera disparado quando uma barreira foi cruzada o centro
 //e o ponto sera contabilizado

    //estamos criando um array de pare de barreiras
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura), //primeria barreira
        new ParDeBarreiras(altura, abertura, largura + espaco), //segunda barreira
        new ParDeBarreiras(altura, abertura, largura + espaco * 2), //terceira barreira
        new ParDeBarreiras(altura, abertura, largura + espaco * 3) //quarta barreira
    ]

    const deslocamento = 3 //constante de deslocamento, isto é de quanto em quanto sera deslocado em px
    this.animar = () => {
    //função responsavel por fazer a animação do cenário 
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando elemento sair da area do jogo
            if(par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length) //calcula e passa a barreira para o final do jogo
                par.sortearAbertura() //sorte uma nova abertura utilizando as mesmas barreiras
            }

            const meio = largura / 2 //costante, que armazena quando for cruzou o meio
            const cruzouOMeio = par.getX() + deslocamento >= meio 
                && par.getX() < meio //constante que identifica quando cruzou o meio, aqui ele valida pelo if 
                //se cruzou o meio chama o metodo de notificar ponto
        })
    }
}

//testando
const barreiras = new Barreiras(700, 1200, 200, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval( () =>{
  barreiras.animar()
},20)