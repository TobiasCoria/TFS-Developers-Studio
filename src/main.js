import { services, brand } from './content.js';
import './particles.js';

document.querySelectorAll('.footer-word').forEach((node) => { node.textContent = brand.descriptor; });
document.querySelector('.preloader-bottom>span').textContent = `ESTUDIO DIGITAL · ${brand.location.toUpperCase()}`;
document.querySelector('.mobile-nav>p').firstChild.textContent = brand.name.toUpperCase() + ' ';
document.querySelector('.index-dialog-brand b').firstChild.textContent = brand.name.toUpperCase() + ' ';
document.querySelector('.index-dialog-bottom>span').textContent = `${brand.name.toUpperCase()} / ROSARIO`;
document.querySelectorAll('.contact-email').forEach((link) => {
  link.href = `mailto:${brand.email}`;
  link.firstChild.textContent = `${brand.email} `;
});
document.querySelector('#hero-title').innerHTML = `<span class="title-line">${brand.hero[0]}</span><span class="title-line title-shift">${brand.hero[1]} <em>${brand.hero[2]}</em></span>`;
document.querySelector('.site-footer>p').innerHTML = `${brand.signature[0]}<br><span>${brand.signature[1]}</span>`;
document.title = brand.name;
document.querySelector('meta[name="description"]').content = `${brand.name} — Estudio de desarrollo digital en ${brand.location}. Software a medida, productos web, ERP y plataformas empresariales.`;

const serviceTabs = [...document.querySelectorAll('.service-item')];
const servicePanel = document.querySelector('#service-panel');
let serviceUpdateTimer = 0;
serviceTabs.forEach((tab, index) => {
  if (!services[index]) return;
  tab.querySelector('span').textContent = String(index + 1).padStart(2, '0');
  tab.querySelector('b').textContent = services[index].title;
});
const selectService = (index, focus = false) => {
  const service = services[index];
  if (!service) return;
  serviceTabs.forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  servicePanel.setAttribute('aria-labelledby', `service-tab-${index}`);
  servicePanel.setAttribute('aria-busy', 'true');
  servicePanel.dataset.transition = 'out';
  window.clearTimeout(serviceUpdateTimer);
  serviceUpdateTimer = window.setTimeout(() => {
    if (serviceTabs[index]?.getAttribute('aria-selected') !== 'true') return;
    servicePanel.querySelector('.eyebrow').textContent = service.english;
    servicePanel.querySelector('h3').textContent = service.title === 'Desarrollo web' ? 'Experiencias digitales que hacen su trabajo más fácil.' : `${service.title} para desafíos del mundo real.`;
    servicePanel.querySelector('.service-description').textContent = service.description;
    const tags = servicePanel.querySelector('.service-tags');
    tags.replaceChildren(...service.tags.map((tag) => {
      const node = document.createElement('span');
      node.textContent = tag;
      return node;
    }));
    servicePanel.querySelector('.panel-counter').innerHTML = `${String(index + 1).padStart(2, '0')} <i>/</i> ${String(services.length).padStart(2, '0')}`;
    servicePanel.setAttribute('aria-busy', 'false');
    servicePanel.dataset.transition = 'in';
  }, 150);
};
serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectService(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % services.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + services.length) % services.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = services.length - 1;
    selectService(next, true);
  });
});

const mobileToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = [...mobileNav.querySelectorAll('a')];
const closeMobile = ({ returnFocus = false } = {}) => {
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', 'Abrir menú');
  mobileNav.classList.remove('open');
  mobileNav.inert = true;
  document.body.classList.remove('menu-open');
  if (returnFocus) mobileToggle.focus();
};
document.addEventListener('keydown', (event) => {
  if (mobileToggle.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') {
    closeMobile({ returnFocus: true });
    return;
  }
  if (event.key !== 'Tab' || mobileLinks.length === 0) return;
  const first = mobileLinks[0];
  const last = mobileLinks.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
mobileToggle.addEventListener('click', () => {
  const open = mobileToggle.getAttribute('aria-expanded') !== 'true';
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.classList.toggle('open', open);
  mobileNav.inert = !open;
  document.body.classList.toggle('menu-open', open);
  if (open) requestAnimationFrame(() => mobileLinks[0]?.focus());
  else mobileToggle.focus();
});
mobileLinks.forEach((link) => link.addEventListener('click', () => closeMobile({ returnFocus: true })));

const indexDialog = document.querySelector('#studio-index');
const indexOpen = document.querySelector('.index-open');
const closeIndex = document.querySelector('.index-close');
indexOpen.addEventListener('click', () => { indexDialog.showModal(); indexOpen.setAttribute('aria-expanded', 'true'); });
closeIndex.addEventListener('click', () => indexDialog.close());
indexDialog.addEventListener('click', (event) => {
  if (event.target === indexDialog) indexDialog.close();
});
indexDialog.addEventListener('close', () => { indexOpen.setAttribute('aria-expanded', 'false'); indexOpen.focus(); });
indexDialog.querySelectorAll('.index-chapters a').forEach((link) => {
  const updatePreview = () => {
    document.querySelector('#index-preview-kicker').textContent = `${link.dataset.index} / ${link.querySelector('span').textContent.split('/').slice(1).join('/').trim()}`;
    document.querySelector('#index-title').textContent = link.dataset.title;
    document.querySelector('#index-preview-note').textContent = link.dataset.note;
    indexDialog.querySelectorAll('.index-chapters a').forEach((item) => item.classList.toggle('preview-active', item === link));
  };
  link.addEventListener('pointerenter', updatePreview);
  link.addEventListener('focus', updatePreview);
  link.addEventListener('click', () => indexDialog.close());
});

let revealObserver;
const revealTargets = [...document.querySelectorAll('.reveal, .method')];
if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add('is-visible');
        revealObserver.unobserve(target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' });
  revealTargets.forEach((element) => revealObserver.observe(element));
  document.documentElement.classList.add('reveal-ready');
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}
let revealFallbackFrame = 0;
const revealApproachingContent = () => {
  if (revealObserver || revealFallbackFrame) return;
  revealFallbackFrame = requestAnimationFrame(() => {
    revealFallbackFrame = 0;
    const revealLine = innerHeight * 0.92;
    revealTargets.forEach((element) => {
      if (!element.classList.contains('is-visible') && element.getBoundingClientRect().top <= revealLine) {
        element.classList.add('is-visible');
        revealObserver?.unobserve(element);
      }
    });
  });
};
window.addEventListener('scroll', revealApproachingContent, { passive: true });
window.addEventListener('resize', revealApproachingContent, { passive: true });
revealApproachingContent();
document.addEventListener('focusin', (event) => {
  const target = event.target.closest?.('.reveal');
  if (!target) return;
  target.classList.add('is-visible');
  revealObserver?.unobserve(target);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      document.querySelectorAll('.main-nav a').forEach((link) => link.classList.toggle('current', link.hash === `#${target.id}`));
      document.querySelector('.index-open')?.classList.toggle('current', ['metodo', 'preguntas'].includes(target.id));
    }
  });
}, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const projectCases = {
  shifts: {
    name: 'SHIFTS',
    category: 'PLATAFORMA DE TURNOS / PRODUCTO WEB',
    status: 'CASO DOCUMENTADO',
    summary: 'Plataforma de turnos pensada para distintos tipos de negocios. Separa la gestión del local de la experiencia de reserva del cliente.',
    image: '/media/shifts-poster.jpg',
    imageAlt: 'Vista de acceso y gestión de SHIFTS, plataforma de turnos para negocios',
    gallery: [
      { src: '/media/shifts-01.jpg', alt: 'Pantallas de acceso y creación de cuenta en SHIFTS', caption: 'Dos recorridos: gestionar un negocio o reservar como cliente.' },
      { src: '/media/shifts-02.jpg', alt: 'Formulario de configuración del negocio en SHIFTS', caption: 'Configuración del negocio y sus datos operativos.' },
      { src: '/media/shifts-03.jpg', alt: 'Pantalla de reservas de SHIFTS', caption: 'La experiencia de turnos conecta disponibilidad y reservas.' },
    ],
    contribution: 'La propuesta contempla opciones para configurar el rubro, los servicios, los horarios, los profesionales y las sucursales, adaptando la agenda a distintos tipos de negocio.',
    scope: ['Administración del local', 'Reserva para clientes', 'Rubros, servicios y horarios', 'Profesionales y sucursales'],
    technologies: [],
    tone: 'violet',
    detailTitle: 'Una agenda para cada negocio',
  },
  pediatria: {
    name: 'Portal Pediatría',
    category: 'PORTAL WEB / SISTEMA DE GESTIÓN',
    status: 'CASO DOCUMENTADO',
    summary: 'Portal de trabajo para un consultorio pediátrico. Organiza pacientes, historias clínicas y agenda, con accesos diferenciados para doctora y secretaría.',
    image: '/media/pediatria-poster.jpg',
    imageAlt: 'Vista del panel principal del portal de gestión pediátrica',
    projectUrl: 'https://portal-de-historia-cl-nica-pedi-tri.vercel.app/login',
    gallery: [
      { src: '/media/pediatria-01.jpg', alt: 'Panel principal del portal pediátrico y resumen del consultorio', caption: 'Un panel principal para organizar la jornada.' },
      { src: '/media/pediatria-02.jpg', alt: 'Ficha de paciente y registro de encuentros del portal pediátrico', caption: 'Información del paciente e historial de encuentros.' },
      { src: '/media/pediatria-03.jpg', alt: 'Agenda y gestión de turnos del portal pediátrico', caption: 'Agenda y seguimiento de turnos del consultorio.' },
    ],
    contribution: 'Desarrollo integral del frontend, backend y base de datos. Incluye consulta de pacientes, alta guiada de fichas y gestión de turnos.',
    scope: ['Pacientes e historias clínicas', 'Agenda y turnos', 'Accesos por perfil'],
    technologies: [],
    tone: 'silver',
    detailTitle: 'Un consultorio, en orden',
  },
  facility: {
    name: 'Facility Management',
    category: 'ERP / OPERACIONES',
    status: 'CASO DOCUMENTADO',
    summary: 'Solución de gestión de instalaciones y operaciones desarrollada sobre Odoo, conectando los procesos del negocio con una herramienta ERP.',
    image: '/media/facility-public.png',
    imageAlt: 'Pantalla pública de acceso al sistema Facility Management sobre Odoo',
    projectUrl: 'https://pl.nsnstudio.com/web/login?redirect=%2Fodoo%2Fapps%3F',
    contribution: 'Participación en análisis funcional y desarrollo sobre Odoo, con trabajo en interfaz, lógica de negocio y datos según las necesidades del sistema.',
    scope: ['Análisis funcional', 'Gestión de operaciones', 'Desarrollo sobre Odoo'],
    technologies: ['Odoo'],
    tone: 'green',
    publicNote: 'La vista pública disponible es la pantalla de acceso. También hay experiencia en proyectos Odoo de contabilidad y gestión comunal; los detalles se mantienen generales.',
    detailTitle: 'Procesos de negocio sobre Odoo',
  },
  izipark: {
    name: 'Izipark',
    category: 'PRODUCTO DIGITAL / EN DESARROLLO',
    summary: 'Producto móvil en desarrollo para facilitar la búsqueda de cocheras. La vista disponible muestra un mapa de Rosario, búsqueda por dirección y ubicaciones para explorar.',
    image: '/media/izipark-mobile.png',
    imageAlt: 'Captura del proyecto Izipark en desarrollo',
    contribution: 'La ficha presenta únicamente los elementos visibles de la experiencia en desarrollo, sin exponer detalles funcionales internos que todavía no son públicos.',
    scope: ['Mapa y ubicaciones', 'Búsqueda de cocheras', 'Experiencia móvil'],
    technologies: [],
    tone: 'violet',
    portrait: true,
    status: 'EN DESARROLLO',
    detailTitle: 'Encontrar una cochera, más simple',
  },
  wheelahorra: {
    name: 'Wheelahorra',
    category: 'COMERCIO LOCAL / PLATAFORMA DE PEDIDOS',
    status: 'PRODUCTO LOCAL',
    summary: 'Plataforma de pedidos de cercanía para Wheelwright y localidades donde las grandes aplicaciones de delivery no llegan. Conecta a vecinos con los comercios de su zona bajo una idea simple: comprar cerca y elegir local.',
    image: '/media/wheelahorra-poster.jpg',
    imageAlt: 'Vista de la tienda digital de Wheelahorra con productos de comercios locales',
    gallery: [
      { src: '/media/wheelahorra-01.jpg', alt: 'Tienda digital de Wheelahorra con productos de comercios locales', caption: 'Explorar la oferta de los comercios de Wheelwright.' },
      { src: '/media/wheelahorra-02.jpg', alt: 'Confirmación de compra en Wheelahorra', caption: 'Un flujo de compra pensado para el contexto local.' },
      { src: '/media/wheelahorra-03.jpg', alt: 'Opciones de retiro y entrega para pedidos en Wheelahorra', caption: 'Alternativas de retiro y entrega para los pedidos.' },
    ],
    contribution: 'La experiencia reúne el acceso de clientes y comercios en un mismo canal digital. El proyecto utiliza Odoo y pone el foco en dar visibilidad a la oferta local y acercarla a quienes viven en la zona.',
    scope: ['Comercios de cercanía', 'Pedidos dentro de la localidad', 'Acceso para clientes y comercios'],
    technologies: ['Odoo'],
    tone: 'green',
    detailTitle: 'El comercio local, más cerca',
  },
};

