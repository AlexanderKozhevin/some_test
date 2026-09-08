const products={
  cloud:{name:'Облачные серверы',description:'Вычислительные ресурсы для приложений любого масштаба.',url:'https://edgecenter.ru/cloud',icon:'cloud',color:'#537cdb'},
  kubernetes:{name:'Managed Kubernetes',description:'Управление контейнерами без рутины обслуживания кластера.',url:'https://edgecenter.ru/blog/edgecentr-obyavlyaet-o-zapuske-managed-kubernetes-vysokiy-spros-podtverzhdaet-aktualnost-resheniya',icon:'boxes',color:'#a89bea'},
  storage:{name:'Объектное хранилище',description:'Пространство для файлов, резервных копий и медиаконтента.',url:'https://edgecenter.ru/storage',icon:'database',color:'#76bfaf'},
  security:{name:'Защита от DDoS',description:'Фильтрация вредоносного трафика и защита ваших сервисов.',url:'https://edgecenter.ru/security',icon:'shield-check',color:'#e3aa8a'},
  cdn:{name:'CDN',description:'Доставка контента из точек присутствия ближе к аудитории.',url:'https://edgecenter.ru/cdn',icon:'globe-2',color:'#537cdb'},
  dns:{name:'DNS',description:'Управление доменами и маршрутизацией запросов.',url:'https://edgecenter.ru/dns',icon:'network',color:'#76bfaf'},
  hosting:{name:'Хостинг',description:'Серверы для стабильной работы сайтов и приложений.',url:'https://edgecenter.ru/hosting',icon:'server',color:'#a89bea'},
  streaming:{name:'Стриминговая платформа',description:'Инструменты для прямых эфиров и видео по запросу.',url:'https://edgecenter.ru/streaming-platform',icon:'video',color:'#537cdb'}
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

const menuTrigger=document.querySelector('.nav-trigger');
const megaMenu=document.querySelector('#products-menu');
const mobileTrigger=document.querySelector('.mobile-menu');
const navigation=document.querySelector('#navigation');
function closeProducts(){menuTrigger.setAttribute('aria-expanded','false');megaMenu.hidden=true;}
function closeMobile(){mobileTrigger.setAttribute('aria-expanded','false');mobileTrigger.setAttribute('aria-label','Открыть меню');navigation.classList.remove('open');closeProducts();}
menuTrigger.addEventListener('click',()=>{const open=menuTrigger.getAttribute('aria-expanded')==='true';menuTrigger.setAttribute('aria-expanded',String(!open));megaMenu.hidden=open;});
mobileTrigger.addEventListener('click',()=>{const open=mobileTrigger.getAttribute('aria-expanded')==='true';mobileTrigger.setAttribute('aria-expanded',String(!open));mobileTrigger.setAttribute('aria-label',open?'Открыть меню':'Закрыть меню');navigation.classList.toggle('open',!open);if(open)closeProducts();});
document.addEventListener('click',event=>{if(!event.target.closest('.nav-products'))closeProducts();if(!event.target.closest('.header')&&navigation.classList.contains('open'))closeMobile();});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMobile));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!megaMenu.hidden){closeProducts();menuTrigger.focus();}else if(navigation.classList.contains('open')){closeMobile();mobileTrigger.focus();}}});
document.querySelector('.nav-products').addEventListener('focusout',event=>{if(!event.currentTarget.contains(event.relatedTarget))closeProducts();});

const dialog=document.querySelector('.contact-dialog');
const form=document.querySelector('#contact-form');
let dialogTrigger=null;
document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
  dialogTrigger=button;closeMobile();
  document.querySelector('#contact-form-view').hidden=false;document.querySelector('#contact-result').hidden=true;
  form.elements.task.value=button.closest('.task-description')?tasks[currentTask].form:'Подобрать комплексное решение';
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();});
dialog.addEventListener('close',()=>dialogTrigger?.focus());
form.addEventListener('submit',event=>{
  event.preventDefault();
  const fields=new FormData(form);const text=`Здравствуйте!\n\nЗадача: ${fields.get('task')}\n\n${fields.get('message')}\n\n${fields.get('name')}\n${fields.get('email')}`;
  document.querySelector('#request-summary').textContent=text;
  const email=document.querySelector('#mailto-request');email.href='mailto:sales@edgecenter.ru?subject='+encodeURIComponent('Обсуждение проекта: '+fields.get('task'))+'&body='+encodeURIComponent(text);
  document.querySelector('#contact-form-view').hidden=true;document.querySelector('#contact-result').hidden=false;email.focus();
});
document.querySelector('#edit-request').addEventListener('click',()=>{document.querySelector('#contact-form-view').hidden=false;document.querySelector('#contact-result').hidden=true;form.elements.name.focus();});
