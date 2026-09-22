// a palavra "classe" define que estamos criando um molde.
// A palavra "export" permite que esse arquivo seja usado
//  por outros arquivos (como o app.ts)
export class Player {
    public name: string; // O nome do jogador em (texto)
    public health: number; // A saúde do jogador (número)
    public level: number; // O nível do jogador (número)

    // Contrutores (O contutor é um metodo especial e executado
    //  automaticamente quando a classe é instanciada apenas uma unica vez)
    constructor(name: string, health: number = 100, level: number = 1) {
        // A palavra "this" faz referência a própria classe, ou seja:
        // "pegue o atributo 'name' da classe Player e atribua o valor
        //  do parametro 'name' a ele"
        this.name = name; 
        this.health = health; 
        this.level = level; 
    }   

    // Métodos (comportamento da classe)
    // Métodos são as funções que a classe pode executar, ou seja, são os
    //  comportamentos da classe.
    //O Método "attack" é um método que retorna uma string.
    public attack(): string {
        const damage: number = this.level * 10; // Calcula o dano com base no nível do jogador
        return `${this.name} atacou e causou ${damage} de dano!`; 

}

// O método de takeDamage é um método que recebe um parâmetro de dano (damage) e não retorna nada (void).
// não retorna nada (void).
    public takeDamage(damage: number): string {
        this.health -= damage; // Reduz a saúde do jogador com base no dano recebido
        if (this.health < 0) {
            this.health = 0; // Garante que a saúde não fique negativa
            return `${this.name} foi derrotado!`; // Retorna uma mensagem indicando que o jogador foi derrotado
        }
        
    
    return `${this.name} recebeu ${damage} de dano e agora tem ${this.health} de saúde.`;
    }

}