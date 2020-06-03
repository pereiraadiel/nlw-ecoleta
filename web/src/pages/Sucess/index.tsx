import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import './styles.css';

const Sucess = () => {

  const history = useHistory();
  function handleGoBack(){
    history.push('/');
  }

  return (
    <div id="sucess" onTransitionEnd={handleGoBack}>
      <span><FiCheck/></span>
      <h1>Ponto de coleta criado com sucesso!</h1>
      <Link to="/">Concluir</Link>
    </div>
  );
}

export default Sucess;