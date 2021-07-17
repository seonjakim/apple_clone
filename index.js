import './src/styles/main.css'
import './src/styles/reset.css'

(() => {
  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let enterNewScene = false;
  const sceneInfo = [
    {
      type: 'sticky',
      heightNum:5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-1 .main-message.b'),
        messageC: document.querySelector('#scroll-section-2 .main-message.c'),
        messageD: document.querySelector('#scroll-section-3 .main-message.d')
      },
      values: {
        messageAopacity: [0, 1, {start: 0.1, end: 0.2}],
        messageBopacity: [0, 1, {start: 0.3, end: 0.4}],
      }
    },
    {
      type: 'normal',
      heightNum:5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      type: 'sticky',
      heightNum:5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2')
      }

    },
    {
      type: 'sticky',
      heightNum:5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3')
      }

    }
  ]

  const setLayout = () => {
    /** 각 스크롤 섹션 높이 세팅 */
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
    }
    
    /** get currentScene info when refresh */
    yOffset = window.pageYOffset
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break ;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`)
  }
  
  const calcValues = (values, currentYOffset) => {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight
    let scrollRatio = currentYOffset / scrollHeight
    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight
      const partScrollEnd = values[2].end * scrollHeight
      const partScrollHeight = partScrollEnd - partScrollStart
      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {

        rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]
      } else if (currentYOffset < partScrollStart) {
        rv = values[0]
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1]
      }
    } else {

      rv = scrollRatio * (values[1] - values[0]) + values[0]
    }
    return rv;
  }

  const playAnimation = () => {
    const objs = sceneInfo[currentScene].objs
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    switch (currentScene) {
      case 0:
        let messageAopacityIn = calcValues(values.messageAopacity, currentYOffset)
        objs.messageA.style.opacity = messageAopacityIn
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  const scrollLoop = () => {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
    if (yOffset >= 0 && yOffset < prevScrollHeight) {
      enterNewScene = true
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
    if (enterNewScene) return ;
    playAnimation();
  }

  window.addEventListener('resize', setLayout)
  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  })
  window.addEventListener('load', setLayout);
})();