const projectDialog = document.querySelector('#project-detail-dialog');
const projectTrack = document.querySelector('#project-detail-track');
const projectDialogTitle = document.querySelector('#project-detail-title');
const projectBack = document.querySelector('.project-detail-back');
let projectDialogOpener;
let projectCloseTimer;
let projectReturnScrollY = 0;
let projectScrollFrame = 0;

function detailText(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value;
  return node;
}

function makeCasePanel(project, index) {
  const panel = document.createElement('section');
  panel.className = `project-chapter project-chapter-${index === 0 ? 'cover' : 'scope'} tone-${project.tone}${project.portrait && index === 0 ? ' is-portrait' : ''}`;
  panel.setAttribute('aria-label', `${project.name}, ${index === 0 ? 'presentación' : 'trabajo realizado'}`);
  let visual = null;
  if (index === 0) {
    visual = document.createElement('div');
    visual.className = 'project-chapter-visual';
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.imageAlt;
    image.loading = 'eager';
    image.decoding = 'async';
    visual.append(image);
    visual.append(detailText('span', 'project-visual-index', 'TFS / PORTFOLIO'));
  } else if (project.gallery?.length) {
    visual = document.createElement('div');
    visual.className = 'project-chapter-visual project-gallery';
    visual.setAttribute('aria-label', `Capturas del recorrido de ${project.name}`);
    const galleryTrack = document.createElement('div');
    galleryTrack.className = 'project-gallery-track';
    galleryTrack.tabIndex = 0;
    galleryTrack.setAttribute('aria-label', 'Capturas del proyecto. Desplázate horizontalmente para ver más.');
    project.gallery.forEach((frame, frameIndex) => {
      const figure = document.createElement('figure');
      figure.className = 'project-gallery-frame';
      const image = document.createElement('img');
      image.src = frame.src;
      image.alt = frame.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      figure.append(image, detailText('figcaption', '', frame.caption));
      galleryTrack.append(figure);
    });
    visual.append(galleryTrack);
    const galleryHint = detailText('span', 'project-gallery-hint', 'DESLIZÁ PARA EXPLORAR');
    galleryHint.setAttribute('aria-hidden', 'true');
    visual.append(galleryHint);
    visual.append(detailText('span', 'project-visual-index', `TFS / ${String(project.gallery.length).padStart(2, '0')} VISTAS`));
  }

  const copy = document.createElement('div');
  copy.className = 'project-chapter-copy';
  copy.append(detailText('p', 'project-chapter-kicker', index === 0 ? project.category : 'TRABAJO REALIZADO'));
  const title = detailText('h2', `project-chapter-title${project.tone === 'violet' && index === 0 ? ' gradient-project-title' : ''}`, index === 0 ? project.name : (project.detailTitle || 'Alcance y aporte'));
  copy.append(title);
  copy.append(detailText('p', 'project-chapter-summary', index === 0 ? project.summary : project.contribution));
  let detailsButton;
  if (index === 0) {
    detailsButton = detailText('button', 'project-chapter-jump', 'Ver trabajo realizado');
    detailsButton.type = 'button';
    detailsButton.append(detailText('span', '', '→'));
    copy.append(detailsButton);
  }

  const facts = document.createElement('div');
  facts.className = 'project-chapter-facts';
  if (index === 0) {
    facts.append(makeFact('Estado', project.status || 'CASO DOCUMENTADO'));
  } else {
    const scope = document.createElement('div');
    scope.className = 'project-scope-list';
    scope.setAttribute('aria-label', project.technologies.length ? 'Alcance y tecnologías' : 'Alcance');
    project.scope.forEach((item, itemIndex) => {
      const line = document.createElement('span');
      line.append(detailText('i', '', String(itemIndex + 1).padStart(2, '0')));
      line.append(detailText('b', '', item));
      scope.append(line);
    });
    facts.append(scope);
    if (project.technologies.length) {
      const tags = document.createElement('div');
      tags.className = 'project-detail-tags';
      tags.setAttribute('aria-label', 'Tecnologías confirmadas');
      project.technologies.forEach((technology) => tags.append(detailText('span', '', technology)));
      facts.append(tags);
    }
    if (project.publicNote) facts.append(detailText('p', 'project-public-note', project.publicNote));
  }
  copy.append(facts);

  if (index > 0) {
    const actions = document.createElement('div');
    actions.className = 'project-chapter-actions';
    if (project.projectUrl) {
      const link = document.createElement('a');
      link.href = project.projectUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.append(document.createTextNode('Abrir proyecto '));
      link.append(detailText('span', '', '↗'));
      actions.append(link);
    }
    if (project.codeUrl) {
      const link = document.createElement('a');
      link.href = project.codeUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.append(document.createTextNode('Ver código '));
      link.append(detailText('span', '', '↗'));
      actions.append(link);
    }
    if (actions.childElementCount) copy.append(actions);
  }
  if (visual && index === 0) panel.append(visual);
  panel.append(copy);
  if (visual && index > 0) panel.append(visual);
  return panel;
}

