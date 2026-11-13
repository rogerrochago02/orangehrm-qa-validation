# BUGS — OrangeHRM

## 0 bugs

9 casos executados em 13/11/2026: 9 `passed`. Nada falhou duas vezes, então não há bug para registrar.
Dados da execução: [EXECUTION_LOG_2026-11-13.txt](EXECUTION_LOG_2026-11-13.txt)

## O que foi forçado

- Cadastro: sem nome, com matrícula repetida, busca por matrícula que existe e que não existe.
- Férias: direito de 5 dias, saldo, pedido de 2 dias, pedido sobreposto.

## Observações (não são bugs)

1. Pedido sobreposto é recusado com "Failed to Submit", sem dizer que o motivo é a sobreposição. Recusa certo; a mensagem é fraca.
2. A demo tem muitos funcionários repetidos e matrículas fora de padrão. É estado da demo.
3. A busca por nome só funciona depois de escolher a sugestão da lista. É o comportamento do campo.

## Dados criados na demo

Ver README.

Ambiente: Chromium headless (navegador sem janela visível), Windows 11, 13/11/2026.
