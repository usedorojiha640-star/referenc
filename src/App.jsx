import React,{useMemo,useState} from 'react';

// Укажите здесь свой актуальный Telegram менеджера.
const TELEGRAM = 'https://t.me/cashers_manager_1';
// Демонстрационные ориентиры к USD. Не являются предложением по фиксированному курсу.
const RATES = {USD:1,EUR:.92,RUB:92.5,CNY:7.25,KZT:470,USDT:1,BTC:.0000122,ETH:.00032};
const CURRENCIES = [
  ['EUR','Евро','€'],['USD','Доллар США','$'],['RUB','Рубль','₽'],
  ['CNY','Юань','¥'],['KZT','Тенге','₸'],['USDT','Tether','₮'],
  ['BTC','Bitcoin','₿'],['ETH','Ethereum','Ξ']
];
const NAME = Object.fromEntries(CURRENCIES.map(([code,name])=>[code,name]));
const fmt = (n,code) => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:code==='BTC'||code==='ETH'?8:2,minimumFractionDigits:2}).format(n);
function Icon({name,size=20}){
  const common={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true};
  if(name==='arrow')return <svg {...common}><path d="M5 12h14m-6-6 6 6-6 6"/></svg>;
  if(name==='swap')return <svg {...common}><path d="M4 8h16m-5-4 5 4-5 4M20 16H4m5-4-5 4 5 4"/></svg>;
  if(name==='check')return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
  if(name==='shield')return <svg {...common}><path d="M12 2 4 5v6c0 5 3.3 8.5 8 11 4.7-2.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
  if(name==='clock')return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  if(name==='pin')return <svg {...common}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
  if(name==='lock')return <svg {...common}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
  return <svg {...common}><path d="M4 12h16"/></svg>;
}
function App(){
  const [mode,setMode]=useState('sell');
  const [cash,setCash]=useState('EUR');
  const [crypto,setCrypto]=useState('USDT');
  const [amount,setAmount]=useState('1000');
  const [city,setCity]=useState('');
  const [faq,setFaq]=useState(null);
  const parsed=Math.max(0,Number(String(amount).replace(',','.'))||0);
  const from=mode==='sell'?crypto:cash;
  const to=mode==='sell'?cash:crypto;
  const estimate=useMemo(()=>{
    if(!RATES[from]||!RATES[to])return 0;
    return parsed / RATES[from]*RATES[to]*(mode==='sell'?1.0:1.0);
  },[parsed,from,to,mode]);
  const telegramLink=useMemo(()=>{
    const msg=`Здравствуйте! Хочу ${mode==='sell'?'продать':'купить'} ${crypto}. Отдаю: ${parsed} ${from}. Получаю: ${to}. ${city.trim()?`Город: ${city.trim()}. `:''}Прошу уточнить актуальный курс и условия встречи.`;
    return `${TELEGRAM}?text=${encodeURIComponent(msg)}`;
  },[mode,crypto,parsed,from,to,city]);
  const select=(value,fn,options)=> <div className="select-wrap"><select value={value} onChange={e=>fn(e.target.value)} aria-label="Валюта">{options.map(c=><option key={c[0]} value={c[0]}>{c[2]}  {c[0]}</option>)}</select><span className="chevron">⌄</span></div>;
  const cashList=CURRENCIES.filter(([c])=>!['USDT','BTC','ETH'].includes(c));
  const cryptoList=CURRENCIES.filter(([c])=>['USDT','BTC','ETH'].includes(c));
  return <>
    <header className="header"><div className="shell nav">
      <a href="#home" className="brand"><span className="brand-mark"><span></span><span></span><span></span></span><span>BURO<span className="brand-accent">PAY</span><small>PRIVATE EXCHANGE</small></span></a>
      <nav className="menu"><a href="#benefits">Преимущества</a><a href="#process">Как проходит обмен</a><a href="#geo">География</a><a href="#questions">Вопросы</a></nav>
      <a className="nav-contact" href={TELEGRAM} target="_blank" rel="noopener noreferrer">Связаться с менеджером <Icon name="arrow" size={16}/></a>
    </div></header>
    <main id="home">
      <section className="hero"><div className="hero-grid shell">
        <div className="hero-left"><div className="eyebrow"><span className="alive"/> ПЕРСОНАЛЬНЫЙ ОБМЕН КРИПТОВАЛЮТ</div>
          <h1>Криптовалюта.<br/><em>Наличные.</em><br/>Всё просто.</h1>
          <p className="hero-desc">Покупка и продажа криптовалюты за наличные с сопровождением менеджера. Выбирайте направление, рассчитывайте сумму и согласовывайте условия сделки.</p>
          <div className="trust-strip"><div><Icon name="shield"/> Сделка при встрече</div><div><Icon name="clock"/> Поддержка 24/7</div></div>
          <a className="hero-link" href="#process">Как проходит обмен <Icon name="arrow" size={17}/></a>
        </div>
        <div className="exchange" id="calculator"><div className="exchange-top"><div><div className="smallcap">КАЛЬКУЛЯТОР ОБМЕНА</div><h2>Рассчитать сумму</h2></div><span className="live-tag"><i/> Ориентировочный расчёт</span></div>
          <div className="tabs"><button className={mode==='sell'?'selected':''} onClick={()=>setMode('sell')}>Продать криптовалюту</button><button className={mode==='buy'?'selected':''} onClick={()=>setMode('buy')}>Купить криптовалюту</button></div>
          <div className="field-header"><label htmlFor="give-amount">Вы отдаёте</label><span>Введите сумму</span></div>
          <div className="amount-row"><input id="give-amount" type="text" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.,]/g,''))}/>{mode==='sell'?select(crypto,setCrypto,cryptoList):select(cash,setCash,cashList)}</div>
          <div className="switch-row"><span/><button aria-label="Поменять направление" onClick={()=>setMode(m=>m==='sell'?'buy':'sell')}><Icon name="swap" size={19}/></button><span/></div>
          <div className="field-header"><label>Вы получаете</label><span>Предварительно</span></div>
          <div className="amount-row result"><output>{fmt(estimate,to)}</output>{mode==='sell'?select(cash,setCash,cashList):select(crypto,setCrypto,cryptoList)}</div>
          <div className="city-wrap"><label htmlFor="city">Город встречи <span>необязательно</span></label><input id="city" value={city} onChange={e=>setCity(e.target.value)} placeholder="Укажите город"/></div>
          <div className="rate-note"><Icon name="shield" size={17}/><span>Расчёт справочный. Актуальный курс, комиссии и доступность обмена подтверждает менеджер.</span></div>
          <a className="primary-btn" href={telegramLink} target="_blank" rel="noopener noreferrer">Оставить заявку в Telegram <Icon name="arrow" size={20}/></a>
          <div className="card-foot">Без онлайн-оплаты на сайте. Все детали — при согласовании заявки.</div>
        </div>
      </div><div className="hero-bottom shell"><span>BURO PAY / PRIVATE EXCHANGE</span><span>01 — ОБМЕН КРИПТОВАЛЮТ</span></div></section>
      <section className="benefits section shell" id="benefits"><div className="section-intro"><div><div className="kicker">01 / ПРЕИМУЩЕСТВА</div><h2>Обмен без<br/>лишней сложности</h2></div><p>Понятный процесс, личное сопровождение и согласование деталей до начала сделки.</p></div>
        <div className="benefit-grid"><article><div className="feature-icon"><Icon name="shield" size={25}/></div><span>01</span><h3>Личная встреча</h3><p>Передача средств и порядок расчёта согласовываются заранее с менеджером.</p></article><article><div className="feature-icon"><Icon name="clock" size={25}/></div><span>02</span><h3>Быстрый ответ</h3><p>Отправьте сумму и валюту — менеджер уточнит курс и доступные условия.</p></article><article><div className="feature-icon"><Icon name="lock" size={25}/></div><span>03</span><h3>Конфиденциальность</h3><p>Обсуждение заявки напрямую с менеджером, без публичного размещения деталей.</p></article></div>
      </section>
      <section className="process" id="process"><div className="shell"><div className="section-intro"><div><div className="kicker">02 / ПРОЦЕСС</div><h2>Четыре шага<br/>до обмена</h2></div><p>От предварительного расчёта до завершения сделки — прозрачно и последовательно.</p></div><div className="steps">{[['01','Рассчитайте сумму','Выберите валюты и направление обмена в калькуляторе.'],['02','Свяжитесь с менеджером','Передайте параметры заявки и укажите удобный город.'],['03','Согласуйте условия','Подтвердите курс, формат, место и время встречи.'],['04','Проведите обмен','Завершите сделку в согласованном порядке.']].map(([n,h,p])=><article key={n}><b>{n}</b><div><h3>{h}</h3><p>{p}</p></div><Icon name="arrow" size={19}/></article>)}</div></div></section>
      <section className="geo section shell" id="geo"><div className="geo-panel"><div><div className="kicker">03 / ГЕОГРАФИЯ</div><h2>Обмен там,<br/>где удобно вам</h2><p>Возможность обслуживания зависит от города и доступности партнёров. Уточните место встречи у менеджера до оформления заявки.</p><a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="outline-btn">Уточнить доступность <Icon name="arrow" size={17}/></a></div><div className="geo-graphic" aria-hidden="true"><div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/><span className="location-point p1"/><span className="location-point p2"/><span className="location-point p3"/><span className="location-point p4"/><div className="graphic-center"><Icon name="pin" size={30}/><strong>YOUR CITY</strong><small>ПО СОГЛАСОВАНИЮ</small></div></div></div></section>
      <section className="faq section shell" id="questions"><div className="section-intro"><div><div className="kicker">04 / ВОПРОСЫ И ОТВЕТЫ</div><h2>Всё, что важно<br/>перед обменом</h2></div></div><div className="faq-list">{[['Курс в калькуляторе окончательный?','Нет. Калькулятор показывает ориентировочную сумму по демонстрационным значениям. Точный курс и условия необходимо подтвердить у менеджера.'],['Можно купить и продать криптовалюту?','Да. В калькуляторе предусмотрены оба направления. Доступные валюты и условия конкретного обмена уточняются при оформлении заявки.'],['Как проходит обмен?','Сначала вы согласуете сумму, курс и детали встречи с менеджером, затем проводите обмен в согласованном порядке.'],['Где доступна услуга?','Напишите менеджеру город и направление обмена: он уточнит возможность обслуживания и формат сделки.']].map(([q,a],i)=><div className={'faq-item '+(faq===i?'open':'')} key={q}><button onClick={()=>setFaq(faq===i?null:i)} aria-expanded={faq===i}><span>{q}</span><b>{faq===i?'−':'+'}</b></button>{faq===i&&<p>{a}</p>}</div>)}</div></section>
      <section className="closing"><div className="shell closing-inner"><div><div className="kicker">ГОТОВЫ К ОБМЕНУ?</div><h2>Начнём с расчёта.</h2><p>Напишите менеджеру — обсудим ваш запрос и подходящие условия.</p></div><a className="closing-btn" href={TELEGRAM} target="_blank" rel="noopener noreferrer">Написать в Telegram <Icon name="arrow"/></a></div></section>
    </main>
    <footer><div className="shell footer-inner"><a href="#home" className="brand"><span className="brand-mark"><span></span><span></span><span></span></span><span>BURO<span className="brand-accent">PAY</span><small>PRIVATE EXCHANGE</small></span></a><span>© {new Date().getFullYear()} BURO PAY</span><p>Информация носит ознакомительный характер и не является публичной офертой.</p><a href={TELEGRAM} target="_blank" rel="noopener noreferrer">Telegram ↗</a></div></footer>
  </>;
}
export default App;