function makeProjectCase(project) {
  const article = document.createElement('article');
  article.className = `project-case tone-${project.tone}`;
  article.setAttribute('aria-label', `${project.name}, ficha de proyecto completa`);
  const panels = [makeCasePanel(project, 0), makeCasePanel(project, 1)];
  article.append(...panels);
  panels[0].querySelector('.project-chapter-jump')?.addEventListener('click', () => {
    const targetLeft = projectTrack.scrollLeft + panels[1].getBoundingClientRect().left - projectTrack.getBoundingClientRect().left;
    animateProjectTrackTo(targetLeft);
  });
  if (panels[1].querySelector('.project-gallery-track')) {
    const gallery = panels[1].querySelector('.project-gallery-track');
    gallery.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      event.stopPropagation();
      gallery.scrollBy({ left: event.deltaY, behavior: reducedMotionQuery.matches ? 'auto' : 'smooth' });
    }, { passive: false });
  }
  return article;
}

function makeFact(label, value) {
  const fact = document.createElement('div');
  fact.className = 'project-detail-fact';
  fact.append(detailText('small', '', label), detailText('b', '', value));
  return fact;
}

function updateProjectProgress() {
  const maxScroll = projectTrack.scrollWidth - projectTrack.clientWidth;
  const progress = maxScroll > 0 ? projectTrack.scrollLeft / maxScroll : 0;
  projectDialog.style.setProperty('--case-progress', String(progress));
}

