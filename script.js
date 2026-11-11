const services = [
  {
    kicker: 'Диагностика',
    title: 'Диагностика автомобиля',
    description: 'Проверка электронных и механических систем, чтобы определить причину неисправности и понять, какие работы действительно нужны.',
    items: ['Компьютерная диагностика автомобиля', 'Выездная диагностика автомобиля', 'Эндоскопия двигателя']
  },
  {
    kicker: 'Двигатель',
    title: 'Ремонт двигателя',
    description: 'Работы по диагностике и ремонту двигателя, а также обслуживание связанных с ним узлов.',
    items: ['Ремонт двигателя', 'Замена ремня ГРМ', 'Ремонт карбюраторов']
  },
  {
    kicker: 'Трансмиссия',
    title: 'Сцепление и карданные валы',
    description: 'Обслуживание и ремонт отдельных элементов трансмиссии. Конкретный перечень работ лучше уточнить по телефону.',
    items: ['Ремонт сцепления', 'Ремонт карданных валов']
  },
  {
    kicker: 'Ходовая часть',
    title: 'Ремонт подвески и ходовой',
    description: 'Поиск неисправностей и ремонт элементов ходовой части, влияющих на устойчивость, управляемость и комфорт движения.',
    items: ['Ремонт ходовой части', 'Ремонт амортизаторов', 'Ремонт шаровых опор']
  },
  {
    kicker: 'Тормозная система',
    title: 'Ремонт тормозной системы',
    description: 'Работы по восстановлению исправности тормозной системы. Состав ремонта определяется после проверки автомобиля.',
    items: ['Ремонт тормозной системы']
  },
  {
    kicker: 'Электрооборудование',
    title: 'Автоэлектрика и электроника',
    description: 'Диагностика и ремонт электрических и электронных компонентов автомобиля.',
    items: ['Ремонт автоэлектроники', 'Ремонт генераторов', 'Ремонт стартеров', 'Ремонт фар', 'Работы с подушками безопасности']
  },
  {
    kicker: 'Охлаждение и климат',
    title: 'Кондиционер и система охлаждения',
    description: 'Обслуживание систем, отвечающих за охлаждение двигателя и комфортную температуру в салоне.',
    items: ['Заправка и ремонт автокондиционера', 'Ремонт авторадиаторов', 'Ремонт системы охлаждения']
  },
  {
    kicker: 'Кузовные работы',
    title: 'Восстановление кузова',
    description: 'Работы с кузовными и пластиковыми элементами, а также восстановление внешнего вида автомобиля.',
    items: ['Восстановление после ДТП', 'Ремонт пластиковых бамперов', 'Полировка', 'Сварочные работы']
  },
  {
    kicker: 'Обслуживание',
    title: 'Техническое обслуживание',
    description: 'Плановые сервисные работы и замена расходных материалов для поддержания автомобиля в исправном состоянии.',
    items: ['Полное сервисное обслуживание', 'Замена масла', 'Запчасти и комплектующие под заказ']
  },
  {
    kicker: 'Выхлопная система',
    title: 'Ремонт выхлопной системы',
    description: 'Работы с элементами выхлопной системы и каталитическим нейтрализатором.',
    items: ['Ремонт выхлопной системы', 'Ремонт катализаторов', 'Удаление катализаторов']
  },
  {
    kicker: 'Дополнительное оснащение',
    title: 'Оборудование и комфорт',
    description: 'Установка дополнительного оборудования и работы, направленные на расширение возможностей и комфорта автомобиля.',
    items: ['Установка дополнительного оборудования', 'Установка парктроника', 'Установка фаркопа', 'Чип-тюнинг', 'Шумоизоляция']
  }
];


const orbit = document.getElementById('orbitItems');
const rotor = document.querySelector('.wheel-rotor');
const viewport = document.querySelector('.wheel-viewport');
const panelContent = document.querySelector('.panel-content');
const serviceNumber = document.getElementById('serviceNumber');
const serviceKicker = document.getElementById('serviceKicker');
const serviceTitle = document.getElementById('serviceTitle');
const serviceDescription = document.getElementById('serviceDescription');
const serviceList = document.getElementById('serviceList');
const serviceCount = document.getElementById('serviceCount');
const panelIndex = document.getElementById('panelIndex');

const step = 360 / services.length;
let rotation = 0;
let activeIndex = 0;
let renderedIndex = -1;
let lastRotation = 0;
let pointerStartAngle = 0;
let rotationStart = 0;
let isDragging = false;
let snapTimer = null;
const buttons = [];

