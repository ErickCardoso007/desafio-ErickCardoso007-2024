export class RecintosZoo {
    constructor() {
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: { MACACO: 3 } },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: {} },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: { GAZELA: 1 } },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: {} },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: { LEAO: 1 } },
      ];
  
      this.animais = {
        LEAO: { tamanho: 3, bioma: 'savana', carnivoro: true },
        LEOPARDO: { tamanho: 2, bioma: 'savana', carnivoro: true },
        CROCODILO: { tamanho: 3, bioma: 'rio', carnivoro: true },
        MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
        GAZELA: { tamanho: 2, bioma: 'savana', carnivoro: false },
        HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
      };
    }
  
    validaEntrada(nomeAnimal, quantidade) {
      if (!this.animais[nomeAnimal]) return "Animal inválido";
      if (quantidade <= 0 || !Number.isInteger(quantidade)) return "Quantidade inválida";
      return null;
    }
  
    analisaRecintos(nomeAnimal, quantidade) {
      const erro = this.validaEntrada(nomeAnimal, quantidade);
      if (erro) return { erro };
  
      const infoAnimal = this.animais[nomeAnimal];
      const recintosViaveis = this.recintos
        .filter((recinto) => {
          return this.ehRecintoViavel(recinto, infoAnimal, quantidade, nomeAnimal);
        })
        .map((recinto) => {
          const espacoLivre = recinto.tamanhoTotal - this.calculaEspacoOcupado(recinto, infoAnimal, quantidade);
          return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
        });
  
      return recintosViaveis.length ? { recintosViaveis } : { erro: "Não há recinto viável" };
    }
  
    ehRecintoViavel(recinto, infoAnimal, quantidade, nomeAnimal) {
      if (!this.biomaCompatível(recinto.bioma, infoAnimal.bioma)) return false;
  
      const especiesRecinto = Object.keys(recinto.animais);
      for (const especie of especiesRecinto) {
        if (this.animais[especie].carnivoro && especie !== nomeAnimal) {
          return false;
        }
      }
  
  
      if (nomeAnimal === 'MACACO' && !especiesRecinto.length && quantidade < 2) return false;
      if (nomeAnimal === 'HIPOPOTAMO' && especiesRecinto.length && !this.biomaCompatível(recinto.bioma, 'savana e rio')) return false;
  
  
      const espacoNecessario = quantidade * infoAnimal.tamanho;
      const espacoOcupadoAtual = this.calculaEspacoOcupado(recinto, infoAnimal, quantidade);
      const espacoLivre = recinto.tamanhoTotal - espacoOcupadoAtual;
  
      return espacoLivre >= espacoNecessario;
    }
  
    biomaCompatível(biomaRecinto, biomaAnimal) {
      if (Array.isArray(biomaAnimal)) {
        return biomaAnimal.some((bioma) => biomaRecinto.includes(bioma));
      }
      return biomaRecinto.includes(biomaAnimal);
    }
  
    calculaEspacoOcupado(recinto, infoAnimal, quantidade) {
      let espacoOcupadoTotal = 0;
      const animaisExistentes = recinto.animais;
  
      for (const [nomeEspecie, quantidadeEspecie] of Object.entries(animaisExistentes)) {
        const infoEspecie = this.animais[nomeEspecie];
        if (infoEspecie) {
          espacoOcupadoTotal += quantidadeEspecie * infoEspecie.tamanho;
        }
      }
  
      espacoOcupadoTotal += quantidade * infoAnimal.tamanho;
      return espacoOcupadoTotal;
    }
  }