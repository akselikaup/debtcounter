import React, {useState, useEffect} from 'react';
import './App.css';

interface Suoritus {
  id: number;
  summa: number;
  pvm: Date;
}

const App : React.FC = () => {


  const [suoritus, setSuoritus] = useState<Suoritus[]>(() => {
    const stored = localStorage.getItem("suoritus");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          pvm: new Date(item.pvm)
        }));
      } catch (e) {
        console.error("Virhe suoritusten latauksessa:", e);
        return [];
      }
    }
    return [];
  });

  const [paaoma, setPaaoma] = useState<number | undefined>(() => {
    const stored = localStorage.getItem("paaoma");
    return stored ? JSON.parse(stored) : 0;
  });

  const [paaomaSyotto, setPaaomaSyotto] = useState<number | undefined>(() => {
    const stored = localStorage.getItem("paaomaSyotto");
    return stored ? JSON.parse(stored) : 0;
  });

  const [paaomaAsetettu, setPaaomaAsetettu] = useState<boolean>(() => {
    const stored = localStorage.getItem("paaomaAsetettu");
    return stored ? JSON.parse(stored) : false;
  });

  const [asetettuPaaoma, setAsetettuPaaoma] = useState<number | undefined>(() => {
    const stored = localStorage.getItem("asetettuPaaoma");
    return stored ? JSON.parse(stored) : 0;
  });

  const [summa, setSumma] = useState<number | undefined>(() => {
    const stored = localStorage.getItem("summa");
    return stored ? JSON.parse(stored) : 0;
  });

  const [pvm, setPvm] = useState<Date | undefined>(() => {
    const stored = localStorage.getItem("pvm");
    return stored ? new Date(stored) : undefined;
  });

  const [maksettuSumma, setMaksettuSumma] = useState<number | undefined>(() => {
    const stored = localStorage.getItem("maksettuSumma");
    return stored ? JSON.parse(stored) : 0;
  });

  const [ohjeet, setOhjeet] = useState<boolean>(() => {
    const stored = localStorage.getItem("ohjeet");
    return stored ? JSON.parse(stored) : false;
  });

  const [ilmoitus, setIlmoitus] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("suoritus", JSON.stringify(suoritus));
  }, [suoritus]);

  useEffect(() => {
    localStorage.setItem("ohjeet", JSON.stringify(ohjeet));
  }, [ohjeet]);

  useEffect(() => {
    localStorage.setItem("paaomaAsetettu", JSON.stringify(paaomaAsetettu));
  }, [paaomaAsetettu]);

  useEffect(() => {
    localStorage.setItem("paaoma", JSON.stringify(paaoma));
  }, [paaoma]);

  useEffect(() => {
    localStorage.setItem("paaomaSyotto", JSON.stringify(paaomaSyotto));
  }, [paaomaSyotto]);

  useEffect(() => {
    localStorage.setItem("asetettuPaaoma", JSON.stringify(asetettuPaaoma));
  }, [asetettuPaaoma]);

  useEffect(() => {
    localStorage.setItem("summa", JSON.stringify(summa));
  }, [summa]);

  useEffect(() => {
    localStorage.setItem("maksettuSumma", JSON.stringify(maksettuSumma));
  }, [maksettuSumma]);


  const lisaaSuoritus = () => {
    if (!summa || !pvm) {
      setIlmoitus("Syötä sekä summa että päivämäärä ennen lisäämistä.")
      setTimeout(() => setIlmoitus(null), 3000);
      return
    }

    if (summa && pvm) {
      const uusiSuoritus: Suoritus = {
        id: Date.now(),
        summa: Number(summa),
        pvm: pvm ?? new Date()
      };

    setSuoritus([...suoritus, uusiSuoritus]);
    if (paaoma !== undefined && summa !== undefined && maksettuSumma !== undefined) {
      setPaaoma(paaoma - summa);
      setMaksettuSumma(maksettuSumma + summa)
    }
    setSumma(0);
    };
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

  function nollaaKaikki(): void {
  const vahvista = window.confirm("Haluatko varmasti nollata kaikki tiedot? Nollaaminen tyhjentää koko lomakkeen, eikä tätä voi perua.");
    if (vahvista) {
      setAsetettuPaaoma(undefined);
      setMaksettuSumma(0);
      setPaaomaAsetettu(false);
      setPaaoma(0);
      setSumma(undefined);
      setSuoritus([]);
      setPaaomaSyotto(undefined);
      setPvm(undefined);
      setOhjeet(false);
      localStorage.clear();
    };
  };

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
              <div className="keskitetty">
                <button onClick={muokkaa}>Muokkaa pääomaa</button>
              </div>
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
              <th>{suoritus.length === 0 ? 'Lisää suoritus' : 'Poista suoritus'}</th>
            </tr>
          </thead>
          <tbody>
            {[...suoritus]
            .sort((a,b) => a.pvm.getTime() - b.pvm.getTime())
            .map(item => (
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
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPvm(new Date(e.target.value))}
                />
              </td>
              <td>
                <button onClick={lisaaSuoritus}>Lisää</button>
              </td>
            </tr>
          </tfoot>
        </table>

        {ilmoitus && (
          <div className="virhe">
            {ilmoitus}
          </div>
        )}

        <div className="alapainikkeet">
          {!ohjeet && (
            <button onClick={naytaOhjeet}>Näytä käyttöohjeet</button>
          )}
          {ohjeet && (
            <div className="ohjeet">
              <div className="keskitetty">
                <button onClick={piilotaOhjeet}>Piilota käyttöohjeet</button>
              </div>
              <div>
                <h3>1. Pääoman syöttäminen ja muokkaaminen</h3>
                <p>Voit syöttää pääoman ylimpään kenttään kun avaat sivun ensimmäisen kerran. Kun olet syöttänyt pääoman, 
                  poistuu pääoman syöttämisen mahdollisuus, mutta voit muokata pääoman suuruutta painamalla "muokkaa pääomaa"-painiketta, 
                  joka ilmestyy pääoman syöttämisen jälkeen. Pääoman muokkaaminen ei poista jo tehtyjä suorituksia. "Vanhasta" pääomasta vähennetyt suoritukset
                  otetaan huomioon pääoman muokkaamisen jälkeen uudessa velkapääomassa</p>
              </div>
              <div>
                <h3>2. Suorituksen lisääminen</h3>
                <p>Voit lisätä uuden maksusuorituksen syöttämällä suorituksen summan taulukon alimpaan vapaaseen kenttään sekä valitsemalla summan viereisestä
                  kentästä maksupäivämäärän. Maksupäivämäärän voi valita vapaasti kuluvasta päivästä taaksepäin, joten suorituksen voi merkitä myös takautuvasti.
                  Lisätyn suorituksen voi poistaa, suoritukset näkyvät listassa merkitsemäsi suorituspäivän mukaan kronologisessa järjestyksessä.
                </p>
                <p><strong>Jos merkitset suorituksen muuna kuin täysinä euroina, erota eurot ja sentit toisistaan pilkulla, ei pisteellä!</strong></p>
                <p>Muista lisätä sekä summa että päivämäärä ennen suorituksen lisäämistä.</p>
              </div>
              <div>
                <h3>3. Taulukon tyhjentäminen/nollaaminen</h3>
                <p>Jos haluat aloittaa puhtaalta pöydältä, voit painaa painiketta "nollaa kaikki". Tämä tyhjentää lomakkeen täysin alkuasetelmaan, 
                  eli poistaa kaikki suoritukset ja poistaa velkapääoman. Painikkeen painaminen vahingossa ei kaada maailmaa, sillä ennen kuin taulukko tyhjenee täysin, kysyy
                  ohjelma vielä varmuuden vuoksi, haluatko varmasti nollata kaiken. <strong>Nollaamista ei voi perua!</strong></p>
              </div>
            </div>
          )}
          <button className="nollauspainike" onClick={nollaaKaikki}>Nollaa kaikki</button>
        </div>
    </div>
  )
}

export default App;