services.forEach((service, index) => {
  const point = document.createElement('div');
  point.className = 'orbit-point';
  point.style.setProperty('--angle', `${index * step}deg`);

  const button = document.createElement('button');
  button.className = 'orbit-item';
  button.type = 'button';
  button.setAttribute('aria-label', service.title);
  button.dataset.index = String(index);
  button.innerHTML = `<span class="orbit-label">${service.kicker}</span>`;
  button.addEventListener('click', () => selectService(index));

  point.appendChild(button);
  orbit.appendChild(point);
  buttons.push(button);
});

function normalizeAngle(angle) {
  return ((angle + 180) % 360 + 360) % 360 - 180;
}

function findActiveIndex() {
  let nearest = 0;
  let nearestDistance = Infinity;

  services.forEach((_, index) => {
    const distance = Math.abs(normalizeAngle(index * step + rotation));
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = index;
    }
  });

  return nearest;
}

function renderPanel(index, direction = 1) {
  const service = services[index];
  const enterClass = direction >= 0 ? 'panel-from-right' : 'panel-from-left';

  panelContent.classList.remove('panel-from-right', 'panel-from-left');
  void panelContent.offsetWidth;
  panelContent.classList.add(enterClass);

  serviceNumber.textContent = `${String(index + 1).padStart(2, '0')} / ${String(services.length).padStart(2, '0')}`;
  serviceKicker.textContent = service.kicker;
  serviceTitle.textContent = service.title;
  serviceDescription.textContent = service.description;
  panelIndex.textContent = String(index + 1).padStart(2, '0');

  serviceList.innerHTML = '';
  if (serviceCount) {
    serviceCount.textContent = `В СПИСКЕ: ${String(service.items.length).padStart(2, '0')}`;
  }
  service.items.forEach((item, itemIndex) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.setProperty('--item-delay', `${itemIndex * 28}ms`);
    li.style.setProperty('--item-from-x', direction >= 0 ? '14px' : '-14px');
    serviceList.appendChild(li);
  });
}

function updateWheel() {
  const previousRotation = lastRotation;
  rotor.style.setProperty('--rotation', `${rotation}deg`);

  activeIndex = findActiveIndex();

  buttons.forEach((button, index) => {
    const currentAngle = normalizeAngle(index * step + rotation);
    const cos = Math.cos(currentAngle * Math.PI / 180);

    // Labels remain attached to the same point on the tyre. Their horizontal
    // offset changes continuously, so they never flip sides or jump vertically.
    if (window.matchMedia('(max-width: 760px)').matches) {
      // Center each chip on its own point on the lower tyre arc. Alternate two
      // nearby radii to keep neighbouring names separated without clustering
      // them across the middle of the wheel.
      const radiusInset = index % 2 === 0 ? 30 : 58;
      button.style.setProperty('--label-shift', '-50%');
      button.style.setProperty(
        '--item-orbit-radius',
        `calc(var(--mobile-tire-size) / 2 - ${radiusInset}px)`
      );
    } else {
      button.style.removeProperty('--item-orbit-radius');
      const labelOffset = Math.max(0, Math.min(1, cos));
      button.style.setProperty('--label-shift', `${(-labelOffset * 100).toFixed(2)}%`);
    }

    button.classList.toggle('is-active', index === activeIndex);
    button.setAttribute('aria-pressed', index === activeIndex ? 'true' : 'false');
  });

  if (activeIndex !== renderedIndex) {
    // Negative rotor rotation advances the catalogue clockwise through its items.
    // The information panel enters horizontally in the same travel direction.
    const direction = rotation - previousRotation <= 0 ? 1 : -1;
    renderPanel(activeIndex, direction);
    renderedIndex = activeIndex;
  }

  lastRotation = rotation;
}

function snapToNearest() {
  rotation = Math.round(rotation / step) * step;
  updateWheel();
}

function queueSnap() {
  clearTimeout(snapTimer);
  snapTimer = setTimeout(snapToNearest, 170);
}

function selectService(index) {
  clearTimeout(snapTimer);
  const targetRotation = -index * step;
  // Choose the nearest equivalent full-turn angle, avoiding almost-360° jumps.
  rotation = targetRotation + Math.round((rotation - targetRotation) / 360) * 360;
  updateWheel();
}

function getPointerAngle(event) {
  // Read the actual rotor center. On mobile the wheel is slightly inset and
  // fluidly scaled, so using viewport.left would make touch rotation drift.
  const rect = rotor.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
}

