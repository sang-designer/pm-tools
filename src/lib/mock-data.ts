import { Venue, Task } from "./types";

function task(id: string, venueId: string, type: Task["type"], question: string, options?: string[]): Task {
  return { id, type, question, options, venueId };
}

export const MOCK_VENUES: Venue[] = [
  {
    id: "v1", name: "Koffee", address: "1 La Vuelta, Orinda, CA",
    lat: 37.8784, lng: -122.1796, category: "Coffee Shop",
    tags: ["Chains"],
    tasks: [task("t1", "v1", "confirm_category", "Is 'Coffee Shop' the correct category for this venue?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v2", name: "901 Columbus Cafe", address: "901 Columbus Ave, San Francisco, CA",
    lat: 37.8005, lng: -122.4112, category: "Cafe",
    tags: ["Flagged", "Categories", "Chains"],
    tasks: [
      task("t2", "v2", "confirm_category", "Is 'Cafe' the correct category?", ["Yes", "No", "Not sure"]),
      task("t3", "v2", "verify_address", "Is '901 Columbus Ave' the correct address?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v3", name: "Baja Cali Taqueria & Grill", address: "1 La Vuelta, Orinda, CA",
    lat: 37.8801, lng: -122.1820, category: "Mexican Restaurant",
    tags: ["Details", "Attributes"],
    tasks: [task("t4", "v3", "confirm_hours", "Are the hours Mon-Sat 9AM-9PM correct?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v4", name: "Tartine Bakery", address: "600 Guerrero St, San Francisco, CA",
    lat: 37.7613, lng: -122.4243, category: "Bakery",
    tags: ["Details"],
    tasks: [
      task("t5", "v4", "verify_address", "Is '600 Guerrero St' the correct address?", ["Yes", "No", "Not sure"]),
      task("t5b", "v4", "confirm_hours", "Are the hours 8AM-7PM Mon-Fri correct?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v5", name: "Blue Bottle Coffee", address: "66 Mint St, San Francisco, CA",
    lat: 37.7824, lng: -122.4058, category: "Coffee Shop",
    tags: ["Chains", "Categories"],
    tasks: [task("t6", "v5", "confirm_category", "Is 'Coffee Shop' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v6", name: "Bi-Rite Creamery", address: "3692 18th St, San Francisco, CA",
    lat: 37.7617, lng: -122.4256, category: "Ice Cream Shop",
    tags: ["Details", "Attributes"],
    tasks: [
      task("t7", "v6", "confirm_hours", "Are hours 11AM-10PM daily correct?", ["Yes", "No", "Not sure"]),
      task("t7b", "v6", "verify_address", "Is '3692 18th St' the correct address?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v7", name: "Foreign Cinema", address: "2534 Mission St, San Francisco, CA",
    lat: 37.7568, lng: -122.4186, category: "Restaurant",
    tags: ["Details"],
    tasks: [task("t8", "v7", "confirm_category", "Is 'Restaurant' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v8", name: "Dolores Park Cafe", address: "501 Dolores St, San Francisco, CA",
    lat: 37.7610, lng: -122.4272, category: "Cafe",
    tags: ["Flagged"],
    tasks: [
      task("t9", "v8", "fix_coordinates", "Does the pin location look correct on the map?", ["Yes", "No", "Not sure"]),
      task("t9b", "v8", "confirm_category", "Is 'Cafe' the correct category?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v9", name: "Delfina", address: "3621 18th St, San Francisco, CA",
    lat: 37.7618, lng: -122.4247, category: "Italian Restaurant",
    tags: ["Categories"],
    tasks: [task("t10", "v9", "verify_address", "Is '3621 18th St' the correct address?", ["Yes", "No", "Not sure"])],
    globallyCompleted: true,
  },
  {
    id: "v10", name: "Philz Coffee", address: "3101 24th St, San Francisco, CA",
    lat: 37.7526, lng: -122.4184, category: "Coffee Shop",
    tags: ["Chains"],
    tasks: [
      task("t11", "v10", "confirm_category", "Is 'Coffee Shop' the correct category?", ["Yes", "No", "Not sure"]),
      task("t11b", "v10", "verify_address", "Is '3101 24th St' the correct address?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v11", name: "La Taqueria", address: "2889 Mission St, San Francisco, CA",
    lat: 37.7508, lng: -122.4181, category: "Taqueria",
    tags: ["Details", "Categories"],
    tasks: [task("t12", "v11", "confirm_category", "Is 'Taqueria' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v12", name: "Sightglass Coffee", address: "270 7th St, San Francisco, CA",
    lat: 37.7772, lng: -122.4068, category: "Coffee Shop",
    tags: ["Chains", "Details"],
    tasks: [
      task("t13", "v12", "verify_address", "Is '270 7th St' the correct address?", ["Yes", "No", "Not sure"]),
      task("t13b", "v12", "confirm_category", "Is 'Coffee Shop' the correct category?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v13", name: "Zuni Cafe", address: "1658 Market St, San Francisco, CA",
    lat: 37.7736, lng: -122.4215, category: "Restaurant",
    tags: ["Details"],
    tasks: [task("t14", "v13", "confirm_hours", "Are hours Tue-Sun 11:30AM-11PM correct?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v14", name: "Ritual Coffee Roasters", address: "1026 Valencia St, San Francisco, CA",
    lat: 37.7565, lng: -122.4214, category: "Coffee Shop",
    tags: ["Categories"],
    tasks: [task("t15", "v14", "confirm_category", "Is 'Coffee Shop' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v15", name: "Nopa", address: "560 Divisadero St, San Francisco, CA",
    lat: 37.7745, lng: -122.4378, category: "Restaurant",
    tags: ["Details", "Attributes"],
    tasks: [
      task("t16", "v15", "fix_coordinates", "Does the pin location look correct?", ["Yes", "No", "Not sure"]),
      task("t16b", "v15", "confirm_hours", "Are hours Mon-Fri 6PM-1AM correct?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v16", name: "Flour + Water", address: "2401 Harrison St, San Francisco, CA",
    lat: 37.7590, lng: -122.4132, category: "Italian Restaurant",
    tags: ["Details"],
    tasks: [task("t17", "v16", "verify_address", "Is '2401 Harrison St' the correct address?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v17", name: "Trick Dog", address: "3010 20th St, San Francisco, CA",
    lat: 37.7586, lng: -122.4220, category: "Bar",
    tags: ["Categories", "Flagged"],
    tasks: [task("t18", "v17", "confirm_category", "Is 'Bar' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v18", name: "Humphry Slocombe", address: "2790 Harrison St, San Francisco, CA",
    lat: 37.7536, lng: -122.4133, category: "Ice Cream Shop",
    tags: ["Details"],
    tasks: [task("t19", "v18", "confirm_hours", "Are hours 12PM-9PM daily correct?", ["Yes", "No", "Not sure"])],
    globallyCompleted: true,
  },
  {
    id: "v19", name: "Anchor Brewing", address: "1705 Mariposa St, San Francisco, CA",
    lat: 37.7638, lng: -122.3979, category: "Brewery",
    tags: ["Chains", "Attributes"],
    tasks: [task("t20", "v19", "confirm_category", "Is 'Brewery' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v20", name: "Dandelion Chocolate", address: "740 Valencia St, San Francisco, CA",
    lat: 37.7609, lng: -122.4216, category: "Chocolate Shop",
    tags: ["Details", "Attributes"],
    tasks: [
      task("t21", "v20", "verify_address", "Is '740 Valencia St' the correct address?", ["Yes", "No", "Not sure"]),
      task("t21b", "v20", "confirm_hours", "Are hours 10AM-9PM daily correct?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
  {
    id: "v21", name: "Nopalito", address: "306 Broderick St, San Francisco, CA",
    lat: 37.7725, lng: -122.4397, category: "Mexican Restaurant",
    tags: ["Categories"],
    tasks: [task("t22", "v21", "confirm_category", "Is 'Mexican Restaurant' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v22", name: "Piccino", address: "1001 Minnesota St, San Francisco, CA",
    lat: 37.7554, lng: -122.3897, category: "Restaurant",
    tags: ["Details"],
    tasks: [task("t23", "v22", "fix_coordinates", "Does the pin location look correct?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v23", name: "Lazy Bear", address: "3416 19th St, San Francisco, CA",
    lat: 37.7600, lng: -122.4220, category: "Restaurant",
    tags: ["Details", "Attributes"],
    tasks: [task("t24", "v23", "confirm_hours", "Are hours Wed-Sun 6PM-10PM correct?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v24", name: "Craftsman and Wolves", address: "746 Valencia St, San Francisco, CA",
    lat: 37.7607, lng: -122.4217, category: "Bakery",
    tags: ["Categories", "Details"],
    tasks: [task("t25", "v24", "confirm_category", "Is 'Bakery' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v25", name: "State Bird Provisions", address: "1529 Fillmore St, San Francisco, CA",
    lat: 37.7835, lng: -122.4324, category: "Restaurant",
    tags: ["Details"],
    tasks: [task("t26", "v25", "verify_address", "Is '1529 Fillmore St' the correct address?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v26", name: "El Farolito", address: "2779 Mission St, San Francisco, CA",
    lat: 37.7521, lng: -122.4181, category: "Taqueria",
    tags: ["Flagged", "Details"],
    tasks: [task("t27", "v26", "confirm_category", "Is 'Taqueria' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v27", name: "Toronado", address: "547 Haight St, San Francisco, CA",
    lat: 37.7717, lng: -122.4316, category: "Bar",
    tags: ["Categories"],
    tasks: [task("t28", "v27", "fix_coordinates", "Does the pin location look correct?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v28", name: "Four Barrel Coffee", address: "375 Valencia St, San Francisco, CA",
    lat: 37.7664, lng: -122.4220, category: "Coffee Shop",
    tags: ["Chains"],
    tasks: [task("t29", "v28", "confirm_category", "Is 'Coffee Shop' the correct category?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v29", name: "Mitchell's Ice Cream", address: "688 San Jose Ave, San Francisco, CA",
    lat: 37.7440, lng: -122.4245, category: "Ice Cream Shop",
    tags: ["Details", "Attributes"],
    tasks: [task("t30", "v29", "confirm_hours", "Are hours 11AM-11PM daily correct?", ["Yes", "No", "Not sure"])],
    globallyCompleted: false,
  },
  {
    id: "v30", name: "Plow", address: "1299 18th St, San Francisco, CA",
    lat: 37.7612, lng: -122.3903, category: "Breakfast Restaurant",
    tags: ["Categories", "Details"],
    tasks: [
      task("t31", "v30", "confirm_category", "Is 'Breakfast Restaurant' the correct category?", ["Yes", "No", "Not sure"]),
      task("t31b", "v30", "verify_address", "Is '1299 18th St' the correct address?", ["Yes", "No", "Not sure"]),
    ],
    globallyCompleted: false,
  },
];

export const INITIAL_COMPLETED_VENUES = [
  "v1", "v3", "v5", "v7", "v9",
  "v10", "v11", "v13", "v14", "v16",
  "v17", "v18", "v19", "v21", "v22",
];
