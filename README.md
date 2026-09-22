# Funcionalidades adicionadas

Durante o desenvolvimento do projeto, foram adicionadas duas novas funcionalidades:

## Cura do jogador

Foi adicionada uma rota para recuperar a saúde do jogador.

Rota:

POST /player/take-health

A quantidade de saúde recuperada é enviada pelo corpo da requisição.

Exemplo:

{
  "health": 50
}

A função adiciona os 50 pontos à saúde atual do jogador e salva o novo estado no arquivo JSON.

## Aumento de nível

Também foi adicionada uma função para aumentar o nível do jogador.

Rota:

POST /player/level-up

Essa rota aumenta o nível do jogador em 1 a cada requisição.

Por exemplo:

Nível 1 → Nível 2 → Nível 3 → Nível 4

O novo nível também é salvo no arquivo JSON.