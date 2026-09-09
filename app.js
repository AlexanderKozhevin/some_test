const products={
  cloud:{name:'Облачные серверы',description:'Вычислительные ресурсы для приложений любого масштаба.',url:'./cloud/',icon:'cloud',color:'#537cdb'},
  kubernetes:{name:'Managed Kubernetes',description:'Управление контейнерами без рутины обслуживания кластера.',url:'./kubernetes/',icon:'boxes',color:'#a89bea'},
  storage:{name:'Объектное хранилище',description:'Пространство для файлов, резервных копий и медиаконтента.',url:'./storage/',icon:'database',color:'#76bfaf'},
  security:{name:'Защита от DDoS',description:'Фильтрация вредоносного трафика и защита ваших сервисов.',url:'./security/',icon:'shield-check',color:'#e3aa8a'},
  cdn:{name:'CDN',description:'Доставка контента из точек присутствия ближе к аудитории.',url:'./cdn/',icon:'globe-2',color:'#537cdb'},
  dns:{name:'DNS',description:'Управление доменами и маршрутизацией запросов.',url:'./dns/',icon:'network',color:'#76bfaf'},
  hosting:{name:'Хостинг',description:'Серверы для стабильной работы сайтов и приложений.',url:'./hosting/',icon:'server',color:'#a89bea'},
  streaming:{name:'Стриминговая платформа',description:'Инструменты для прямых эфиров и видео по запросу.',url:'./streaming-platform/',icon:'video',color:'#537cdb'}
};
const tasks={
  cloud:{number:'01 / 05',heading:'От идеи<br> до первого<br> <span>запуска.</span>',description:'Разверните приложение и добавляйте ресурсы по мере роста. Все инструменты — в одной экосистеме.',cta:'Подобрать конфигурацию',products:['cloud','kubernetes','storage','security'],form:'Запустить в облаке'},
  speed:{number:'02 / 05',heading:'Меньше ожидания.<br> <span>Больше возможностей.</span>',description:'Доставляйте контент ближе к пользователям и распределяйте нагрузку. Сайт готов к следующему всплеску интереса.',cta:'Обсудить ускорение сайта',products:['cdn','cloud','security','dns'],form:'Ускорить сайт'},
  security:{number:'03 / 05',heading:'Бизнес работает.<br> <span>Защита — тоже.</span>',description:'Постройте защиту приложения и инфраструктуры. Поможем подобрать сервисы под вашу архитектуру и риски.',cta:'Обсудить защиту проекта',products:['security','cdn','dns','cloud'],form:'Защититься от атак'},
  stream:{number:'04 / 05',heading:'Ваш эфир.<br> <span>Его аудитория.</span>',description:'Организуйте трансляцию, храните записи и доставляйте видео зрителям. Всё необходимое для работы с контентом.',cta:'Подобрать решение для видео',products:['streaming','cdn','storage','security'],form:'Организовать трансляцию'},
  data:{number:'05 / 05',heading:'Данные на месте.<br> <span>И под контролем.</span>',description:'Храните файлы, медиаконтент и резервные копии. Подключайте вычисления и быструю доставку, когда это нужно.',cta:'Обсудить хранение данных',products:['storage','cloud','cdn','security'],form:'Хранить данные'}
};
const icons=()=>window.lucide?.createIcons({attrs:{'aria-hidden':'true','focusable':'false'}});
let currentTask='cloud';
const taskButtons=[...document.querySelectorAll('[data-task]')];
function selectTask(key,focus=false){
  const task=tasks[key]; if(!task)return; currentTask=key;
  taskButtons.forEach(button=>{const selected=button.dataset.task===key;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;if(selected&&focus)button.focus();});
  const panel=document.querySelector('#task-panel');panel.setAttribute('aria-labelledby','tab-'+key);
  panel.querySelector('.task-number').textContent=task.number;
  panel.querySelector('.task-description h3').innerHTML=task.heading;
  panel.querySelector('.task-description p').textContent=task.description;
  panel.querySelector('.task-description button').innerHTML=task.cta+' <i data-lucide="arrow-up-right"></i>';
  document.querySelector('#product-grid').innerHTML=task.products.map((id,index)=>{const p=products[id];return `<a class="product-card ${index===0?'primary':''}" href="${p.url}" style="--product-accent:${p.color}"><div class="product-card-top"><i class="product-icon" data-lucide="${p.icon}"></i><i class="product-arrow" data-lucide="arrow-up-right"></i></div><h4>${p.name}</h4><p>${p.description}</p></a>`}).join('');
  icons();
}
taskButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>selectTask(button.dataset.task));
  button.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%taskButtons.length;else if(event.key==='ArrowLeft')next=(index+taskButtons.length-1)%taskButtons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=taskButtons.length-1;else return;event.preventDefault();selectTask(taskButtons[next].dataset.task,true);taskButtons[next].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});});
});
selectTask('cloud');
