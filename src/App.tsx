import React, {useState} from 'react';
import './App.css';

interface Suoritus {
  id: number;
  summa: number;
  pvm: Date;
}

const App : React.FC = () => {
  const [suoritus, setSuoritus] = useState<Suoritus[]>([]);
  const [paaoma, setPaaoma] = useState<number>(0);
  const [paaomaSyotto, setPaaomaSyotto] = useState<number>();
  const [paaomaAsetettu, setPaaomaAsetettu] = useState(false);
  const [asetettuPaaoma, setAsetettuPaaoma] = useState<number>();
  const [summa, setSumma] = useState<number>();
  const [pvm, setPvm] = useState<Date>();
  const [maksettuSumma, setMaksettuSumma] = useState<number>(0);
  const [ohjeet, setOhjeet] = useState(false);


  const lisaaSuoritus = () => {
    const uusiSuoritus: Suoritus = {
      id: Date.now(),
      summa: Number(summa),
      pvm: pvm ?? new Date()
    };
  setSuoritus([...suoritus, uusiSuoritus]);
  if (paaoma !== undefined && summa !== undefined) {
    setPaaoma(paaoma - summa);
    setMaksettuSumma(maksettuSumma + summa)
  }
  setSumma(0);
  };

  const poistaTapahtuma = (id: number) => {
    const poistettava = suoritus.find(item => item.id === id);
    if (!poistettava) return;

    setSuoritus(suoritus.filter(item => item.id !== id));
    setPaaoma(prev => prev + poistettava.summa);
    setMaksettuSumma(prev => prev - poistettava.summa)
  };

  const lisaaPaaoma = () => {
    if (paaomaSyotto !== undefined && paaomaSyotto > 0) {
      const joMaksettu = suoritus.reduce((sum, item) => sum + item.summa, 0);
      setPaaoma(paaomaSyotto - joMaksettu);
      setAsetettuPaaoma(paaomaSyotto);
      setPaaomaAsetettu(true);
    }
  };

  const muokkaa = () => {
    setPaaomaAsetettu(false);
  }

  const naytaOhjeet = () => {
    setOhjeet(true);
  }

  const piilotaOhjeet = () => {
    setOhjeet(false);
  }

  return (
    <div className="container">
      <h1>Velkataulukko</h1>
        {!paaomaAsetettu && (
          <div className="paaomanSyottoKentta">
            <h2>Syötä pääoma</h2>
            <thead>
              <tr>
                <th>Pääoman summa</th>
              </tr>
            </thead>
            <input
            type="number"
            placeholder="Pääoman summa"
            value={paaomaSyotto ?? ''}
            onChange={(e) => setPaaomaSyotto(Number(e.target.value))}
            ></input>
            <button onClick={lisaaPaaoma}>Lisää pääoma</button>
          </div>
        )}

        {paaomaAsetettu && (
          <>
            <div>
              <h4>Asetettu pääoma: {asetettuPaaoma} euroa</h4>
              <button onClick={muokkaa}>Muokkaa pääomaa</button>
            </div>
            <div>
            <h4>Jäljellä oleva velkapääoma: {paaoma} euroa</h4>
            <h4>Velkaa lyhennetty yhteensä: {maksettuSumma} euroa</h4>
            </div>
          </>
        )}
        <table className="taulukko">
          <thead>
            <tr>
              <th>Suorituksen summa</th>
              <th>Suorituksen päivämäärä</th>
              <th>Poista suoritus</th>
            </tr>
          </thead>
          <tbody>
            {suoritus.map(item => (
              <tr key={item.id}>
                <td>{item.summa} €</td>
                <td>{item.pvm.toLocaleDateString()}</td>
                <td><button onClick= {() => poistaTapahtuma(item.id)}>Poista</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <input
                  type="number"
                  placeholder="Suorituksen summa"
                  value={summa ?? ''}
                  onChange={(e) => setSumma(Number(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="date"
                  placeholder="Suorituksen päivämäärä"
                  value={pvm ? pvm.toISOString().split('T')[0] : ''}
                  onChange={(e) => setPvm(new Date(e.target.value))}
                />
              </td>
              <td>
                <button onClick={lisaaSuoritus}>Lisää</button>
              </td>
            </tr>
          </tfoot>
        </table>

 {/*       <div className="inputContainer">
          <input
            type="number"
            placeholder="Suorituksen summa"
            value={summa}
            onChange={(e) => setSumma(Number(e.target.value))}>
          </input>

          <input
            type="Date"
            placeholder="Suorituksen päivämäärä"
            value={pvm ? pvm.toISOString().split('T')[0] : ''}
            onChange={(e) => setPvm(new Date(e.target.value))}>
          </input>

          <button onClick={lisaaSuoritus}>Lisää</button>
        </div> */}
        {!ohjeet && (
          <button onClick={naytaOhjeet}>Näytä käyttöohjeet</button>
        )}
        {ohjeet && (
          <div className="ohjeet">
            <button onClick={piilotaOhjeet}>Piilota käyttöohjeet</button>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias voluptas atque consequuntur, in animi expedita sunt doloribus quisquam quis consectetur laborum aliquam amet tempora impedit assumenda. Officiis quasi facere obcaecati.</p>
          </div>
        )}
    </div>
  )
}

export default App;