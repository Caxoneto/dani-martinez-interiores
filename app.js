/**
 * DANI MARTÍNEZ - SOLUCIONES EN INTERIORES
 * App JavaScript - Interacciones, Slider Antes/Después & Calculadora Express
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initProjectTabs();
  initBudgetCalculator();
  initMobileMenu();
  initScrollEffects();
});

/* ==========================================================================
   1. Slider Interactivo Antes / Después
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSlider');
  const afterLayer = document.getElementById('baAfterLayer');
  const handle = document.getElementById('baHandle');
  const imgAfter = document.getElementById('imgAfter');

  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  // Sync width of internal image to match outer container width
  function updateImageWidth() {
    const containerWidth = container.offsetWidth;
    if (imgAfter) {
      imgAfter.style.width = `${containerWidth}px`;
    }
  }

  updateImageWidth();
  window.addEventListener('resize', updateImageWidth);

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let position = x - rect.left;

    // Clamp between 0 and container width
    if (position < 0) position = 0;
    if (position > rect.width) position = rect.width;

    const percentage = (position / rect.width) * 100;
    afterLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Pointer Events (Mouse)
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events (Mobile) - Optimizado sin scroll indebido
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault(); // Evita el scroll o arrastre de la web al usar el slider
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   2. Selector de Proyectos (Tabs)
   ========================================================================== */
const projectData = {
  '1': {
    title: 'Reforma Completa de Salón: Gotelé a Perlita + Foseado de Pladur',
    tag: 'Pladur & Perlita',
    beforeImg: 'assets/images/before_1.jpg?v=2026',
    afterImg: 'assets/images/after_1.jpg?v=2026',
    desc: 'Eliminación completa de gotelé viejo en paredes, proyectado de perlita blanca fina alisada al espejo y creación de falso techo suspendido de pladur con foseado perimetral e iluminación indirecta cálida LED.',
    time: '4 días',
    scope: 'Lucido total + Techo foseado LED'
  },
  '2': {
    title: 'Muebles de Escayola de Obra & Hornacinas Iluminadas con LED',
    tag: 'Escayola & Iluminación LED',
    beforeImg: 'assets/images/before_2.jpg?v=2026',
    afterImg: 'assets/images/after_2.jpg?v=2026',
    desc: 'Creación de muebles de obra de escayola fina y pladur a medida con hornacinas iluminadas por tiras LED cálidas en el hueco bajo la escalera flotante y en la pared de fondo del salón.',
    time: '4 días',
    scope: 'Mueble bajo escalera + Pared comedor'
  },
  '3': {
    title: 'Transformación de Master Suite: Alisado Perlita Espejo',
    tag: 'Perlita Espejo & Decoración',
    beforeImg: 'assets/images/before_3.jpg?v=2026',
    afterImg: 'assets/images/after_3.jpg?v=2026',
    desc: 'Eliminación completa de paneles de madera oscura y cabecero antiguo en la pared principal, sustituidos por un lucido continuo en perlita espejo de alto brillo seda, foseado LED y mesitas flotantes.',
    time: '3 días',
    scope: 'Retirada madera + Perlita Espejo'
  }
};

function initProjectTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const imgBefore = document.getElementById('imgBefore');
  const imgAfter = document.getElementById('imgAfter');
  const projectTitle = document.getElementById('projectTitle');
  const projectTag = document.getElementById('projectTag');
  const projectDesc = document.getElementById('projectDesc');
  const projectTime = document.getElementById('projectTime');
  const projectScope = document.getElementById('projectScope');
  const container = document.getElementById('baSlider');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const projectId = tab.getAttribute('data-project');
      const data = projectData[projectId];

      if (!data) return;

      // Transition effects
      if (container) container.style.opacity = '0.4';

      setTimeout(() => {
        if (imgBefore) imgBefore.src = data.beforeImg;
        if (imgAfter) imgAfter.src = data.afterImg;
        if (projectTitle) projectTitle.textContent = data.title;
        if (projectTag) projectTag.textContent = data.tag;
        if (projectDesc) projectDesc.textContent = data.desc;
        if (projectTime) projectTime.textContent = data.time;
        if (projectScope) projectScope.textContent = data.scope;

        if (container) container.style.opacity = '1';
      }, 150);
    });
  });
}

/* ==========================================================================
   3. Calculadora Express de Presupuesto (Algoritmo Completo Costa del Sol)
   ========================================================================== */