viewport.addEventListener('wheel', event => {
  event.preventDefault();
  rotation -= event.deltaY * 0.25;
  updateWheel();
  queueSnap();
}, { passive: false });

viewport.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;

  isDragging = true;
  pointerStartAngle = getPointerAngle(event);
  rotationStart = rotation;
  clearTimeout(snapTimer);

  try {
    // Capture on the pressed service button when applicable, so its click
    // event remains intact; otherwise capture on the viewport for free dragging.
    const captureTarget = event.target.closest('.orbit-item') || viewport;
    captureTarget.setPointerCapture(event.pointerId);
  } catch (_) {
    // Pointer capture is not available in every embedded browser.
  }
});

viewport.addEventListener('pointermove', event => {
  if (!isDragging) return;

  const angleDelta = normalizeAngle(getPointerAngle(event) - pointerStartAngle);
  rotation = rotationStart + angleDelta;
  updateWheel();
});

function finishDrag() {
  if (!isDragging) return;
  isDragging = false;
  queueSnap();
}

viewport.addEventListener('pointerup', finishDrag);
viewport.addEventListener('pointercancel', finishDrag);
viewport.addEventListener('lostpointercapture', finishDrag);

viewport.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault();
    selectService((activeIndex + 1) % services.length);
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault();
    selectService((activeIndex - 1 + services.length) % services.length);
  }
});

updateWheel();


