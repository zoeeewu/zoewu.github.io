document.querySelectorAll(".accordion").forEach((item) => {
  item.addEventListener("toggle", () => {
    item.setAttribute("aria-expanded", item.open ? "true" : "false");
  });
});

const resetVideo = (video) => {
  video.pause();
  video.currentTime = 0;
  video.closest(".project-video")?.classList.remove("is-playing");
};

document.querySelectorAll(".project-video").forEach((wrapper) => {
  const video = wrapper.querySelector("video");
  if (!video) return;

  video.muted = true;
  video.loop = false;
  video.autoplay = false;
  video.playsInline = true;
  video.preload = "metadata";
  video.removeAttribute("controls");

  const togglePlayback = () => {
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  wrapper.addEventListener("click", togglePlayback);
  wrapper.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePlayback();
    }
  });
  video.addEventListener("play", () => wrapper.classList.add("is-playing"));
  video.addEventListener("pause", () => wrapper.classList.remove("is-playing"));
  video.addEventListener("ended", () => wrapper.classList.remove("is-playing"));
});

document.querySelectorAll("[data-my-lens-gallery]").forEach((gallery) => {
  const track = gallery.querySelector(".my-lens-track");
  const originals = track ? Array.from(track.querySelectorAll(".my-lens-image")) : [];

  if (!track || originals.length < 2) return;

  const bufferSets = 2;
  const cloneSet = () => {
    const fragment = document.createDocumentFragment();
    originals.forEach((image) => {
      const clone = image.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("loading");
      fragment.append(clone);
    });
    return fragment;
  };

  for (let index = 0; index < bufferSets; index += 1) {
    track.insertBefore(cloneSet(), track.firstChild);
    track.append(cloneSet());
  }

  const images = Array.from(track.querySelectorAll(".my-lens-image"));
  const firstCenterImage = images[originals.length * bufferSets];
  let setWidth = 0;
  let centerStart = 0;
  let initialized = false;
  let hoveredIndex = null;
  let scrollFrame = 0;
  let scrollTimer = 0;
  let isScrolling = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const clearHover = () => {
    if (hoveredIndex === null) return;
    hoveredIndex = null;
    images.forEach((image) => image.style.removeProperty("--my-lens-shift"));
  };

  const applyHover = (index) => {
    if (!finePointer.matches || reducedMotion.matches || isScrolling) return;

    hoveredIndex = index;
    images.forEach((image, imageIndex) => {
      const distance = imageIndex - index;
      const direction = Math.sign(distance);
      const expansion = [0, 24, 14, 6];
      let magnitude = 0;

      for (let step = 1; step <= Math.abs(distance); step += 1) {
        magnitude += expansion[step] || 0;
      }

      const shift = direction * magnitude;
      image.style.setProperty("--my-lens-shift", `${shift}px`);
    });
  };

  const measure = () => {
    const nextCenterImage = images[originals.length * (bufferSets + 1)];
    if (!firstCenterImage || !nextCenterImage) return false;

    centerStart = firstCenterImage.offsetLeft;
    setWidth = nextCenterImage.offsetLeft - centerStart;
    return setWidth > 0;
  };

  const normalizeScroll = () => {
    if (!setWidth) return;

    const lowerBound = centerStart - setWidth * 0.75;
    const upperBound = centerStart + setWidth * 0.75;
    let nextScrollLeft = gallery.scrollLeft;

    while (nextScrollLeft < lowerBound) nextScrollLeft += setWidth;
    while (nextScrollLeft > upperBound) nextScrollLeft -= setWidth;

    if (nextScrollLeft !== gallery.scrollLeft) gallery.scrollLeft = nextScrollLeft;
  };

  const refresh = () => {
    if (!measure()) return;
    if (!initialized) {
      gallery.scrollLeft = centerStart;
      initialized = true;
      return;
    }
    normalizeScroll();
  };

  const waitForImages = Promise.all(
    originals.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );

  waitForImages.then(() => requestAnimationFrame(refresh));
  window.addEventListener("load", () => requestAnimationFrame(refresh), { once: true });
  window.addEventListener("resize", () => requestAnimationFrame(refresh));

  gallery.addEventListener("scroll", () => {
    clearHover();
    isScrolling = true;
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
    }, 100);

    if (!scrollFrame) {
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        normalizeScroll();
      });
    }
  });

  gallery.addEventListener("wheel", (event) => {
    if (!event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    gallery.scrollLeft += event.deltaY;
  }, { passive: false });

  images.forEach((image, index) => {
    image.addEventListener("dragstart", (event) => event.preventDefault());
    image.addEventListener("pointerenter", () => applyHover(index));
  });
  gallery.addEventListener("pointerleave", clearHover);
  gallery.addEventListener("pointerdown", clearHover);
});