function initBudgetCalculator() {
  const serviceOptions = document.querySelectorAll('.calc-opt');
  const m2Range = document.getElementById('m2Range');
  const m2Value = document.getElementById('m2Value');
  const totalEstimate = document.getElementById('totalEstimate');
  const unitLabel = document.getElementById('unitLabel');
  const bMat = document.getElementById('bMat');
  const bLabor = document.getElementById('bLabor');
  const bDisp = document.getElementById('bDisp');
  const whatsappCalcBtn = document.getElementById('whatsappCalcBtn');
  const guideItems = document.querySelectorAll('.guide-item');

  if (!m2Range || !totalEstimate) return;

  // Initial params
  let currentMatRate = 4;      // Coste material / m²
  let currentLaborRate = 12;   // Coste mano de obra / m²
  let currentDispCost = 60;    // Desplazamiento & logística base
  let currentUnit = 'm² de pared/techo';
  let currentServiceName = 'Alisado de Perlita (Quitar Gotelé)';
  const MARGEN_BENEFICIO_INTERNO = 1.22; // 22% beneficio industrial interno en la fórmula

  function calculate() {
    const qty = parseInt(m2Range.value, 10);

    // Algoritmo de cálculo completo:
    // Base Directa = (m² * Coste Materiales) + (m² * Mano Obra) + Desplazamiento
    // Total Orientativo = Base Directa * Margen Industrial Interno
    const rawMat = qty * currentMatRate;
    const rawLabor = qty * currentLaborRate;
    const rawDisp = currentDispCost;

    const baseCost = rawMat + rawLabor + rawDisp;
    const total = Math.round(baseCost * MARGEN_BENEFICIO_INTERNO);

    // Desglose público visual (materiales 1ª marca, mano de obra artesana y logística)
    const matDisplay = Math.round(rawMat * MARGEN_BENEFICIO_INTERNO);
    const laborDisplay = Math.round(rawLabor * MARGEN_BENEFICIO_INTERNO);
    const dispDisplay = Math.round(rawDisp * MARGEN_BENEFICIO_INTERNO);

    m2Value.textContent = `${qty} ${currentUnit.includes('ml') ? 'ml' : 'm²'}`;
    totalEstimate.textContent = `${total.toLocaleString('es-ES')} €`;

    if (bMat) bMat.textContent = `~${matDisplay.toLocaleString('es-ES')} €`;
    if (bLabor) bLabor.textContent = `~${laborDisplay.toLocaleString('es-ES')} €`;
    if (bDisp) bDisp.textContent = `~${dispDisplay.toLocaleString('es-ES')} €`;

    if (unitLabel) unitLabel.textContent = currentUnit;

    // Highlight active guide item
    guideItems.forEach(item => {
      const val = parseInt(item.getAttribute('data-val'), 10);
      if (Math.abs(qty - val) < 15) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Construct WhatsApp message with location reference to San Pedro Alcántara / Costa del Sol
    const phone = '34695456141';
    const message = `Hola Dani Martínez! He calculado un presupuesto aproximado en tu web para un trabajo en la zona de San Pedro Alcántara / Costa del Sol:\n\n📌 *Servicio:* ${currentServiceName}\n📐 *Medida:* ${qty} ${currentUnit}\n💰 *Estimación:* ${total.toLocaleString('es-ES')} €\n\n¿Cuándo podrías hacer una visita e inspección técnica gratuita?`;
    
    if (whatsappCalcBtn) {
      whatsappCalcBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }
  }

  // Service Option selection
  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      currentMatRate = parseFloat(opt.getAttribute('data-mat')) || 4;
      currentLaborRate = parseFloat(opt.getAttribute('data-labor')) || 12;
      currentDispCost = parseFloat(opt.getAttribute('data-disp')) || 60;
      currentUnit = opt.getAttribute('data-unit') || 'm²';
      currentServiceName = opt.getAttribute('data-service');
      calculate();
    });
  });

  // Slider change
  m2Range.addEventListener('input', calculate);

  // Quick space reference badges click
  guideItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetVal = item.getAttribute('data-val');
      if (targetVal) {
        m2Range.value = targetVal;
        calculate();
      }
    });
  });

  // Initial calculation
  calculate();
}

/* ==========================================================================
   4. Menú Móvil & Efectos Scroll
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isVisible = menu.style.display === 'flex';
      menu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        menu.style.flexDirection = 'column';
        menu.style.position = 'absolute';
        menu.style.top = '80px';
        menu.style.left = '0';
        menu.style.right = '0';
        menu.style.background = 'var(--dark-card)';
        menu.style.padding = '2rem';
        menu.style.borderBottom = '1px solid var(--dark-border)';
      }
    });
  }
}

function initScrollEffects() {
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}
