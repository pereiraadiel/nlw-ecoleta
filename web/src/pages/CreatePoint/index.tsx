import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

// array ou objeto no state: precisa manualmente informar o tipo de dado
// usando a interface
interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf , setSelectedUf] = useState('0');
  const [selectedCity , setSelectedCity] = useState('0');

  const [selectedPosition, setSelectedPosition] = useState<[number,number]>([-16.13026201203474, -49.39453125000001 ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  
  const history = useHistory();
  //chamada da api para os items de coleta
  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data);
    });
  }, []);

  //chamada da api do ibge para ufs
  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials)
      });
  }, []);

  //chamada da api do ibge para cidades por uf
  useEffect(() => {
    if(selectedUf === '0') return;
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  // obter localizacao atual do usuario
  // useEffect( () => {
  //   navigator.geolocation.getCurrentPosition(position => {
  //     console.log(position);
  //     const { latitude, longitude } = position.coords;
  //     setinitialPosition([latitude,longitude ]);
  //   })
  // },[]);

  function handleSelectUf(event:ChangeEvent<HTMLSelectElement>){
    console.log("handleSelectUf");
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
    console.log("handleSelectCity");
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent){
    console.log(event.latlng);
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target;
    setFormData({ ...formData, [name]: value});
  }

  function handleSelectItem(id: number){
    const alreadySelected = selectedItems.findIndex(item => item === id);
    if(alreadySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !==id);
      setSelectedItems(filteredItems);
    }
    else{
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    console.log('form enviado :)');
    const {name, email, whatsapp} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    const data = {
      name, 
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    };
    //console.log(data);
    await api.post('/points',data);
    history.push('/sucess');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
          </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do<br />ponto de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-16.13026201203474, -49.39453125000001 ]} zoom={3.5} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                onChange={handleSelectUf} 
                value={selectedUf} 
                name="uf" 
                id="uf">
                <option value="0">Selecione o estado (UF)</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select 
                value={selectedCity}
                name="city" 
                id="city"
                onChange={handleSelectCity}
              >
                <option value="0">Selecione a cidade</option>
                { cities.map(city => (
                  <option value={city} key={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              <li 
                key={item.id} 
                onClick={() => {handleSelectItem(item.id)}}
                className={selectedItems.includes(item.id)?'selected':''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}

          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default CreatePoint;