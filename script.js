const timelineData = [
  ['信号 01','从“半部电台”起步','王诤参加红军后，参与组建红军无线电队。红色通信事业从残缺设备和有限条件中艰难起步。'],
  ['信号 02','电波成为“千里眼、顺风耳”','第二次反“围剿”中，无线电人员从敌军电讯中捕捉行动信息，为红军研判敌情、部署作战提供重要依据。'],
  ['信号 03','通信力量踏上长征','1934年中央红军开始长征，通信人员携带笨重的收发报机、蓄电池和充电设备随军转移。'],
  ['信号 04','交替转移保障联络','为了保障总部通信不间断，两支无线电分队分成梯队交替转移：一部先行设台，另一部留在原地继续工作。'],
  ['信号 05','从红色电波到智能时代','技术不断迭代，服务国家需要、保障信息安全、增进人民福祉的责任始终未变。']
];

const timelineBody = document.querySelector('.timeline-detail__body');
document.querySelectorAll('.timeline-item').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.timeline-item').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const [label,title,text] = timelineData[Number(button.dataset.index)];
    timelineBody.classList.add('leaving');
    setTimeout(() => {
      document.querySelector('#timelineLabel').textContent = label;
      document.querySelector('#timelineTitle').textContent = title;
      document.querySelector('#timelineText').textContent = text;
      timelineBody.classList.remove('leaving');
    }, 180);
  });
});

let audioCtx = null;
let musicGain = null;
let musicTimer = null;
let musicStep = 0;
let musicPlaying = false;
const musicToggle = document.querySelector('#musicToggle');
const musicToggleText = musicToggle.querySelector('.music-toggle__text');
const chordProgression = [
  [146.83,174.61,220.00],
  [116.54,146.83,174.61],
  [87.31,110.00,130.81],
  [130.81,164.81,196.00]
];

