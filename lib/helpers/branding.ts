import Env from "./env";

export const defaultBranding = {
  name: "Shady Meadows B&B",
  map: {
    latitude: 52.6351204,
    longitude: 1.2733774,
  },
  logoUrl: `${Env.URL}/images/room2.jpg`,
  description:
    "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.",
  contact: {
    name: "Shady Meadows B&B",
    address: "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S",
    phone: "012345678901",
    email: "fake@fakeemail.com",
  },
};

export const defaultBrandingShortLogo = {
  name: "Shady Meadows B&B",
  map: {
    latitude: 52.6351204,
    longitude: 1.2733774,
  },
  logoUrl: "/images/rbp-logo.jpg",
  description:
    "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.",
  contact: {
    name: "Shady Meadows B&B",
    address: "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S",
    phone: "012345678901",
    email: "fake@fakeemail.com",
  },
};

export const updatedBranding = {
  name: "Test Name",
  map: {
    latitude: 41.8781,
    longitude: 87.6298,
  },
  logoUrl: "https://media.tenor.com/KaCUHzQxVWcAAAAC/house.gif",
  description: "description",
  contact: {
    name: "Testy McTester",
    address: "100 Testing Way",
    phone: "5555555555",
    email: "testy@testymtesterface.com",
  },
};
