<div align="center">
   <img src="/stockly/frontend/Stockly/assets/images/stockly-icon.png" width="20%">

# Stockly

#### [EN-US](#english-version) | [PT-BR](#versão-em-português)

[![Download APK](https://img.shields.io/badge/Download-APK-blue)](https://expo.dev/accounts/sophialns/projects/stockly/builds/f71e58b3-3242-4420-b5a4-c7483561ef6a)

</div>
<br>

## English Version

This is Stockly, an inventory and order management application designed to help small businesses manage their products, orders, and clients more efficiently and practically.  
<br>This app was developed as the Final Project for **Harvard University's [CS50: Introduction to Computer Science course](https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science)**.

#### Video Demo: [Watch the video on YouTube](https://youtu.be/yPRaan05zEI) featuring app screenshots, created as part of the final project requirements.

## Features

Stockly includes the following key features:

### Main Screens

1. **Dashboard**:

   - Get an overview of your business metrics, including:
     - Total products registered
     - Total stock available
     - Number of pending orders
     - Total registered clients
     - Interactive chart displaying revenue from each month of the year, with total revenue data of completed orders for each month.

2. **Products**:

   - Manage your product inventory:
     - Add new products
     - Edit existing product details
     - Delete products from the inventory

3. **Clients**:

   - Maintain client information:
     - Add new clients
     - Edit client details
     - Delete client records

4. **Orders**:
   
   - Track and manage orders efficiently:
     - Change order status
     - Add new orders
     - Edit order details
     - Delete orders
     - Print specific order data or save it to a PDF file

### Profile Management

- Manage your account settings:
  - Edit your profile information
  - Logout of the application
  - Delete your account if needed

## Technologies Used

- **Frontend**: React Native  
- **Backend**: Flask  
- **Database**: SQLite  
- **ORM**: Flask-SQLAlchemy

## Languages

The app automatically detects the device's language and will be displayed in **Portuguese** or **English**, depending on the device's language settings.

## Installation

To set up Stockly on your local machine, follow these steps:

### 1. Clone the repository:

```
git clone https://github.com/sophialaurans/stockly-cs50-final-project
```

### 2. Install dependencies:

#### For the backend:

```
cd stockly/backend
# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### For the frontend:

```
cd stockly/frontend/stockly
npm install
```

### 3. Run the application:

#### Start the backend server:

```
cd stockly/backend
flask run
```

#### Start the frontend application:

```
cd stockly/frontend/stockly
npm start
```

## Running on Mobile Devices

To view and interact with Stockly, there are the following options:

1. **Using Expo**:

   - If you have a physical device, download the **Expo Go** app and scan the QR code displayed in your terminal after running running the frontend (`npm start`).

2. **Using an Emulator**:

   - If you prefer using an emulator, make sure you have an Android or iOS emulator installed.
   - Start the emulator before running the frontend (`npm start`), and the application should automatically open.
  
3. **Download APK**
   - You can download the APK of the app by clicking the following link: [Download APK](https://expo.dev/accounts/sophialns/projects/stockly/builds/f71e58b3-3242-4420-b5a4-c7483561ef6a)

## Usage

Once the application is running, you can navigate through the different screens using the app interface. Create and manage your inventory, track orders, and view insights on your dashboard.

## Attribution

App Icon: The app icon used in Stockly was adapted from an original design by [Freepik](https://www.freepik.com/icon/box_3639221). Colors were modified to better fit the theme of the application.

<br>

# Versão em Português

Este é o Stockly, um aplicativo de gerenciamento de estoque e pedidos projetado para ajudar pequenas empresas a gerenciar seus produtos, pedidos e clientes de maneira mais eficiente e prática.  
<br>Este aplicativo foi desenvolvido como Projeto Final para o curso **[CS50: Introduction to Computer Science](https://pll.harvard.edu/course/cs50-introduction-computer-science) da Universidade de Harvard**.

#### Vídeo de Demonstração: [Assista ao vídeo no YouTube](https://youtu.be/yPRaan05zEI), com capturas de tela do aplicativo, criado como parte dos requisitos do projeto final.

## Funcionalidades

O Stockly inclui os seguintes recursos principais:

### Telas Principais

1. **Painel de Controle (Dashboard)**:

   - Tenha uma visão geral das métricas do seu negócio, incluindo:
     - Total de produtos cadastrados
     - Total de estoque disponível
     - Número de pedidos pendentes
     - Total de clientes cadastrados
     - Gráfico interativo exibindo a receita de cada mês do ano, com dados da receita total de pedidos concluídos em cada mês.

2. **Produtos**:

   - Gerencie o inventário de produtos:
     - Adicione novos produtos
     - Edite os detalhes de produtos existentes
     - Exclua produtos do inventário

3. **Clientes**:

   - Guarde as informações dos clientes:
     - Adicione novos clientes
     - Edite os detalhes dos clientes
     - Exclua registros de clientes

4. **Pedidos**:
   - Acompanhe e gerencie os pedidos de forma eficiente:
     - Altere o status dos pedidos
     - Adicione novos pedidos
     - Edite os detalhes dos pedidos
     - Exclua pedidos
     - Imprima dados específicos dos pedidos ou salve-os como um arquivo PDF

### Gerenciamento de Perfil

- Gerencie as configurações de sua conta:
  - Edite as informações do perfil
  - Faça logout do aplicativo
  - Exclua sua conta, se necessário

## Tecnologias Utilizadas

- **Frontend**: React Native  
- **Backend**: Flask  
- **Banco de Dados**: SQLite  
- **ORM**: Flask-SQLAlchemy

## Idiomas

O aplicativo detecta automaticamente o idioma do dispositivo e será exibido em **Português** ou **Inglês**, dependendo da configuração de idioma do seu dispositivo.

## Instalação

Para configurar o Stockly na sua máquina local, siga as seguintes etapas:

### 1. Clone o repositório:

```
git clone https://github.com/sophialaurans/stockly-cs50-final-project
```

### 2. Instale as dependências:

#### Para o backend:

```
cd stockly/backend
# Ative o ambiente virtual
# No Windows:
.\venv\Scripts\activate
# No macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### Para o frontend:

```
cd stockly/frontend/stockly
npm install
```

### 3. Execute a aplicação:

#### Inicie o servidor backend:

```
cd stockly/backend
flask run
```

#### Inicie a aplicação frontend:

```
cd stockly/frontend/stockly
npm start
```

## Execução em Dispositivos Móveis

Para visualizar e interagir com o Stockly, existem as seguintes opções:

1. **Usando o Expo**:

   - Se você tiver um dispositivo físico, baixe o aplicativo **Expo Go** e escaneie o código QR exibido no seu terminal após executar o frontend (`npm start`).

2. **Usando um Emulador**:

   - Se preferir usar um emulador, certifique-se de ter um emulador Android ou iOS instalado.
   - Inicie o emulador antes de executar o frontend (`npm start`), e a aplicação deve abrir automaticamente.
  
3. **Download APK**:

   -Você pode baixar o APK do aplicativo clicando no seguinte link: [Baixar APK](https://expo.dev/accounts/sophialns/projects/stockly/builds/f71e58b3-3242-4420-b5a4-c7483561ef6a)

## Uso

Após a aplicação ser iniciada, você pode navegar pelas diferentes telas usando a interface do aplicativo. Crie e gerencie seu inventário, acompanhe pedidos e visualize insights no seu painel de controle.

## Créditos

Ícone do App: O ícone do aplicativo utilizado no Stockly foi adaptado de um design original de [Freepik](https://www.freepik.com/icon/box_3639221). As cores foram modificadas para se adequar melhor ao tema do aplicativo.