function ensureAudioContext(){
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (!musicGain) {
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.0001;
    musicGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function scheduleAmbientChord(){
  if (!musicPlaying || !audioCtx || !musicGain) return;
  const now = audioCtx.currentTime;
  const notes = chordProgression[musicStep % chordProgression.length];
  notes.forEach((frequency, index) => {
    const oscillator = audioCtx.createOscillator();
    const envelope = audioCtx.createGain();
    oscillator.type = index === 1 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = (index - 1) * 4;
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(index === 1 ? 0.18 : 0.1, now + 1.8);
    envelope.gain.setValueAtTime(index === 1 ? 0.18 : 0.1, now + 4.5);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 6.8);
    oscillator.connect(envelope); envelope.connect(musicGain);
    oscillator.start(now); oscillator.stop(now + 7);
  });
  musicStep += 1;
}

function updateMusicControl(){
  musicToggle.hidden = false;
  musicToggle.classList.toggle('is-paused', !musicPlaying);
  musicToggle.setAttribute('aria-pressed', String(musicPlaying));
  musicToggle.setAttribute('aria-label', musicPlaying ? '暂停背景音乐' : '播放背景音乐');
  musicToggleText.textContent = musicPlaying ? '音乐播放中' : '播放背景音乐';
}

async function startAmbientMusic(){
  try{
    ensureAudioContext();
    await audioCtx.resume();
    if (musicPlaying) return;
    musicPlaying = true;
    clearInterval(musicTimer);
    const now = audioCtx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(Math.max(musicGain.gain.value, 0.0001), now);
    musicGain.gain.exponentialRampToValueAtTime(0.045, now + 1.4);
    scheduleAmbientChord();
    musicTimer = setInterval(scheduleAmbientChord, 6200);
    localStorage.setItem('redRadioMusic','on');
    updateMusicControl();
  }catch(e){
    musicPlaying = false;
    updateMusicControl();
  }
}

function pauseAmbientMusic(){
  musicPlaying = false;
  clearInterval(musicTimer);
  musicTimer = null;
  if (audioCtx && musicGain) {
    const now = audioCtx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(Math.max(musicGain.gain.value, 0.0001), now);
    musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  }
  localStorage.setItem('redRadioMusic','off');
  updateMusicControl();
}

document.querySelector('#receiveSignal').addEventListener('click', () => {
  if (localStorage.getItem('redRadioMusic') !== 'off') startAmbientMusic();
  else updateMusicControl();
  document.querySelector('#timeline').scrollIntoView({behavior:'smooth'});
});

musicToggle.addEventListener('click', () => {
  if (musicPlaying) pauseAmbientMusic();
  else startAmbientMusic();
});

const frequency = document.querySelector('#frequency');
const frequencyValue = document.querySelector('#frequencyValue');
const radioConsole = document.querySelector('.radio-console');
const radioCapture = document.querySelector('.radio-console__capture');
frequency.addEventListener('input', () => {
  const value = Number(frequency.value);
  frequencyValue.textContent = (4.98 + value * 0.01).toFixed(2);
  const locked = value >= 68 && value <= 82;
  radioConsole.classList.toggle('is-locked', locked);
  radioCapture.textContent = locked ? '已捕获历史信号，正在收报…' : '';
  document.documentElement.style.setProperty('--freq', String(value));
  document.documentElement.style.setProperty('--tuneGlow', locked ? '.6' : '0');
});

const nav = document.querySelector('#siteNav');
function updateNav(){ nav.classList.toggle('nav--scrolled', scrollY > 70); }
addEventListener('scroll', updateNav, {passive:true});
updateNav();

document.documentElement.classList.add('js');
const revealIO = new IntersectionObserver((entries)=>{
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-in'); revealIO.unobserve(e.target); } });
},{threshold:.12, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

const progress = document.querySelector('.signal-progress');
function updateSignalProgress(){
  const max = document.documentElement.scrollHeight - innerHeight;
  const ratio = max > 0 ? scrollY / max : 0;
  progress.dataset.level = String(Math.min(4, Math.max(1, Math.ceil(ratio * 4))));
}
addEventListener('scroll', updateSignalProgress, {passive:true});
updateSignalProgress();

document.querySelectorAll('.answers button').forEach(button => {
  button.addEventListener('click', () => {
    const correct = button.dataset.correct === 'true';
    document.querySelectorAll('.answers button').forEach(item => {
      item.disabled = true;
      item.classList.add(item.dataset.correct === 'true' ? 'correct' : 'wrong');
    });
    document.querySelector('#quizResult').textContent = correct
      ? '信号接收成功！交替转移使总部电台能够保持不间断通信。'
      : '这次译码没有成功。正确答案是“两部电台交替转移”。';
  });
});

const saluteButton = document.querySelector('#saluteButton');
const flower = document.querySelector('#flower');
const saluteStatus = document.querySelector('#saluteStatus');
const signalOverlay = document.querySelector('#signalOverlay');
let overlayTimer;

const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
function morseFor(word){ return word.toUpperCase().split('').map(ch => MORSE[ch] || '').join(' '); }

function renderMorse(word){
  const box = document.querySelector('.morse');
  box.innerHTML = '';
  [...morseFor(word)].forEach((ch, i) => {
    const s = document.createElement('i');
    if (ch === '-') s.className = 'dash';
    else if (ch === ' ') { s.className = 'gap'; s.style.animationDelay = '0ms'; }
    if (ch !== ' ') s.style.animationDelay = (380 + i * 85) + 'ms';
    box.appendChild(s);
  });
}

function playMorseSound(word){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const code = morseFor(word).replace(/\s/g,'');
    let t = audioCtx.currentTime + 0.25;
    [...code].forEach(ch => {
      const dur = ch === '-' ? 0.16 : 0.07;
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = 680;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + dur + 0.03);
      t += dur + 0.06;
    });
  }catch(e){ /* 音频不可用时静默降级 */ }
}

function playSaluteSignal() {
  clearTimeout(overlayTimer);
  signalOverlay.classList.remove('is-active');
  void signalOverlay.offsetWidth;
  signalOverlay.classList.add('is-active');
  renderMorse('SIGNAL');
  playMorseSound('SIGNAL');
  overlayTimer = setTimeout(() => signalOverlay.classList.remove('is-active'), 2600);
}

if (localStorage.getItem('redRadioSalute') === 'sent') {
  flower.classList.add('sent');
  saluteButton.textContent = '再次播放致敬电波';
  saluteStatus.textContent = '感谢你完成这次精神接力。';
}
saluteButton.addEventListener('click', () => {
  localStorage.setItem('redRadioSalute','sent');
  flower.classList.add('sent');
  saluteButton.textContent = '再次播放致敬电波';
  saluteStatus.textContent = '感谢你完成这次精神接力。';
  playSaluteSignal();
});