function stopProjectTrackMotion() {
  if (projectScrollFrame) cancelAnimationFrame(projectScrollFrame);
  projectScrollFrame = 0;
  projectTrack.style.removeProperty('scroll-snap-type');
}

function animateProjectTrackTo(targetLeft) {
  stopProjectTrackMotion();
  const maxScroll = Math.max(0, projectTrack.scrollWidth - projectTrack.clientWidth);
  const startLeft = projectTrack.scrollLeft;
  const destination = Math.max(0, Math.min(targetLeft, maxScroll));
  if (reducedMotionQuery.matches || Math.abs(destination - startLeft) < 1) {
    projectTrack.scrollLeft = destination;
    updateProjectProgress();
    return;
  }

  const startedAt = performance.now();
  const duration = 860;
  projectTrack.style.scrollSnapType = 'none';
  const step = (now) => {
    if (!projectDialog.open) {
      stopProjectTrackMotion();
      return;
    }
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = progress < .5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    projectTrack.scrollLeft = startLeft + (destination - startLeft) * eased;
    updateProjectProgress();
    if (progress < 1) {
      projectScrollFrame = requestAnimationFrame(step);
      return;
    }
    projectTrack.scrollLeft = destination;
    stopProjectTrackMotion();
    updateProjectProgress();
  };
  projectScrollFrame = requestAnimationFrame(step);
}

function openProject(projectId, opener) {
  const project = projectCases[projectId];
  if (!project) return;
  pauseProjectPreviews();
  projectDialogTitle.textContent = project.name;
  projectDialogOpener = opener;
  projectReturnScrollY = window.scrollY;
  stopProjectTrackMotion();
  clearTimeout(projectCloseTimer);
  projectTrack.replaceChildren(makeProjectCase(project));
  projectTrack.scrollLeft = 0;
  updateProjectProgress();
  projectDialog.classList.remove('is-closing', 'is-visible');
  if (!projectDialog.open) projectDialog.showModal();
  requestAnimationFrame(() => {
    if (!projectDialog.open || projectDialog.classList.contains('is-closing')) return;
    projectDialog.classList.add('is-visible');
    projectTrack.focus({ preventScroll: true });
    updateProjectProgress();
  });
}

