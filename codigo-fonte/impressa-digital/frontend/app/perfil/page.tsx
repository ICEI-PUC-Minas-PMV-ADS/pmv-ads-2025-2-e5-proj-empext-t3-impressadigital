'use client'
import React, { useState } from 'react';
// Importar o useAuth (Assumindo que está em um caminho acessível)
import { useAuth } from '../contexts/Authprovider'; // AJUSTE O CAMINHO CONFORME A ESTRUTURA REAL DO SEU PROJETO

// Importar os componentes das páginas filhas
import Carrinho from './carrinho/page';
import PedidosPage from './pedidos/page';
import EditarPerfil from './editarPerfil/page';

const menuItems = [
  { label: "Perfil", path: "/perfil/" },
  { label: "Carrinho", path: "/perfil/carrinho" },
  { label: "Pedidos", path: "/perfil/pedidos" },
  { label: "EditarPerfil", path: "/perfil/editar-perfil" },

];



const Perfil: React.FC = () => {
  // Obter a função de logout
  const { logout, user } = useAuth(); 
  
  
  return (
  <></>   
  )
};

export default Perfil;