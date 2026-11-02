export default class Timeline {
  constructor(container) {
    this.container = container;
  }

  addPost(text, latitude, longitude) {
    const post = document.createElement('article');
    post.classList.add('post');

    const message = document.createElement('p');
    message.classList.add('post__message');
    message.textContent = text;

    const coordinates = document.createElement('div');
    coordinates.classList.add('post__coordinates');
    coordinates.textContent = `[${latitude}, ${longitude}]`;

    const date = document.createElement('time');
    date.classList.add('post__date');
    date.textContent = new Date().toLocaleString('ru-RU');

    post.append(message, coordinates, date);

    this.container.prepend(post);
  }

  addMediaPost(type, mediaUrl, latitude, longitude) {
    const post = document.createElement('article');
    post.classList.add('post');

    const player = document.createElement(
      type === 'audio' ? 'audio' : 'video',
    );

    player.src = mediaUrl;
    player.controls = true;

    if (type === 'video') {
      player.width = 300;
    }

    const coordinates = document.createElement('div');
    coordinates.classList.add('post__coordinates');
    coordinates.textContent = `[${latitude}, ${longitude}]`;

    const date = document.createElement('time');
    date.classList.add('post__date');
    date.textContent = new Date().toLocaleString('ru-RU');

    post.append(player, coordinates, date);

    this.container.prepend(post);
  }
}