function closeProject() {
  if (!projectDialog.open || projectDialog.classList.contains('is-closing')) return;
  stopProjectTrackMotion();
  projectDialog.classList.remove('is-visible');
  projectDialog.classList.add('is-closing');
  projectCloseTimer = window.setTimeout(() => {
    if (projectDialog.open) projectDialog.close();
  }, reducedMotionQuery.matches ? 0 : 430);
}

function pauseProjectPreviews() {
  document.querySelectorAll('[data-project-preview]').forEach((video) => video.pause());
}

function resumeProjectPreviews() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-project-preview]').forEach((video) => {
    const bounds = video.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth) {
      video.play().catch(() => {});
    }
  });
}

document.querySelectorAll('[data-open-project]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    if (trigger instanceof HTMLAnchorElement) event.preventDefault();
    openProject(trigger.dataset.openProject, trigger);
  });
});
projectBack.addEventListener('click', closeProject);
projectDialog.addEventListener('cancel', (event) => { event.preventDefault(); closeProject(); });
projectDialog.addEventListener('click', (event) => { if (event.target === projectDialog) closeProject(); });
projectDialog.addEventListener('close', () => {
  projectDialog.classList.remove('is-closing', 'is-visible');
  projectDialogOpener?.focus({ preventScroll: true });
  window.scrollTo(window.scrollX, projectReturnScrollY);
  resumeProjectPreviews();
});
projectTrack.addEventListener('scroll', updateProjectProgress, { passive: true });
projectTrack.addEventListener('wheel', (event) => {
  if (!projectDialog.open) return;
  if (matchMedia('(max-width: 760px)').matches && Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;
  const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (!rawDelta) return;
  event.preventDefault();
  if (projectScrollFrame) return;
  const chapterWidth = projectTrack.clientWidth;
  const chapterIndex = Math.round(projectTrack.scrollLeft / chapterWidth);
  animateProjectTrackTo((chapterIndex + Math.sign(rawDelta)) * chapterWidth);
}, { passive: false });

const faqItems = [...document.querySelectorAll('.faq-item')];
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.filter((other) => other !== item).forEach((other) => { other.open = false; });
  });
  const summary = item.querySelector('summary');
  summary?.addEventListener('click', (event) => {
    event.preventDefault();
    const willOpen = !item.open;
    faqItems.forEach((other) => { other.open = false; });
    item.open = willOpen;
  });
});

const teamPrism = document.querySelector('.core-assembly');
if (teamPrism) {
  let flipped = false;
  let flipTween;
  let flipAngle = 0;
  let gsapModule;
  const flip = () => {
    flipped = !flipped;
    flipAngle += 180;
    teamPrism.setAttribute('aria-pressed', String(flipped));
    teamPrism.classList.toggle('is-flipped', flipped);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      teamPrism.style.transform = `translate(-50%,-50%) rotateX(-9deg) rotateY(${flipAngle}deg)`;
      return;
    }
    gsapModule ||= import('gsap');
    gsapModule.then(({ gsap }) => {
      flipTween?.kill();
      flipTween = gsap.to(teamPrism, {
        rotationY: flipAngle,
        rotationX: -9,
        duration: 1.15,
        ease: 'power3.inOut',
        overwrite: true,
      });
    }).catch(() => {});
  };
  teamPrism.addEventListener('click', flip);
  teamPrism.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flip();
    }
  });
}

const sheenCards = document.querySelectorAll('.sheen-card');
sheenCards.forEach((card) => {
  let queued = false;
  let point;
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || queued) return;
    point = event;
    queued = true;
    requestAnimationFrame(() => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--shine-x', `${point.clientX - bounds.left}px`);
      card.style.setProperty('--shine-y', `${point.clientY - bounds.top}px`);
      queued = false;
    });
  }, { passive: true });
});

const projectPreviewVideos = [...document.querySelectorAll('[data-project-preview]')];
const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const stopProjectPreview = (video) => {
  video.pause();
  try { video.currentTime = 0; } catch {}
};
if ('IntersectionObserver' in window && !reducedMotionQuery.matches) {
  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      const video = target;
      if (isIntersecting) {
        if (projectDialog.open) {
          stopProjectPreview(video);
          return;
        }
        video.querySelectorAll('source[data-src]').forEach((source) => {
          source.src = source.dataset.src;
          source.removeAttribute('data-src');
        });
        if (video.readyState === 0) video.load();
        video.play().catch(() => {});
      } else stopProjectPreview(video);
    });
  }, { threshold: 0.35, rootMargin: '100px' });
  projectPreviewVideos.forEach((video) => previewObserver.observe(video));
} else {
  projectPreviewVideos.forEach(stopProjectPreview);
}