document.querySelectorAll(".figure-carousel").forEach((carousel) => {
  const frame = carousel.querySelector(".figure-carousel-frame");
  const previousButton = carousel.querySelector(".figure-carousel-button-prev");
  const nextButton = carousel.querySelector(".figure-carousel-button-next");
  const carouselCaption = carousel.querySelector(".figure-carousel-caption");

  if (!frame) return;

  let items = Array.from(carousel.querySelectorAll(".figure-carousel-item"));
  const videos = Array.from(carousel.querySelectorAll("video"));

  const getMediaElement = (item) => item.querySelector("img, video");
  const getSequence = (item) => {
    const src = getMediaElement(item)?.getAttribute("src") || "";
    const filename = decodeURIComponent(src.split("/").pop() || "");
    const match = filename.match(/^(\d+(?:\.\d+)*)_/);
    return match ? match[1].split(".").map(Number) : null;
  };
  const compareSequence = (left, right) => {
    if (!left) return right ? 1 : 0;
    if (!right) return -1;
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const difference = (left[index] ?? -1) - (right[index] ?? -1);
      if (difference) return difference;
    }
    return 0;
  };

  const originalIndexes = new Map(items.map((item, index) => [item, index]));
  items.sort((left, right) => {
    const leftIsMain = left.dataset.mainImage === "true";
    const rightIsMain = right.dataset.mainImage === "true";
    if (leftIsMain !== rightIsMain) return leftIsMain ? -1 : 1;

    const leftIsVideo = getMediaElement(left)?.tagName === "VIDEO";
    const rightIsVideo = getMediaElement(right)?.tagName === "VIDEO";
    if (leftIsVideo !== rightIsVideo) return leftIsVideo ? 1 : -1;

    return compareSequence(getSequence(left), getSequence(right))
      || originalIndexes.get(left) - originalIndexes.get(right);
  });
  items.forEach((item, index) => {
    item.dataset.index = index;
    frame.insertBefore(item, previousButton);
  });

  const pauseAndResetVideo = (item) => {
    const video = item?.querySelector("video");
    if (!video) return;
    resetVideo(video);
  };

  if (items.length < 2) return;

  let activeIndex = 0;
  let isTransitioning = false;

  const setFrameRatio = () => {
    const mainImage = items[0]?.querySelector("img");
    if (!mainImage) return;

    const applyRatio = () => {
      if (!mainImage.naturalWidth || !mainImage.naturalHeight) return;
      frame.style.setProperty(
        "--carousel-ratio",
        `${mainImage.naturalWidth} / ${mainImage.naturalHeight}`,
      );
    };

    if (mainImage.complete) {
      applyRatio();
    } else {
      mainImage.addEventListener("load", applyRatio, { once: true });
    }
  };

  const resetItemState = (item) => {
    item.classList.remove(
      "is-active",
      "is-enter-next",
      "is-enter-prev",
      "is-leave-next",
      "is-leave-prev",
      "is-hidden",
    );
  };

  const updateCaption = () => {
    const activeCaption = items[activeIndex]?.querySelector("figcaption")?.textContent?.trim() || "";
    if (carouselCaption) {
      carouselCaption.textContent = activeCaption;
      carouselCaption.hidden = !activeCaption;
    }
  };

  const showActiveOnly = () => {
    items.forEach((item, index) => {
      resetItemState(item);
      if (index === activeIndex) {
        item.classList.add("is-active");
      } else {
        item.classList.add("is-hidden");
      }
    });
    updateCaption();
  };

  const goToSlide = (nextIndex, direction) => {
    if (isTransitioning || nextIndex === activeIndex || nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const outgoing = items[activeIndex];
    const incoming = items[nextIndex];

    isTransitioning = true;
    pauseAndResetVideo(outgoing);
    activeIndex = nextIndex;

    resetItemState(incoming);
    incoming.classList.add(direction === "next" ? "is-enter-next" : "is-enter-prev");
    outgoing.classList.remove("is-active");

    frame.offsetWidth;

    outgoing.classList.add(direction === "next" ? "is-leave-next" : "is-leave-prev");
    incoming.classList.remove(direction === "next" ? "is-enter-next" : "is-enter-prev");
    incoming.classList.add("is-active");
    updateCaption();

    const finishTransition = () => {
      outgoing.removeEventListener("transitionend", finishTransition);
      resetItemState(outgoing);
      outgoing.classList.add("is-hidden");
      videos.forEach((video) => {
        if (!incoming.contains(video)) {
          resetVideo(video);
        }
      });
      isTransitioning = false;
    };

    outgoing.addEventListener("transitionend", finishTransition);
  };

  previousButton?.addEventListener("click", () => {
    goToSlide((activeIndex - 1 + items.length) % items.length, "prev");
  });

  nextButton?.addEventListener("click", () => {
    goToSlide((activeIndex + 1) % items.length, "next");
  });

  setFrameRatio();
  showActiveOnly();
});
