// -------------------------------------------------------------
// Datasets, Models, and Constants
// -------------------------------------------------------------

const PLANETS = [
  { name: "Sun", symbol: "☉", angle: 45, color: "#fef08a", node: "12th House Lion" },
  { name: "Moon", symbol: "☽", angle: 120, color: "#a5b4fc", node: "4th House Scorpion" },
  { name: "Mercury", symbol: "☿", angle: 80, color: "#f472b6", node: "1st House Virgo" },
  { name: "Venus", symbol: "♀", angle: 15, color: "#fda4af", node: "11th House Crab" },
  { name: "Mars", symbol: "♂", angle: 210, color: "#f87171", node: "7th House Ram" },
  { name: "Jupiter", symbol: "♃", angle: 300, color: "#fdba74", node: "9th House Archer" },
  { name: "Saturn", symbol: "♄", angle: 260, color: "#c084fc", node: "6th House Goat" }
];

const ASPECT_LINES = [
  { id: "aspect-1", p1: "Sun", p2: "Moon", type: "Celestial Trine ( 120° )", strength: "Dominant Core Node", desc: "A harmonious angle flowing between solar consciousness and lunar subconscious nodes, aligning inner impulses with outward expression." },
  { id: "aspect-2", p1: "Mercury", p2: "Saturn", type: "Stellar Square ( 90° )", strength: "High Friction Tension", desc: "Intellectual communication channels meet rigid structure boundaries. Demands meditative introspection to channel successfully." },
  { id: "aspect-3", p1: "Venus", p2: "Jupiter", type: "Golden Sextile ( 60° )", strength: "Prosperity Resonance", desc: "An alignment suggesting high material abundance potential, soft artistic vectors, and relational ease in upcoming cycles." },
  { id: "aspect-4", p1: "Mars", p2: "Saturn", type: "Orbital Opposition ( 180° )", strength: "Polarized Magnetism", desc: "Active motivation directly squares structured limitations, creating a push-pull dynamic that refines persistent core focus." }
];

const TAROT_CARDS = [
  {
    name: "The Star (XVIII)",
    type: "Major Arcana",
    interpretation: "A beacon of hope, celestial inspiration, and profound spiritual renewal. The cosmic spheres promise a phase of peace, artistic attunement, and subtle nodes alignment.",
    colorClass: "from-indigo-500/20 to-purple-500/10 border-indigo-500/60"
  },
  {
    name: "The High Priestess (II)",
    type: "Major Arcana",
    interpretation: "Intuition, secret wisdom, and the subconscious realm. Look inward; the solutions you seek are currently gestating within your soft emotional shadow spaces.",
    colorClass: "from-violet-500/20 to-[#9d7df0]/10 border-[#9d7df0]/60"
  },
  {
    name: "The Wheel of Fortune (X)",
    type: "Major Arcana",
    interpretation: "A decisive turning point in your alignment cycle. Karma, destiny, and the sudden favorable shift of planetary structures are working deeply in your favor.",
    colorClass: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/60"
  }
];

const ZODIAC_SYMBOLS = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓"
};

// Fallback spiritual alignment responses if hosted on a static server (without the node backend server)
const OFFLINE_GUIDANCE = {
  "destiny": {
    guidance: "The stellar alignments suggest a powerful convergence. Your energetic core is receptive to new spiritual pathways, anchoring structural growth.",
    auraColor: "Cosmic Indigo & Pale Gold",
    luckyNumber: 88,
    celestialAdvice: "Accept the present alignment shift. Maintain clarity within your daily routine cycles."
  },
  "inner-peace": {
    guidance: "The quiet ocean within reflects the celestial structures above. It is time to focus on restorative cycles and peace nodes integration.",
    auraColor: "Restorative Emerald & Pale Teal",
    luckyNumber: 22,
    celestialAdvice: "Breathe, set aside heavy burdens, and cultivate conscious present silence."
  },
  "wealth": {
    guidance: "The flow of abundance moves rapidly through your sectors. Aligning with natural geometry will open professional doors and manifest destiny values.",
    auraColor: "Shimmering Amber & Emerald Dust",
    luckyNumber: 55,
    celestialAdvice: "Keep your visions elevated and execute structural tasks step by step."
  },
  "love": {
    guidance: "A magnetic pull aligns your relational orbits, inviting deep mutual comprehension. Bridges of understanding are ready to build.",
    auraColor: "Soft Rose & Shimmering Orchid",
    luckyNumber: 11,
    celestialAdvice: "Speak with open vulnerability; align your outward expressions with true elements."
  }
};

