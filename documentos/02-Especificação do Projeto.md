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

> **Links Úteis**:
<img width="1920" height="1486" alt="Group 1" src="https://github.com/user-attachments/assets/52fb9a4e-e172-4937-b84b-c58b77022353" />


## Requisito

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade | Responsável|
|------|-----------------------------------------|----|----|
|RF-001| O sistema deve permitir que os usuários se cadastrem. | ALTA | Brian Mucio Duarte |
|RF-002| O sistema deve separar os produtos por categoria.  | MÉDIA | Douglas Henrique de Sousa e Silva |
|RF-003| O sistema deve permitir que os usuários adicionem produtos ao carrinho de compras. | BAIXA | Luiza Maria da Silva Machado |
|RF-004| O sistema deve permitir que os usuários finalizem a compra clicando em um botão "Finalizar no WhatsApp". | ALTA | Mateus Salomé Rocha Silva |
|RF-005| O sistema deve realizar um cálculo do frete de envio da compra. | MÉDIA | Marcelly Giovanna De Souza e Maia |
|RF-006| O sistema deve trazer resultados para buscar personalizadas pelo nome ou categoria do produto. | MÉDIA | Erick Cambraia Nunes |
|RF-007| O sistema deve permitir que os administradores visualizem e gerenciem pedidos realizados pelos clientes. | MÉDIA | Brian Mucio Duarte |
|RF-008| O sistema deve permitir que os usuários removam produtos do carrinho ou alterem a quantidade. | BAIXA | Douglas Henrique de Sousa e Silva |
|RF-009| O sistema deve permitir que os usuários façam login com suas credenciais. | ALTA | Luiza Maria da Silva Machado |
|RF-010| O sistema deve exibir detalhes do produto, incluindo imagens, descrições e preços. | ALTA | Mateus Salomé Rocha Silva |
|RF-011| O sistema deve permitir que os administradores adicionem, editem e removam produtos do catálogo | MÉDIA | Marcelly Giovanna De Souza e Maia |
|RF-012| O sistema deve permitir que os administradores gerenciem categorias de produtos. | MÉDIA | Erick Cambraia Nunes |
|RF-013| O sistema deve permitir que os usuários realizem logout com segurança. | ALTA | Brian Mucio Duarte |
|RF-014| O sistema deve permitir que os usuários deixem avaliações e comentários sobre os produtos. | MÉDIA | Douglas Henrique de Sousa e Silva |


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade | Responsável|
|-------|-------------------------|----|---|
|RNF-001| O sistema deve ser responsivo para garantir uma boa experiência em dispositivos móveis. | ALTA |  Brian Mucio Duarte |
|RNF-002| O sistema deve ser compatível com os navegadores modernos e dispositivos Android/iOS. | MÉDIA | Douglas Henrique de Sousa e Silva |
|RNF-003| O sistema deve ser acessível, atendendo às normas de WCAG 2.1 para acessibilidade. | MÉDIA | Luiza Maria da Silva Machado |
|RNF-004| O sistema deve garantir a segurança dos dados do usuário com criptografia de ponta a ponta. | ALTA | Mateus Salomé Rocha Silva |
|RNF-005| A interface do usuário deve ser fácil de usar e navegar, permitindo que os clientes encontrem e adicionem produtos ao carrinho com facilidade. | ALTA | Marcelly Giovanna De Souza e Maia |
|RNF-006| O código do sistema deve ser bem documentado e modular, facilitando a manutenção e a adição de novas funcionalidades no futuro. | MÉDIA | Erick Cambraia Nunes |
 


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

<img width="4657" height="2810" alt="diagrama de caso de uso impressa" src="https://github.com/user-attachments/assets/ca2d1c79-e29e-41a6-8506-ceecacb0cfe5" />


> **Links Úteis**:
> - [Criando Casos de Uso](https://www.ibm.com/docs/pt-br/elm/6.0?topic=requirements-creating-use-cases)
> - [Como Criar Diagrama de Caso de Uso: Tutorial Passo a Passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)

## Modelo da Base de Dados

# Para banco de dados relacional:
<img width="1734" height="1248" alt="grafica 215" src="https://github.com/user-attachments/assets/03a31fef-ae39-40ad-b51b-a57af9e6803a" />

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




