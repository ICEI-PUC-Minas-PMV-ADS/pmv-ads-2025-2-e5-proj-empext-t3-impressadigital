# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="01-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. 

## Usuários
| Tipo de Usuário   | Descrição | Responsabilidades |
|------------------|-----------|------------------|
| **xxx** | xxxxx | xxxxx |

### Exemplo

| Tipo de Usuário   | Descrição | Responsabilidades |
|------------------|-----------|------------------|
| **Administrador** | Gerencia a aplicação e os usuários. | Gerenciar usuários, configurar o sistema, acessar todos os relatórios. |
| **Funcionário** | Usa a aplicação para suas tarefas principais. | Criar e editar registros, visualizar relatórios. |


## Arquitetura e Tecnologias

Descreva brevemente a arquitetura definida para o projeto e as tecnologias a serem utilizadas. Sugere-se a criação de um diagrama de componentes da solução.

## Project Model Canvas

Deve ser desenvolvido a partir do microfundamento: Empreendedorismo e inovação.
Colocar a imagem do modelo construído apresentando a proposta de solução.

> **Links Úteis**:
> Disponíveis em material de apoio do projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

Para mais informações, consulte os microfundamentos Fundamentos de Engenharia de Software e Engenharia de Requisitos de Software. 

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir que o usuário cadastre tarefas | ALTA | 
|RF-002| Emitir um relatório de tarefas no mês   | MÉDIA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

## Diagrama de Caso de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

Para mais informações, consulte o microfundamento Engenharia de Requisitos de Software 

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Casos de Uso”.

> **Links Úteis**:
> - [Criando Casos de Uso](https://www.ibm.com/docs/pt-br/elm/6.0?topic=requirements-creating-use-cases)
> - [Como Criar Diagrama de Caso de Uso: Tutorial Passo a Passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)

## Modelo da Base de Dados

# Para banco de dados relacional:

## **Controle e segurança**

1. **cargos**

   * **Função:** Guarda os cargos do sistema (ex: Administrador, Atendente).
   * **Dependências:** Nenhuma. Outras tabelas usam o `id` dessa tabela para associar cargos a usuários (`usuarios_admin_cargos`).

2. **usuarios\_admin**

   * **Função:** Armazena os usuários administrativos que acessam o sistema.
   * **Dependências:** Nenhuma direta, mas pode enviar mídias (`midias.enviado_por_admin`).

3. **usuarios\_admin\_cargos**

   * **Função:** Relaciona usuários a cargos (muitos-para-muitos).
   * **Dependências:**

     * `usuario_admin_id` → `usuarios_admin(id)`
     * `cargo_id` → `cargos(id)`

---

## **Clientes e endereços**

4. **clientes**

   * **Função:** Armazena dados dos clientes da gráfica.
   * **Dependências:** Nenhuma. Outras tabelas dependem dela (`enderecos_clientes`, `vendas`, `carrinho`).

5. **enderecos\_clientes**

   * **Função:** Guarda endereços de entrega ou contato de clientes.
   * **Dependências:**

     * `cliente_id` → `clientes(id)`

---

## **Catálogo e portfólio**

6. **categorias**

   * **Função:** Organiza produtos em categorias (ex: Cartões, Banners).
   * **Dependências:**

     * `pai_id` → `categorias(id)` (para subcategorias)

7. **midias**

   * **Função:** Armazena arquivos de mídia (imagens, PDFs, etc) usados em produtos ou portfólio.
   * **Dependências:**

     * `enviado_por_admin` → `usuarios_admin(id)`

8. **produtos**

   * **Função:** Guarda os produtos que podem ser vendidos (ex: Cartão de Visita).
   * **Dependências:**

     * `midia_principal_id` → `midias(id)`

9. **produtos\_categorias**

   * **Função:** Relaciona produtos a categorias (muitos-para-muitos).
   * **Dependências:**

     * `produto_id` → `produtos(id)`
     * `categoria_id` → `categorias(id)`

10. **produtos\_midias**

    * **Função:** Relaciona produtos às mídias adicionais (muitos-para-muitos), indicando se é principal.
    * **Dependências:**

      * `produto_id` → `produtos(id)`
      * `midia_id` → `midias(id)`

11. **itens\_portfolio**

    * **Função:** Guarda exemplos de trabalhos já feitos (portfólio), podendo ter um produto associado.
    * **Dependências:**

      * `produto_id` → `produtos(id)`

12. **portfolio\_midias**

    * **Função:** Relaciona itens do portfólio às mídias (imagens, PDFs).
    * **Dependências:**

      * `item_portfolio_id` → `itens_portfolio(id)`
      * `midia_id` → `midias(id)`

---

## **Pedidos e carrinho**

13. **vendas**

    * **Função:** Registra as vendas feitas para os clientes.
    * **Dependências:**

      * `cliente_id` → `clientes(id)`

14. **itens\_venda**

    * **Função:** Detalha cada produto vendido em uma venda (quantidade, preço).
    * **Dependências:**

      * `venda_id` → `vendas(id)`
      * `produto_id` → `produtos(id)`

15. **carrinho**

    * **Função:** Guarda produtos que o cliente adicionou ao carrinho, antes da venda.
    * **Dependências:**

      * `cliente_id` → `clientes(id)`
      * `produto_id` → `produtos(id)`

---

### **Resumo de dependências principais**

* **Usuarios e cargos:** `usuarios_admin_cargos` depende de `usuarios_admin` e `cargos`.
* **Produtos e mídias:** `produtos_midias` depende de `produtos` e `midias`.
* **Portfólio:** `portfolio_midias` depende de `itens_portfolio` e `midias`.
* **Clientes e vendas:** `vendas` e `carrinho` dependem de `clientes`. `itens_venda` depende de `vendas` e `produtos`.
* **Categorias:** podem ter subcategorias via `pai_id`.