// -------------------------------------------------------------
// Core UI Operations Coordinator
// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Dynamic Mandala Synthesizer
  const mandalaSvg = document.getElementById("mandala-svg");
  const aspectDetailsBox = document.getElementById("aspect-details-display-box");
  const birthForm = document.getElementById("birth-chart-form");
  const synthOutcomeBox = document.getElementById("chart-synthesis-outcome-box");
  const synthBtn = document.getElementById("synthesize-chart-btn");

  let activeAspectId = null;
  let dynamicAngleOffset = 0;

  function polarToCartesian(angle, radius) {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(radians),
      y: 200 + radius * Math.sin(radians)
    };
  }

  function renderSvgMandala() {
    if (!mandalaSvg) return;

    while (mandalaSvg.firstChild) {
      mandalaSvg.removeChild(mandalaSvg.firstChild);
    }

    // A. Aspect lines SVG
    ASPECT_LINES.forEach((aspect) => {
      const p1Obj = PLANETS.find(p => p.name === aspect.p1);
      const p2Obj = PLANETS.find(p => p.name === aspect.p2);

      if (p1Obj && p2Obj) {
        const coord1 = polarToCartesian(p1Obj.angle + dynamicAngleOffset, 120);
        const coord2 = polarToCartesian(p2Obj.angle + dynamicAngleOffset, 120);
        const isHovered = activeAspectId === aspect.id;

        const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        lineGroup.setAttribute("style", "cursor: pointer");

        const visualLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        visualLine.setAttribute("x1", coord1.x.toString());
        visualLine.setAttribute("y1", coord1.y.toString());
        visualLine.setAttribute("x2", coord2.x.toString());
        visualLine.setAttribute("y2", coord2.y.toString());
        visualLine.setAttribute("stroke", isHovered ? "#9d7df0" : "rgba(157, 125, 240, 0.15)");
        visualLine.setAttribute("stroke-width", isHovered ? "3.5" : "1.5");
        visualLine.setAttribute("style", "transition: all 0.3s ease");
        if (aspect.id === "aspect-2") visualLine.setAttribute("stroke-dasharray", "4 4");

        const hoverTrigger = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hoverTrigger.setAttribute("x1", coord1.x.toString());
        hoverTrigger.setAttribute("y1", coord1.y.toString());
        hoverTrigger.setAttribute("x2", coord2.x.toString());
        hoverTrigger.setAttribute("y2", coord2.y.toString());
        hoverTrigger.setAttribute("stroke", "transparent");
        hoverTrigger.setAttribute("stroke-width", "18");

        lineGroup.appendChild(visualLine);
        lineGroup.appendChild(hoverTrigger);

        lineGroup.addEventListener("mouseenter", () => {
          visualLine.setAttribute("stroke", "#9d7df0");
          visualLine.setAttribute("stroke-width", "3.5");
        });

        lineGroup.addEventListener("mouseleave", () => {
          if (activeAspectId !== aspect.id) {
            visualLine.setAttribute("stroke", "rgba(157, 125, 240, 0.15)");
            visualLine.setAttribute("stroke-width", "1.5");
          }
        });

        lineGroup.addEventListener("click", () => {
          activeAspectId = aspect.id;
          renderSvgMandala();
          updateAspectReadingBox(aspect);
        });

        mandalaSvg.appendChild(lineGroup);
      }
    });

    // B. Planet nodes
    PLANETS.forEach((planet) => {
      const coord = polarToCartesian(planet.angle + dynamicAngleOffset, 120);

      const planetGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      planetGroup.setAttribute("style", "cursor: help");

      const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      outerCircle.setAttribute("cx", coord.x.toString());
      outerCircle.setAttribute("cy", coord.y.toString());
      outerCircle.setAttribute("r", "12");
      outerCircle.setAttribute("fill", "#080510");
      outerCircle.setAttribute("stroke", planet.color);
      outerCircle.setAttribute("stroke-width", "1.5");

      const glyphText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      glyphText.setAttribute("x", coord.x.toString());
      glyphText.setAttribute("y", (coord.y + 4).toString());
      glyphText.setAttribute("fill", planet.color);
      glyphText.setAttribute("font-size", "12");
      glyphText.setAttribute("font-family", "monospace");
      glyphText.setAttribute("text-anchor", "middle");
      glyphText.textContent = planet.symbol;

      planetGroup.appendChild(outerCircle);
      planetGroup.appendChild(glyphText);
      mandalaSvg.appendChild(planetGroup);
    });
  }

  function updateAspectReadingBox(aspect) {
    if (!aspectDetailsBox) return;
    aspectDetailsBox.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1.5">
          <span class="text-xs font-serif text-[#e0d8d0] tracking-wider italic">Aspect Alignment: ${aspect.type}</span>
          <span class="text-[9px] font-sans uppercase bg-purple-950/30 text-[#9d7df0] border border-[#9d7df0]/20 px-1.5 py-0.5 rounded">
            ${aspect.strength}
          </span>
        </div>
        <p class="text-xs text-zinc-400 leading-relaxed font-sans font-light">${aspect.desc}</p>
      </div>
    `;
  }

  renderSvgMandala();

  if (birthForm) {
    birthForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const birthDateInput = document.getElementById("birth-date-input");
      const birthTimeInput = document.getElementById("birth-time-input");
      const birthPlaceInput = document.getElementById("birth-place-input");

      if (!birthDateInput || !birthTimeInput || !birthPlaceInput) return;

      if (synthBtn) {
        synthBtn.setAttribute("disabled", "true");
        synthBtn.innerHTML = `Calculating Degrees...`;
      }

      let intervalCount = 0;
      const spinInterval = setInterval(() => {
        dynamicAngleOffset += 24;
        renderSvgMandala();
        intervalCount++;
        if (intervalCount >= 10) clearInterval(spinInterval);
      }, 70);

      // Perform simulation (works offline anywhere without a dedicated node server)
      setTimeout(() => {
        const outcomeAscendant = document.getElementById("outcome-ascendant");
        const outcomeEnergy = document.getElementById("outcome-energy");
        const outcomeTotem = document.getElementById("outcome-totem");
        const outcomeDesc = document.getElementById("outcome-description");

        if (outcomeAscendant) outcomeAscendant.textContent = "Rising Scorpio";
        if (outcomeEnergy) outcomeEnergy.textContent = "Mystic Ether & Warm Flame";
        if (outcomeTotem) outcomeTotem.textContent = "The Astral Hawk";
        if (outcomeDesc) outcomeDesc.textContent = `Natal records for ${birthPlaceInput.value || "San Francisco"} mapped successfully. Solar-Neptune coordinates present a highly intuitive spiritual blueprint, balancing physical activity on your local Leo zenith.`;

        if (synthOutcomeBox) {
          synthOutcomeBox.classList.remove("hidden");
        }

        if (synthBtn) {
          synthBtn.removeAttribute("disabled");
          synthBtn.textContent = "Forge Natal Mandala";
        }
      }, 900);
    });
  }

  // 2. Cosmic Aura Alignment Ritual Handler
  const ritualForm = document.getElementById("affirmation-form");
  const themeBtns = document.querySelectorAll(".ritual-theme-btn");
  const signSelect = document.getElementById("alignment-zodiac-select");
  const intentionArea = document.getElementById("ritual-intention-textarea");

  const emptyView = document.getElementById("alignment-empty-view");
  const loadingView = document.getElementById("alignment-loading-view");
  const successView = document.getElementById("alignment-success-view");

  let activeTheme = "destiny";

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      themeBtns.forEach((b) => {
        b.className = "ritual-theme-btn flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all cursor-pointer bg-white/[0.01] border-white/5 hover:border-white/10 text-zinc-400";
      });
      btn.className = "ritual-theme-btn flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all cursor-pointer bg-[#9d7df0]/10 border-[#9d7df0] text-zinc-100";
      activeTheme = btn.getAttribute("data-theme") || "destiny";
    });
  });

  if (ritualForm) {
    ritualForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!signSelect) return;
      const signVal = signSelect.value;

      if (emptyView) emptyView.classList.add("hidden");
      if (successView) successView.classList.add("hidden");
      if (loadingView) loadingView.classList.remove("hidden");

      setTimeout(() => {
        const displaySymbol = document.getElementById("output-zodiac-symbol");
        const displayTitle = document.getElementById("output-zodiac-title");
        const displayTheme = document.getElementById("output-theme-title");
        const displayPara = document.getElementById("output-guidance-paragraph");
        const displayColor = document.getElementById("output-aura-color");
        const displayNum = document.getElementById("output-auspicious-number");
        const displayAdvice = document.getElementById("output-ritual-advice");

        const selection = OFFLINE_GUIDANCE[activeTheme] || OFFLINE_GUIDANCE.destiny;

        if (displaySymbol) displaySymbol.textContent = ZODIAC_SYMBOLS[signVal] || "✨";
        if (displayTitle) displayTitle.textContent = `${signVal} Ascendant Aspect`;
        if (displayTheme) displayTheme.textContent = `Aspect focus: ${activeTheme}`;
        if (displayPara) displayPara.textContent = `"${selection.guidance}"`;
        if (displayColor) displayColor.textContent = selection.auraColor;
        if (displayNum) displayNum.textContent = selection.luckyNumber;
        if (displayAdvice) displayAdvice.textContent = selection.celestialAdvice;

        if (loadingView) loadingView.classList.add("hidden");
        if (successView) successView.classList.remove("hidden");
      }, 800);
    });
  }

  // 3. Tarot Deck Interactive drawer
  const unopenedDeck = document.getElementById("tarot-unopened-deck");
  const revealedContainer = document.getElementById("tarot-revealed-container");
  const deckCardButtons = document.querySelectorAll(".tarot-card-element");

  const cardFrame = document.getElementById("tarot-card-color-frame");
  const cardName = document.getElementById("revealed-tarot-name");
  const cardType = document.getElementById("revealed-tarot-type");
  const cardInterp = document.getElementById("revealed-tarot-interpretation");
  const drawAgainBtn = document.getElementById("tarot-draw-again-btn");

  deckCardButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idxStr = btn.getAttribute("data-tarot-index");
      if (!idxStr) return;

      const idx = parseInt(idxStr, 10);
      const chosenCard = TAROT_CARDS[idx];

      btn.classList.add("scale-95", "opacity-50");

      setTimeout(() => {
        if (cardName) cardName.textContent = chosenCard.name;
        if (cardType) cardType.textContent = chosenCard.type.toUpperCase();
        if (cardInterp) cardInterp.textContent = chosenCard.interpretation;

        if (cardFrame) {
          cardFrame.className = `p-8 rounded-2xl bg-gradient-to-b ${chosenCard.colorClass} border-2 border-[#9d7df0] shadow-[0_0_30px_rgba(157,125,240,0.15)] space-y-6 text-center relative overflow-hidden transition-all duration-700`;
        }

        if (unopenedDeck) unopenedDeck.classList.add("hidden");
        if (revealedContainer) revealedContainer.classList.remove("hidden");

        btn.classList.remove("scale-95", "opacity-50");
      }, 600);
    });
  });

  if (drawAgainBtn) {
    drawAgainBtn.addEventListener("click", () => {
      if (revealedContainer) revealedContainer.classList.add("hidden");
      if (unopenedDeck) unopenedDeck.classList.remove("hidden");
    });
  }

  // 4. Consultation Intake Booking State Manager
  const bookingForm = document.getElementById("booking-session-form");
  const bookingSuccessBox = document.getElementById("booking-success-box");
  const resetBookingBtn = document.getElementById("booking-success-reset-btn");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("booking-name-input");
      const emailInput = document.getElementById("booking-email-input");

      if (!nameInput || !emailInput) return;

      const successName = document.getElementById("success-display-name");
      const successEmail = document.getElementById("success-display-email");

      if (successName) successName.textContent = nameInput.value;
      if (successEmail) successEmail.textContent = emailInput.value;

      bookingForm.classList.add("hidden");
      if (bookingSuccessBox) bookingSuccessBox.classList.remove("hidden");
    });
  }

  if (resetBookingBtn) {
    resetBookingBtn.addEventListener("click", () => {
      if (bookingSuccessBox) bookingSuccessBox.classList.add("hidden");
      if (bookingForm) {
        bookingForm.reset();
        bookingForm.classList.remove("hidden");
      }
    });
  }

  // 5. Ambient Hero Interactive Sparks Layer
  const starsContainer = document.getElementById("hero-stars-container");
  if (starsContainer) {
    for (let i = 0; i < 45; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2 + 1;
      star.className = "absolute bg-white rounded-full animate-cosmic-pulse opacity-40 pointer-events-none";
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 95}%`;
      star.style.top = `${Math.random() * 90}%`;
      star.style.animationDelay = `${Math.random() * 6}s`;
      starsContainer.appendChild(star);
    }
  }

});