// First-load intro uses the SAME hero image that remains on the page.
// It travels from outside the hero, crosses the headline, and settles at the exact
// measured final position and size. No duplicate image or end-of-animation swap.
(function initHeroCarIntro() {
  const body = document.body;
  const hero = document.querySelector('.hero');
  const heading = document.querySelector('.hero h1');
  const heroVisual = document.querySelector('.hero-visual');
  const heroCar = document.querySelector('.hero-car');
  const scene = document.querySelector('.hero-drive-scene');
  const svg = document.querySelector('.drive-tracks-svg');
  if (!body || !hero || !heading || !heroVisual || !heroCar || !scene || !svg) return;

  let movedToScene = false;
  let settled = false;
  let carAnimation = null;
  let safetyTimer = null;
  let trackAnimations = [];
  let tracksPending = false;
  let orientationHandler = null;

  const settleAtFinalLayout = (keepTracks = false) => {
    if (settled) return;
    settled = true;
    if (safetyTimer) window.clearTimeout(safetyTimer);

    // Scrolling never cancels the intro. Only a real device rotation ends it,
    // because the measured parking position is no longer valid after rotation.
    if (orientationHandler) {
      window.removeEventListener('orientationchange', orientationHandler);
      orientationHandler = null;
    }

    if (carAnimation) {
      try { carAnimation.cancel(); } catch (_) {}
      carAnimation = null;
    }

    if (movedToScene && heroCar.parentElement !== heroVisual) {
      heroVisual.appendChild(heroCar);
      heroCar.removeAttribute('style');
    } else {
      heroCar.style.opacity = '1';
    }

    if (!keepTracks) {
      trackAnimations.forEach(animation => { try { animation.cancel(); } catch (_) {} });
      tracksPending = false;
      scene.classList.add('is-hidden');
    } else if (!tracksPending) {
      scene.classList.add('is-hidden');
    }
    body.classList.remove('intro-pending');
    body.classList.add('intro-done');
  };

  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !heroCar.animate) {
    settleAtFinalLayout();
    return;
  }

  const fmt = value => Number(value.toFixed(2));
  const cubicPoint = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    const uu = u * u;
    const tt = t * t;
    return {
      x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
      y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y
    };
  };

  const start = async () => {
    try {
      if (heroCar.decode) await heroCar.decode();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (settled) return;

      const heroRect = hero.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const visualRect = heroVisual.getBoundingClientRect();
      const finalRect = heroCar.getBoundingClientRect();
      const heroWidth = heroRect.width;
      const heroHeight = heroRect.height;
      const carWidth = finalRect.width;
      const carHeight = finalRect.height;
      if (!heroWidth || !heroHeight || !carWidth || !carHeight) {
        settleAtFinalLayout();
        return;
      }

      const mobile = window.matchMedia('(max-width: 760px)').matches;
      // On mobile, animate in the image's real parent (.hero-visual). This
      // removes coordinate drift caused by moving the image between containers.
      const animationOrigin = mobile ? visualRect : heroRect;
      const animationWidth = mobile ? visualRect.width : heroWidth;
      const animationHeight = mobile ? visualRect.height : heroHeight;
      const finalLeft = finalRect.left - animationOrigin.left;
      const finalTop = finalRect.top - animationOrigin.top;
      const finalCenter = {
        x: finalLeft + carWidth / 2,
        y: finalTop + carHeight / 2
      };

      let p0, p1, p2, p3;
      let duration;

      if (mobile) {
        // Mobile layout stacks the copy above the visual card. A diagonal dive
        // from the heading into the card looks physically impossible, so the
        // car now enters at the visual card's own height and drives straight
        // along its horizontal centreline into the exact final parking slot.
        const startX = -carWidth * 0.58;
        // Keep the whole route on the final image centreline so the last
        // animation frame is exactly transform: translate(0, 0).
        p0 = { x: startX, y: finalCenter.y };
        p1 = { x: startX + (finalCenter.x - startX) * 0.32, y: finalCenter.y };
        p2 = { x: startX + (finalCenter.x - startX) * 0.72, y: finalCenter.y };
        p3 = { x: finalCenter.x, y: finalCenter.y };
        duration = 4300;
      } else {
        // Desktop: use a straight, believable approach line instead of a bowed arc.
        // The car enters from the left and travels on one clean diagonal line to
        // the final parking position.
        const headingTop = headingRect.top - heroRect.top;
        const headingHeight = headingRect.height;
        const laneY = headingTop + headingHeight * 0.58;
        const startX = -carWidth * 0.56;
        p0 = { x: startX, y: laneY };
        // Keep all control points on the same line from start to finish so the
        // cubic Bézier collapses into a visually straight path.
        p1 = {
          x: startX + (finalCenter.x - startX) * 0.34,
          y: laneY + (finalCenter.y - laneY) * 0.34
        };
        p2 = {
          x: startX + (finalCenter.x - startX) * 0.72,
          y: laneY + (finalCenter.y - laneY) * 0.72
        };
        p3 = { x: finalCenter.x, y: finalCenter.y };
        duration = 4700;
      }

      // Mobile: keep the real image in its final flex-layout slot and animate
      // only its transform. The track SVG shares .hero-visual coordinates.
      // Desktop: retain the original hero-level overlay animation.
      Object.assign(scene.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${fmt(animationWidth)}px`,
        height: `${fmt(animationHeight)}px`,
        inset: 'auto',
        display: 'block',
        overflow: mobile ? 'hidden' : 'visible',
        pointerEvents: 'none',
        zIndex: mobile ? '1' : '8'
      });

      if (mobile) {
        heroVisual.appendChild(scene);
        heroCar.style.willChange = 'transform';
      } else {
        scene.appendChild(heroCar);
        movedToScene = true;
        Object.assign(heroCar.style, {
          position: 'absolute',
          left: `${fmt(finalLeft)}px`,
          top: `${fmt(finalTop)}px`,
          width: `${fmt(carWidth)}px`,
          height: `${fmt(carHeight)}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          margin: '0',
          zIndex: '9',
          opacity: '1',
          transform: 'none',
          objectFit: 'contain',
          pointerEvents: 'none',
          transition: 'none',
          willChange: 'transform'
        });
      }

      const frameCount = mobile ? 56 : 52;
      const keyframes = [];
      for (let i = 0; i <= frameCount; i++) {
        const t = i / frameCount;
        const point = cubicPoint(p0, p1, p2, p3, t);
        keyframes.push({
          offset: t,
          transform: `translate3d(${fmt(point.x - finalCenter.x)}px, ${fmt(point.y - finalCenter.y)}px, 0)`,
          opacity: 1
        });
      }

      // Two parallel tyre paths are sampled from the exact car curve.
      // The normal-based offset keeps the tracks beside the wheels on bends.
      const wheelOffset = carHeight * (mobile ? 0.25 : 0.27);
      const trackStartT = mobile ? 0.34 : 0.58;
      const pathSamples = 180;
      const frameSamples = 100;
      const pointAt = t => cubicPoint(p0, p1, p2, p3, t);

      const makeTrack = side => {
        const points = [];
        const cumulative = [0];

        for (let i = 0; i <= pathSamples; i++) {
          const t = trackStartT + (1 - trackStartT) * (i / pathSamples);
          const point = pointAt(t);
          const before = pointAt(Math.max(0, t - 0.001));
          const after = pointAt(Math.min(1, t + 0.001));
          const dx = after.x - before.x;
          const dy = after.y - before.y;
          const tangentLength = Math.hypot(dx, dy) || 1;
          const normalX = -dy / tangentLength;
          const normalY = dx / tangentLength;
          const shifted = {
            x: point.x + normalX * wheelOffset * side,
            y: point.y + normalY * wheelOffset * side,
            t
          };
          points.push(shifted);

          if (i > 0) {
            const previous = points[i - 1];
            cumulative.push(
              cumulative[i - 1] +
              Math.hypot(shifted.x - previous.x, shifted.y - previous.y)
            );
          }
        }

        const d = points.map((point, index) =>
          `${index === 0 ? 'M' : 'L'} ${fmt(point.x)} ${fmt(point.y)}`
        ).join(' ');

        const distanceAt = t => {
          if (t <= trackStartT) return 0;
          if (t >= 1) return cumulative[cumulative.length - 1];
          const position = ((t - trackStartT) / (1 - trackStartT)) * pathSamples;
          const index = Math.min(pathSamples - 1, Math.floor(position));
          const local = position - index;
          return cumulative[index] +
            (cumulative[index + 1] - cumulative[index]) * local;
        };

        return { d, distanceAt };
      };

      const upperTrack = makeTrack(-1);
      const lowerTrack = makeTrack(1);
      svg.setAttribute('viewBox', `0 0 ${fmt(animationWidth)} ${fmt(animationHeight)}`);
      svg.setAttribute('preserveAspectRatio', 'none');

      // Draw only the part of the route after the car enters the visible scene.
      // The marks use the same duration AND easing as the car. Their dash end is
      // calculated from the car's eased curve progress, so it cannot lag behind.
      const drawEasing = 'cubic-bezier(.2,.62,.24,1)';
      const trackPeak = path => {
        // Softer, more transparent tyre marks so they support the animation
        // without overpowering the hero section.
        if (path.classList.contains('tire-track-shadow')) return 0.07;
        if (path.classList.contains('tire-track-base')) return 0.16;
        return 0.42;
      };

      trackAnimations = [];
      [
        { selector: '[data-track="upper"]', track: upperTrack },
        { selector: '[data-track="lower"]', track: lowerTrack }
      ].forEach(({ selector, track }) => {
        svg.querySelectorAll(selector).forEach(path => {
          path.setAttribute('d', track.d);
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;
          const peak = trackPeak(path);
          const drawFrames = [];

          for (let i = 0; i <= frameSamples; i++) {
            const progress = i / frameSamples;
            const travelled = track.distanceAt(progress);
            const opacityProgress = Math.max(0, Math.min(1, (progress - trackStartT) / 0.07));
            drawFrames.push({
              offset: progress,
              strokeDashoffset: Math.max(0, length - travelled),
              opacity: peak * opacityProgress
            });
          }

          trackAnimations.push(path.animate(drawFrames, {
            duration,
            easing: drawEasing,
            fill: 'forwards'
          }));

          // Keep the shorter tread visible briefly after parking, then fade it.
          trackAnimations.push(path.animate([
            { opacity: peak, offset: 0 },
            { opacity: peak, offset: 0.18 },
            { opacity: 0, offset: 1 }
          ], {
            duration: 1100,
            delay: duration + 550,
            easing: 'ease-out',
            fill: 'forwards'
          }));
        });
      });

      tracksPending = trackAnimations.length > 0;
      carAnimation = heroCar.animate(keyframes, {
        duration,
        easing: 'cubic-bezier(.2,.62,.24,1)',
        fill: 'forwards'
      });

      carAnimation.finished.then(() => {
        if (!settled) settleAtFinalLayout(true);
      }).catch(() => {
        if (!settled) settleAtFinalLayout(true);
      });

      // A generous fallback only for a genuinely stalled animation. A brief
      // frame drop while scrolling must never force the car to jump to parking.
      safetyTimer = window.setTimeout(() => {
        if (!settled && carAnimation) {
          try { carAnimation.finish(); } catch (_) { settleAtFinalLayout(true); }
        }
      }, duration + 9000);

      // Do not listen to resize: mobile browser chrome changes viewport height
      // during ordinary scrolling. That is not a layout change for this intro.
      orientationHandler = () => settleAtFinalLayout();
      window.addEventListener('orientationchange', orientationHandler, { once: true });

      Promise.allSettled(trackAnimations.map(animation => animation.finished)).then(() => {
        tracksPending = false;
        scene.classList.add('is-hidden');
      });
    } catch (error) {
      settleAtFinalLayout();
    }
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
