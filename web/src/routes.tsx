import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import Sucess from './pages/Sucess';

const Routes = () =>{
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home}/>
      <Route path="/create-point" component={CreatePoint}/>
      <Route path="/sucess" component={Sucess}/>
    </BrowserRouter>
  );
}

export default Routes;