let disposeMotion;
let motionRequested = false;
const desktopMotionQuery = matchMedia('(min-width: 900px) and (pointer: fine)');
const requestMotion = () => {
  if (motionRequested || reducedMotionQuery.matches || !desktopMotionQuery.matches || navigator.connection?.saveData) return;
  motionRequested = true;
  const load = () => import('./motion.js')
    .then(({ mountMotion }) => { disposeMotion = mountMotion(); })
    .catch(() => {
      motionRequested = false;
      document.documentElement.classList.remove('gsap-scroll-ready');
    });
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 1200 });
  else window.setTimeout(load, 80);
};
window.addEventListener('pagehide', () => {
  disposeMotion?.();
  disposeMotion = undefined;
  motionRequested = false;
});
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  revealApproachingContent();
  if (document.body.classList.contains('ready')) requestMotion();
});

const form = document.querySelector('#contact-form');
const copyInquiry = document.querySelector('#copy-inquiry');
const interestSelect = document.querySelector('#interest');
const interestTrigger = document.querySelector('#interest-trigger');
const interestOptions = document.querySelector('#interest-options');
const interestValue = document.querySelector('.interest-value');
const interestError = document.querySelector('.interest-error');
const interestChoices = [...interestSelect.options].filter((option) => !option.disabled && option.value);
let activeInterest = 0;
let interestCloseTimer;
let interestTypeahead = '';
let interestTypeaheadTimer;

interestChoices.forEach((choice, index) => {
  const option = document.createElement('div');
  option.className = 'interest-option';
  option.id = `interest-option-${index}`;
  option.setAttribute('role', 'option');
  option.setAttribute('aria-selected', 'false');
  option.tabIndex = -1;
  option.innerHTML = `<span class="interest-option-index">0${index + 1}</span><b></b><i aria-hidden="true">↗</i>`;
  option.querySelector('b').textContent = choice.textContent;
  option.addEventListener('click', () => chooseInterest(index));
  interestOptions.append(option);
});

function syncInterestOptions() {
  [...interestOptions.children].forEach((option, index) => {
    const selected = interestChoices[index].value === interestSelect.value;
    option.setAttribute('aria-selected', String(selected));
    option.tabIndex = index === activeInterest ? 0 : -1;
  });
}

function openInterestOptions() {
  clearTimeout(interestCloseTimer);
  interestOptions.hidden = false;
  activeInterest = Math.max(0, interestChoices.findIndex((choice) => choice.value === interestSelect.value));
  syncInterestOptions();
  interestTrigger.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => interestOptions.classList.add('is-open'));
}

function closeInterestOptions({ returnFocus = false } = {}) {
  interestTrigger.setAttribute('aria-expanded', 'false');
  interestOptions.classList.remove('is-open');
  interestCloseTimer = setTimeout(() => { interestOptions.hidden = true; }, 220);
  if (returnFocus) interestTrigger.focus();
}

function chooseInterest(index) {
  const choice = interestChoices[index];
  if (!choice) return;
  interestSelect.value = choice.value;
  interestValue.textContent = choice.textContent;
  interestError.textContent = '';
  interestSelect.dispatchEvent(new Event('change', { bubbles: true }));
  syncInterestOptions();
  closeInterestOptions({ returnFocus: true });
}

