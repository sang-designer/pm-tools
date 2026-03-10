import { Venue, Task } from "./types";

const SF_NAMES = [
  "Bean There Cafe", "Golden Gate Grill", "Sunset Deli", "Bay Breeze Coffee",
  "Pacific Poke", "Haight Street Eats", "Castro Creamery", "Marina Bakehouse",
  "Nob Hill Pizza", "Embarcadero Sushi", "SoMa Smoothie Bar", "Potrero Taco Shop",
  "Dogpatch Diner", "Inner Sunset Cafe", "The Richmond Roastery", "Outer Lands Bistro",
  "Hayes Valley Tea", "Tenderloin Ramen", "Chinatown Dim Sum", "Japantown Matcha",
  "North Beach Espresso", "Bernal Heights BBQ", "Cole Valley Bakery", "Glen Park Grill",
  "Twin Peaks Tacos", "Excelsior Empanadas", "Visitacion Valley Pho", "Portola Pizzeria",
  "Bayview Burgers", "Crocker-Amazon Cafe",
];

const SF_STREETS = [
  "Market St", "Valencia St", "Mission St", "Haight St", "Divisadero St",
  "Fillmore St", "Geary Blvd", "Clement St", "Irving St", "Judah St",
  "Taraval St", "Ocean Ave", "Columbus Ave", "Broadway", "Grant Ave",
  "Polk St", "Larkin St", "Hyde St", "Powell St", "Stockton St",
];

const CATEGORIES = [
  "Coffee Shop", "Restaurant", "Bakery", "Cafe", "Bar", "Ice Cream Shop",
  "Taqueria", "Pizza Place", "Deli", "Juice Bar",
];

const TASK_TYPES: Task["type"][] = [
  "verify_address", "confirm_category", "confirm_hours", "fix_coordinates",
];

const QUESTIONS: Record<Task["type"], (name: string, val: string) => string> = {
  verify_address: (_, val) => `Is '${val}' the correct address?`,
  confirm_category: (_, val) => `Is '${val}' the correct category?`,
  confirm_hours: () => "Are the listed hours correct?",
  fix_coordinates: () => "Does the pin location look correct on the map?",
  photo_verification: () => "Does the photo match this venue?",
};

let generationCounter = 0;

export function generateVenues(count: number): Venue[] {
  const batch = ++generationCounter;
  const venues: Venue[] = [];

  for (let i = 0; i < count; i++) {
    const idx = (batch * count + i) % SF_NAMES.length;
    const id = `gen-${batch}-${i}`;
    const name = SF_NAMES[idx] + (batch > 1 ? ` #${batch}` : "");
    const streetNum = 100 + Math.floor(Math.random() * 2900);
    const street = SF_STREETS[Math.floor(Math.random() * SF_STREETS.length)];
    const address = `${streetNum} ${street}, San Francisco, CA`;
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const lat = 37.74 + Math.random() * 0.06;
    const lng = -122.45 + Math.random() * 0.06;

    const taskType = TASK_TYPES[Math.floor(Math.random() * TASK_TYPES.length)];
    const question = QUESTIONS[taskType](name, taskType === "verify_address" ? address : category);

    const task: Task = {
      id: `${id}-t1`,
      venueId: id,
      type: taskType,
      question,
      options: ["Yes", "No", "Not sure"],
    };

    const tags = ["Details"];
    if (Math.random() > 0.5) tags.push("Categories");
    if (Math.random() > 0.7) tags.push("Flagged");

    venues.push({
      id,
      name,
      address,
      lat,
      lng,
      category,
      tags,
      tasks: [task],
      globallyCompleted: false,
    });
  }

  return venues;
}
