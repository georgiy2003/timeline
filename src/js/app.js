import '../css/style.css';

import Timeline from './timeline.js';
import parseCoordinates from './coordinates.js';
import AudioRecorder from './audio.js';
import VideoRecorder from './video.js';

// Элементы страницы
const posts = document.querySelector('#posts');
const form = document.querySelector('#post-form');
const input = document.querySelector('#post-input');

const audioButton = document.querySelector('#audio-record');
const videoButton = document.querySelector('#video-record');

// Создание Timeline
const timeline = new Timeline(posts);

// Состояние записи
let isRecording = false;
let isVideoRecording = false;

let audioCoordinates = null;
let videoCoordinates = null;

// Модальное окно для ручного ввода координат
function requestManualCoordinates() {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');

    dialog.innerHTML = `
      <form class="coordinates-form">
        <h2>Не удалось определить местоположение</h2>
        <p>Введите координаты вручную:</p>

        <input
          class="coordinates-input"
          type="text"
          placeholder="51.50851, -0.12572"
          required
        >

        <p class="coordinates-error"></p>

        <div class="coordinates-buttons">
          <button type="submit">Подтвердить</button>
          <button type="button" class="cancel-button">Отмена</button>
        </div>
      </form>
    `;

    document.body.append(dialog);

    const manualForm = dialog.querySelector('.coordinates-form');
    const coordinatesInput = dialog.querySelector('.coordinates-input');
    const error = dialog.querySelector('.coordinates-error');
    const cancelButton = dialog.querySelector('.cancel-button');

    function finish(result) {
      dialog.close();
      dialog.remove();
      resolve(result);
    }

    manualForm.addEventListener('submit', (event) => {
      event.preventDefault();

      try {
        const coordinates = parseCoordinates(coordinatesInput.value);

        finish(coordinates);
      } catch (err) {
        error.textContent = err.message;
        coordinatesInput.setAttribute('aria-invalid', 'true');
      }
    });

    cancelButton.addEventListener('click', () => {
      finish(null);
    });

    dialog.addEventListener('cancel', () => {
      finish(null);
    });

    dialog.showModal();
  });
}

// Получение геолокации
function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
}

// Получение координат с возможностью ручного ввода
async function getCoordinatesWithFallback() {
  try {
    return await getCoordinates();
  } catch (error) {
    return await requestManualCoordinates();
  }
}

// Создание аудиозаписи
const audioRecorder = new AudioRecorder((audioUrl) => {
  if (!audioCoordinates) return;

  timeline.addMediaPost(
    'audio',
    audioUrl,
    audioCoordinates.latitude,
    audioCoordinates.longitude,
  );

  audioCoordinates = null;

  isRecording = false;
  audioButton.textContent = 'Записать аудио';
});

// Создание видеозаписи
const videoRecorder = new VideoRecorder((videoUrl) => {
  if (!videoCoordinates) return;

  timeline.addMediaPost(
    'video',
    videoUrl,
    videoCoordinates.latitude,
    videoCoordinates.longitude,
  );

  videoCoordinates = null;

  isVideoRecording = false;
  videoButton.textContent = 'Записать видео';
});

// Добавление текстовых сообщений
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  const coordinates = await getCoordinatesWithFallback();

  if (!coordinates) return;

  timeline.addPost(
    text,
    coordinates.latitude,
    coordinates.longitude,
  );

  input.value = '';
});

// Управление аудиозаписью
audioButton.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      audioCoordinates = await getCoordinatesWithFallback();

      if (!audioCoordinates) return;

      await audioRecorder.start();

      isRecording = true;
      audioButton.textContent = 'Остановить запись';
    } catch (error) {
      audioCoordinates = null;

      alert(
        'Не удалось начать запись. Проверьте доступ к микрофону.',
      );
    }
  } else {
    audioRecorder.stop();
  }
});

// Управление видеозаписью
videoButton.addEventListener('click', async () => {
  if (!isVideoRecording) {
    try {
      videoCoordinates = await getCoordinatesWithFallback();

      if (!videoCoordinates) return;

      await videoRecorder.start();

      isVideoRecording = true;
      videoButton.textContent = 'Остановить запись';
    } catch (error) {
      videoCoordinates = null;

      alert(
        'Не удалось начать запись. Проверьте доступ к камере и микрофону.',
      );
    }
  } else {
    videoRecorder.stop();
  }
});