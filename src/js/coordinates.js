export default function parseCoordinates(input) {
  const regex = /^\s*\[?\s*(-?\d+(?:\.\d+)?)\s*,\s*([−-]?\d+(?:\.\d+)?)\s*\]?\s*$/;

  const match = input.match(regex);

  if (!match) {
    throw new Error('Неверный формат координат');
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[2].replace('−', '-'));

  if (
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  ) {
    throw new Error('Координаты находятся вне допустимого диапазона');
  }

  return {
    latitude,
    longitude,
  };
}