interestTrigger.addEventListener('click', () => {
  if (interestTrigger.getAttribute('aria-expanded') === 'true') closeInterestOptions();
  else {
    openInterestOptions();
    requestAnimationFrame(() => interestOptions.children[activeInterest]?.focus());
  }
});
interestTrigger.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault();
  const wasOpen = interestTrigger.getAttribute('aria-expanded') === 'true';
  openInterestOptions();
  if (wasOpen && event.key === 'ArrowDown') activeInterest = Math.min(activeInterest + 1, interestChoices.length - 1);
  if (wasOpen && event.key === 'ArrowUp') activeInterest = Math.max(activeInterest - 1, 0);
  syncInterestOptions();
  interestOptions.children[activeInterest]?.focus();
});
interestOptions.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { event.preventDefault(); closeInterestOptions({ returnFocus: true }); return; }
  if (event.key === 'Tab') { closeInterestOptions(); return; }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    activeInterest = (activeInterest + (event.key === 'ArrowDown' ? 1 : -1) + interestChoices.length) % interestChoices.length;
    syncInterestOptions();
    interestOptions.children[activeInterest]?.focus();
    return;
  }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    activeInterest = event.key === 'Home' ? 0 : interestChoices.length - 1;
    syncInterestOptions();
    interestOptions.children[activeInterest]?.focus();
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    chooseInterest(activeInterest);
    return;
  }
  if (/^[\p{L}\p{N}]$/u.test(event.key) && !event.altKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    interestTypeahead += event.key.toLocaleLowerCase('es-AR');
    window.clearTimeout(interestTypeaheadTimer);
    interestTypeaheadTimer = window.setTimeout(() => { interestTypeahead = ''; }, 700);
    const start = (activeInterest + 1) % interestChoices.length;
    const match = Array.from({ length: interestChoices.length }, (_, offset) => (start + offset) % interestChoices.length)
      .find((index) => interestChoices[index].textContent.trim().toLocaleLowerCase('es-AR').startsWith(interestTypeahead));
    if (match !== undefined) {
      activeInterest = match;
      syncInterestOptions();
      interestOptions.children[activeInterest]?.focus();
    }
  }
});
interestSelect.addEventListener('invalid', (event) => {
  event.preventDefault();
  interestError.textContent = 'Elegí el tipo de proyecto para continuar.';
  interestTrigger.setAttribute('aria-invalid', 'true');
  interestTrigger.focus();
});
interestSelect.addEventListener('change', () => interestTrigger.removeAttribute('aria-invalid'));
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.interest-field') && interestTrigger.getAttribute('aria-expanded') === 'true') closeInterestOptions();
});
const progressSegments = [...document.querySelectorAll('.form-progress span')];
const updateFormProgress = () => {
  const fields = [...form.querySelectorAll('input,select,textarea')];
  const completed = fields.filter((field) => field.value.trim() && field.checkValidity()).length;
  progressSegments.forEach((segment, index) => segment.classList.toggle('complete', index < completed));
};
form.addEventListener('input', updateFormProgress);
form.addEventListener('change', updateFormProgress);
const createMailDraft = () => {
  const data = new FormData(form);
  const subject = `Consulta ${brand.name} — ${data.get('interest')}`;
  const body = `Hola,\n\nMi nombre: ${data.get('name')}\nEmail: ${data.get('email')}\nInterés: ${data.get('interest')}\n\n${data.get('message')}\n\nSaludos.`;
  return { subject, body, text: `Para: ${brand.email}\nAsunto: ${subject}\n\n${body}` };
};
const copyText = async (text) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('No se pudo copiar al portapapeles.');
};
copyInquiry.addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  try {
    const { text } = createMailDraft();
    await copyText(text);
    document.querySelector('.form-status').textContent = 'Consulta copiada. Pegala en el canal de contacto que prefieras.';
  } catch {
    document.querySelector('.form-status').textContent = `No pude copiarla. Escribinos a ${brand.email}.`;
  }
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const { subject, body } = createMailDraft();
  document.querySelector('.form-status').textContent = 'Se abrirá tu aplicación de correo para que revises y envíes la consulta.';
  window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = document.querySelector('.preloader');
const introBackground = [
  document.querySelector('.skip-link'),
  document.querySelector('.site-header'),
  document.querySelector('#studio-index'),
  document.querySelector('#main'),
  document.querySelector('.site-footer'),
].filter(Boolean);
let introFrame = 0;
let introTimer = 0;
let introFinished = false;
const hideLoader = () => {
  if (introFinished) return;
  introFinished = true;
  cancelAnimationFrame(introFrame);
  clearTimeout(introTimer);
  loader.classList.add('preloader-done');
  introBackground.forEach((element) => { element.inert = false; });
  document.body.classList.remove('intro-active');
  document.documentElement.classList.remove('intro-active');
  document.body.classList.add('ready');
  requestMotion();
};
document.querySelector('.skip-intro').addEventListener('click', hideLoader);
if (prefersReduced) hideLoader();
else {
  introBackground.forEach((element) => { element.inert = true; });
  document.body.classList.add('intro-active');
  document.documentElement.classList.add('intro-active');
  loader.classList.add('intro-playing');
  const counter = document.querySelector('.load-count');
  const track = document.querySelector('.preloader-track i');
  const start = performance.now();
  const duration = 3500;
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    counter.textContent = String(Math.round(progress * 100)).padStart(2, '0');
    track.style.transform = `scaleX(${progress})`;
    if (progress < 1 && !introFinished) introFrame = requestAnimationFrame(tick);
  };
  introFrame = requestAnimationFrame(tick);
  introTimer = window.setTimeout(hideLoader, duration);
}
