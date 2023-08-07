import { faker } from "@faker-js/faker";

const roomFeatures = [
  "TV",
  "WiFi",
  "Safe",
  "Mini Bar",
  "Tea/Coffee",
  "Balcony",
  "Bath",
  "Shower",
  "Sea View",
  "Mountain View",
  "City View",
  "River View",
  "Garden View",
  "Pool View",
  "Patio",
  "Terrace",
  "Air Conditioning",
  "Heating",
  "Kitchen",
  "Dining Area",
  "Sofa",
  "Fireplace",
  "Private Entrance",
  "Soundproofing",
  "Wardrobe",
  "Clothes Rack",
  "Ironing Facilities",
  "Desk",
  "Seating Area",
  "Sofa Bed",
];

export function allRoomFeatures() {
  return roomFeatures;
}

export function randomRoomFeatures() {
  return roomFeatures[faker.number.int({ min: 0, max: roomFeatures.length - 1 })];
}

export function randomRoomFeaturesCount(count: number) {
  const features = [];

  for (let i = 0; i < count; i++) {
    features.push(randomRoomFeatures());
  }
  // This will remove all duplicates from the array
  return Array.from(new Set(features));
}
